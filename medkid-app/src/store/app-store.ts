import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { MedCase, ChatMessage, DebugLog } from '@/types';
import { db } from '@/lib/mock-db';
import { runPipeline, createNewCase } from '@/lib/pipeline';

// ─── State shape ──────────────────────────────────────────────────────────────

interface AppState {
  // Session
  sessionId: string | null;
  isConsented: boolean;
  isOnboarded: boolean;

  // UI mode
  isEmergency: boolean;
  emergencyKeywords: string[];
  isProcessing: boolean;
  showDebugConsole: boolean;

  // Cases
  cases: MedCase[];
  selectedCaseId: string | null;

  // Chat (parent side)
  chatMessages: ChatMessage[];

  // Debug logs
  debugLogs: DebugLog[];

  // Actions
  grantConsent: () => void;
  completeOnboarding: () => void;
  logout: () => void;
  logDataRightsEvent: (event: 'CONSENT_WITHDRAWN' | 'DATA_DELETION_REQUESTED' | 'DATA_EXPORT_REQUESTED') => void;
  sendMessage: (text: string, images?: string[]) => Promise<void>;
  selectCase: (id: string | null) => void;
  approveCase: (caseId: string, finalDraft: string) => void;
  rejectCase: (caseId: string, reason: string) => void;
  toggleDebugConsole: () => void;
  refreshDebugLogs: () => void;
  resetEmergency: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAppStore = create<AppState>((set, get) => ({
  sessionId: null,
  isConsented: false,
  isOnboarded: false,
  isEmergency: false,
  emergencyKeywords: [],
  isProcessing: false,
  showDebugConsole: false,
  cases: db.cases.list(),
  selectedCaseId: null,
  chatMessages: [],
  debugLogs: [],

  grantConsent: () => {
    const sessionId = uuidv4();
    db.audit.log('CONSENT_GRANTED', sessionId);
    db.audit.log('SESSION_START', sessionId);
    db.debug.log('system', `[SESSION ID: ${sessionId}]`);
    set({
      sessionId,
      isConsented: true,
      cases: db.cases.list(),
    });
  },

  completeOnboarding: () => set({ isOnboarded: true }),

  logDataRightsEvent: (event) => {
    const { sessionId } = get();
    db.debug.log('system', `[DATA_RIGHTS] event=${event} session=${sessionId ?? 'demo'}`);
    set({ debugLogs: db.debug.list() });
  },

  logout: () => {
    const { sessionId } = get();
    if (sessionId) {
      db.audit.log('SESSION_EXPIRED', sessionId);
      db.debug.log('system', `[LOGOUT] session=${sessionId}`);
    }
    set({
      sessionId: null,
      isConsented: false,
      isOnboarded: false,
      isEmergency: false,
      emergencyKeywords: [],
      chatMessages: [],
      selectedCaseId: null,
      showDebugConsole: false,
    });
  },

  sendMessage: async (text, images) => {
    const { sessionId, chatMessages } = get();
    if (!sessionId) return;

    set({ isProcessing: true });

    // Optimistically add parent message to chat
    const parentMsg: ChatMessage = {
      id: `msg-${uuidv4().slice(0, 8)}`,
      session_id: sessionId,
      sender: 'parent',
      content: text,
      timestamp: new Date().toISOString(),
      images,
    };
    set({ chatMessages: [...chatMessages, parentMsg] });

    try {
      const parent = db.parent();
      const activeChild = parent.children.find((c) => c.id === parent.active_child_id);
      const vclinicId = activeChild?.vclinic_id;

      const result = await runPipeline(text, sessionId, vclinicId, !!images?.length);
      set({ debugLogs: db.debug.list() });

      if (result.isEmergency) {
        set({
          isEmergency: true,
          emergencyKeywords: result.emergencyKeywords ?? [],
          isProcessing: false,
          debugLogs: db.debug.list(),
        });
        return;
      }

      // Create new case for doctor queue
      const newCase = createNewCase(
        sessionId,
        result,
        text,
        activeChild?.name ?? 'Bệnh nhi',
        activeChild ? Math.floor((Date.now() - new Date(activeChild.dob).getTime()) / (1000 * 60 * 60 * 24 * 30)) : 36,
        images
      );
      db.cases.upsert(newCase);

      // Add "processing" system message to parent chat
      const processingMsg: ChatMessage = {
        id: `msg-${uuidv4().slice(0, 8)}`,
        session_id: sessionId,
        sender: 'system',
        content: 'Yêu cầu của bạn đang được bác sĩ xem xét. Vui lòng chờ phản hồi.',
        timestamp: new Date().toISOString(),
      };

      set({
        cases: db.cases.list(),
        chatMessages: [...get().chatMessages, processingMsg],
        isProcessing: false,
        debugLogs: db.debug.list(),
      });
    } catch {
      set({ isProcessing: false, debugLogs: db.debug.list() });
    }
  },

  selectCase: (id) => set({ selectedCaseId: id }),

  approveCase: (caseId, finalDraft) => {
    const { sessionId } = get();
    db.cases.approve(caseId, 'dr-001', finalDraft);
    db.audit.log('APPROVED', sessionId ?? 'unknown', { case_id: caseId });
    db.debug.log('system', `[APPROVED] case=${caseId}`);

    // Push approved message to parent chat
    const disclaimer =
      'Mọi kết quả phân tích chỉ mang tính tầm soát sớm và tham khảo, không thay thế chỉ định lâm sàng của Bác sĩ chuyên khoa.';
    const approvedMsg: ChatMessage = {
      id: `msg-${uuidv4().slice(0, 8)}`,
      session_id: get().sessionId ?? '',
      sender: 'doctor',
      content: finalDraft,
      timestamp: new Date().toISOString(),
      is_approved: true,
      disclaimer,
    };

    set({
      cases: db.cases.list(),
      selectedCaseId: null,
      chatMessages: [...get().chatMessages, approvedMsg],
      debugLogs: db.debug.list(),
    });
  },

  rejectCase: (caseId, reason) => {
    const { sessionId } = get();
    db.cases.reject(caseId, 'dr-001', reason);
    db.audit.log('REJECTED', sessionId ?? 'unknown', { case_id: caseId });
    set({
      cases: db.cases.list(),
      selectedCaseId: null,
      debugLogs: db.debug.list(),
    });
  },

  toggleDebugConsole: () =>
    set((s) => ({ showDebugConsole: !s.showDebugConsole, debugLogs: db.debug.list() })),

  refreshDebugLogs: () => set({ debugLogs: db.debug.list() }),

  resetEmergency: () => set({ isEmergency: false, emergencyKeywords: [] }),
}));
