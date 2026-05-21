import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { MedCase, ChatMessage, DebugLog, AnxietyLevel, WorkflowType } from '@/types';
import { runPipeline, createNewCase } from '@/lib/pipeline';
import {
  casesApi,
  messagesApi,
  draftsApi,
  consentsApi,
  auditApi,
  setAccessToken,
  type CaseApiRow,
} from '@/lib/api';

// ─── State shape ──────────────────────────────────────────────────────────────

interface AppState {
  // Session
  sessionId: string | null;
  isConsented: boolean;

  // Auth
  accessToken: string | null;
  setAccessToken: (token: string) => void;

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

  // Debug logs (local only — pipeline still logs in-memory for debug console)
  debugLogs: DebugLog[];

  // Actions
  grantConsent: () => Promise<void>;
  sendMessage: (text: string, images?: string[]) => Promise<void>;
  selectCase: (id: string | null) => void;
  approveCase: (caseId: string, finalDraft: string) => Promise<void>;
  rejectCase: (caseId: string, reason: string) => Promise<void>;
  toggleDebugConsole: () => void;
  refreshDebugLogs: () => void;
  resetEmergency: () => void;
  loadCases: () => Promise<void>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Map Supabase case row → FE MedCase shape (minimal — UI just needs status + id)
function apiRowToMedCase(row: CaseApiRow): MedCase {
  return {
    id: row.id,
    session_id: row.id,
    patient_id: row.parent_id,
    patient_name: 'Bệnh nhi',
    patient_age_months: 0,
    created_at: row.created_at,
    status: row.status as MedCase['status'],
    anxiety_level: (row.anxiety_level ?? 'calm') as AnxietyLevel,
    workflow_type: (row.workflow_type ?? 'General') as WorkflowType,
    has_images: false,
    symptom_keywords: [],
    messages: [],
    approved_at: row.approved_at ?? undefined,
  };
}

// In-memory debug log (pipeline still writes here; no API round-trip needed)
const _debugLogs: DebugLog[] = [];
export function pushDebugLog(log: DebugLog) {
  _debugLogs.unshift(log);
  if (_debugLogs.length > 200) _debugLogs.length = 200;
}
export function getDebugLogs(): DebugLog[] {
  return [..._debugLogs];
}

export function clearDebugLogs() {
  _debugLogs.length = 0;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAppStore = create<AppState>((set, get) => ({
  sessionId: null,
  isConsented: false,
  accessToken: null,
  isEmergency: false,
  emergencyKeywords: [],
  isProcessing: false,
  showDebugConsole: false,
  cases: [],
  selectedCaseId: null,
  chatMessages: [],
  debugLogs: [],

  setAccessToken: (token) => {
    setAccessToken(token);
    set({ accessToken: token });
  },

  grantConsent: async () => {
    const sessionId = uuidv4();
    set({ sessionId, isConsented: true });

    // Persist to Supabase (non-blocking — UI is already unlocked)
    consentsApi.grant(sessionId).catch(console.error);
    auditApi.log('CONSENT_GRANTED', sessionId);
    auditApi.log('SESSION_START', sessionId);
  },

  loadCases: async () => {
    try {
      const rows = await casesApi.list({ role: 'doctor' });
      set({ cases: rows.map(apiRowToMedCase) });
    } catch (e) {
      console.error('[loadCases]', e);
    }
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
      const result = await runPipeline(text, sessionId, undefined, !!images?.length);
      set({ debugLogs: getDebugLogs() });

      if (result.isEmergency) {
        set({
          isEmergency: true,
          emergencyKeywords: result.emergencyKeywords ?? [],
          isProcessing: false,
          debugLogs: getDebugLogs(),
        });
        auditApi.log('EMERGENCY_BYPASS', sessionId);
        return;
      }

      // Create case in Supabase
      const sbCase = await casesApi.create({
        anxiety_level: result.anxietyLevel,
        workflow_type: result.workflowType === 'IgG_Food_Sensitivity' ? 'igg'
          : result.workflowType === 'Respiratory' ? 'respiratory'
          : result.workflowType === 'Skin_Lesion' ? 'skin'
          : 'general',
      });

      // Persist parent message
      await messagesApi.send({
        case_id: sbCase.id,
        sender: 'parent',
        raw_text: text,
        normalized_text: result.normalizedText,
        image_urls: images ?? [],
      });

      auditApi.log('MESSAGE_SENT', sessionId, { case_id: sbCase.id });
      auditApi.log('DRAFT_GENERATED', sessionId, { case_id: sbCase.id });

      // Build local MedCase from pipeline result for immediate UI update
      const newCase = createNewCase(
        sessionId,
        result,
        text,
        'Bệnh nhi',
        36,
        images
      );
      // Overwrite id with real Supabase id so approve/reject use correct id
      newCase.id = sbCase.id;

      const processingMsg: ChatMessage = {
        id: `msg-${uuidv4().slice(0, 8)}`,
        session_id: sessionId,
        sender: 'system',
        content: 'Yêu cầu của bạn đang được bác sĩ xem xét. Vui lòng chờ phản hồi.',
        timestamp: new Date().toISOString(),
      };

      set((s) => ({
        cases: [newCase, ...s.cases],
        chatMessages: [...get().chatMessages, processingMsg],
        isProcessing: false,
        debugLogs: getDebugLogs(),
      }));
    } catch (e) {
      console.error('[sendMessage]', e);
      set({ isProcessing: false, debugLogs: getDebugLogs() });
    }
  },

  selectCase: (id) => set({ selectedCaseId: id }),

  approveCase: async (caseId, finalDraft) => {
    const { sessionId } = get();

    await casesApi.updateStatus(caseId, 'approved');
    await draftsApi.create({ case_id: caseId, doctor_edited: finalDraft });
    await messagesApi.send({
      case_id: caseId,
      sender: 'doctor',
      raw_text: finalDraft,
      is_approved: true,
      disclaimer_version: 'v1',
    });
    auditApi.log('APPROVED', sessionId ?? 'unknown', { case_id: caseId });

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

    set((s) => ({
      cases: s.cases.map((c) =>
        c.id === caseId ? { ...c, status: 'approved' as const, approved_at: new Date().toISOString() } : c
      ),
      selectedCaseId: null,
      chatMessages: [...get().chatMessages, approvedMsg],
      debugLogs: getDebugLogs(),
    }));
  },

  rejectCase: async (caseId, reason) => {
    const { sessionId } = get();

    await casesApi.updateStatus(caseId, 'rejected');
    auditApi.log('REJECTED', sessionId ?? 'unknown', { case_id: caseId, payload: { reason } });

    set((s) => ({
      cases: s.cases.map((c) =>
        c.id === caseId ? { ...c, status: 'rejected' as const, rejection_reason: reason } : c
      ),
      selectedCaseId: null,
      debugLogs: getDebugLogs(),
    }));
  },

  toggleDebugConsole: () =>
    set((s) => ({ showDebugConsole: !s.showDebugConsole, debugLogs: getDebugLogs() })),

  refreshDebugLogs: () => set({ debugLogs: getDebugLogs() }),

  resetEmergency: () => set({ isEmergency: false, emergencyKeywords: [] }),
}));
