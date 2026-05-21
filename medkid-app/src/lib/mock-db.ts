/**
 * Mock database — thay thế Supabase trong quá trình phát triển.
 * Toàn bộ state lưu trong memory, reset khi refresh trang.
 */

import {
  MOCK_CASES,
  MOCK_AUDIT_LOGS,
  MOCK_PARENT,
  MOCK_DOCTORS,
} from '@/mock/data';
import type {
  MedCase,
  AuditLog,
  AuditEvent,
  ChatMessage,
  DebugLog,
  LogType,
} from '@/types';

const cases: MedCase[] = structuredClone(MOCK_CASES);
let auditLogs: AuditLog[] = structuredClone(MOCK_AUDIT_LOGS);
let debugLogs: DebugLog[] = [];

// ─── Cases ────────────────────────────────────────────────────────────────────

export const db = {
  cases: {
    list: () => [...cases],
    pending: () => cases.filter((c) => c.status === 'pending'),
    byId: (id: string) => cases.find((c) => c.id === id),

    upsert: (updated: MedCase) => {
      const idx = cases.findIndex((c) => c.id === updated.id);
      if (idx >= 0) {
        cases[idx] = updated;
      } else {
        cases.unshift(updated);
      }
      return updated;
    },

    addMessage: (caseId: string, msg: ChatMessage) => {
      const c = cases.find((x) => x.id === caseId);
      if (c) {
        c.messages = [...(c.messages ?? []), msg];
      }
    },

    approve: (caseId: string, doctorId: string, finalDraft: string) => {
      const c = cases.find((x) => x.id === caseId);
      if (c) {
        c.status = 'approved';
        c.doctor_id = doctorId;
        c.edited_draft = finalDraft;
        c.approved_at = new Date().toISOString();
      }
      return c;
    },

    reject: (caseId: string, doctorId: string, reason: string) => {
      const c = cases.find((x) => x.id === caseId);
      if (c) {
        c.status = 'rejected';
        c.doctor_id = doctorId;
        c.rejection_reason = reason;
        c.rejected_at = new Date().toISOString();
      }
      return c;
    },

    forward: (caseId: string, toDoctorId: string, note: string) => {
      const c = cases.find((x) => x.id === caseId);
      if (c) {
        c.status = 'forwarded';
        c.doctor_id = toDoctorId;
        (c as MedCase & { forward_note?: string }).forward_note = note;
      }
      return c;
    },
  },

  // ─── Audit ────────────────────────────────────────────────────────────────

  audit: {
    log: (
      event: AuditEvent,
      sessionId: string,
      extra?: Partial<Omit<AuditLog, 'id' | 'event' | 'session_id' | 'timestamp'>>
    ) => {
      const entry: AuditLog = {
        id: `audit-${Date.now()}`,
        event,
        session_id: sessionId,
        timestamp: new Date().toISOString(),
        ...extra,
      };
      auditLogs = [entry, ...auditLogs];
      console.log(`[${event}]`, entry);
      return entry;
    },
    list: () => [...auditLogs],
  },

  // ─── Debug Console ────────────────────────────────────────────────────────

  debug: {
    log: (type: LogType, message: string, extra?: Partial<DebugLog>) => {
      const entry: DebugLog = {
        id: `dbg-${Date.now()}`,
        type,
        message,
        timestamp: new Date().toISOString(),
        ...extra,
      };
      debugLogs = [entry, ...debugLogs].slice(0, 200); // keep last 200
      return entry;
    },
    list: () => [...debugLogs],
    clear: () => { debugLogs = []; },
  },

  // ─── Lookup ───────────────────────────────────────────────────────────────

  parent: () => MOCK_PARENT,
  doctors: () => MOCK_DOCTORS,
};
