/**
 * Thin fetch wrapper cho Next.js API routes.
 * Tự động gắn Authorization header nếu có token.
 */

let _accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  _accessToken = token;
}

export function getAccessToken() {
  return _accessToken;
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (_accessToken) headers['Authorization'] = `Bearer ${_accessToken}`;

  const res = await fetch(path, { ...options, headers });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? `API error ${res.status}`);
  return json.data as T;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  sendOtp: (phone: string) =>
    apiFetch('/api/auth/otp', { method: 'POST', body: JSON.stringify({ phone }) }),

  verify: (phone: string, token: string) =>
    apiFetch<{ access_token: string; refresh_token: string; user: { id: string; phone: string } }>(
      '/api/auth/verify',
      { method: 'POST', body: JSON.stringify({ phone, token }) }
    ),
};

// ─── Consents ─────────────────────────────────────────────────────────────────

export const consentsApi = {
  grant: (sessionUuid: string) =>
    apiFetch('/api/consents', { method: 'POST', body: JSON.stringify({ session_uuid: sessionUuid }) }),

  check: (sessionUuid: string) =>
    apiFetch<{ consented: boolean }>(`/api/consents?session_uuid=${sessionUuid}`),
};

// ─── Audit ────────────────────────────────────────────────────────────────────

export const auditApi = {
  log: (eventType: string, sessionUuid: string, extra?: { case_id?: string; payload?: Record<string, unknown> }) =>
    apiFetch('/api/audit', {
      method: 'POST',
      body: JSON.stringify({ event_type: eventType, session_uuid: sessionUuid, ...extra }),
    }).catch(() => {}), // audit failures are non-fatal
};

// ─── Profile ──────────────────────────────────────────────────────────────────

export const profileApi = {
  get: () => apiFetch<{ id: string; role: string; full_name: string | null; phone: string | null }>('/api/profile'),
  update: (patch: { full_name?: string; phone?: string }) =>
    apiFetch('/api/profile', { method: 'PATCH', body: JSON.stringify(patch) }),
};

// ─── Children ─────────────────────────────────────────────────────────────────

export const childrenApi = {
  list: () =>
    apiFetch<Array<{ id: string; full_name: string; dob: string | null; gender: string | null; weight_kg: number | null; vclinic_sid: string | null; avatar_color: string }>>('/api/children'),
  create: (payload: { full_name: string; dob?: string; gender?: string; weight_kg?: number; vclinic_sid?: string }) =>
    apiFetch('/api/children', { method: 'POST', body: JSON.stringify(payload) }),
};

// ─── Cases ────────────────────────────────────────────────────────────────────

export const casesApi = {
  list: (params?: { status?: string; role?: string }) => {
    const qs = new URLSearchParams(params as Record<string, string> ?? {}).toString();
    return apiFetch<CaseApiRow[]>(`/api/cases${qs ? `?${qs}` : ''}`);
  },
  create: (payload: { child_id?: string | null; anxiety_level?: string; workflow_type?: string }) =>
    apiFetch<CaseApiRow>('/api/cases', { method: 'POST', body: JSON.stringify(payload) }),
  updateStatus: (id: string, status: string, doctorId?: string) =>
    apiFetch<CaseApiRow>(`/api/cases/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, ...(doctorId ? { doctor_id: doctorId } : {}) }),
    }),
};

export interface CaseApiRow {
  id: string;
  parent_id: string;
  child_id: string | null;
  doctor_id: string | null;
  status: string;
  anxiety_level: string | null;
  workflow_type: string | null;
  sla_state: string;
  created_at: string;
  approved_at: string | null;
}

// ─── Messages ─────────────────────────────────────────────────────────────────

export const messagesApi = {
  list: (caseId: string) =>
    apiFetch<MessageApiRow[]>(`/api/messages?case_id=${caseId}`),
  send: (payload: {
    case_id: string;
    sender: string;
    raw_text: string;
    normalized_text?: string;
    image_urls?: string[];
    is_approved?: boolean;
    disclaimer_version?: string;
  }) => apiFetch<MessageApiRow>('/api/messages', { method: 'POST', body: JSON.stringify(payload) }),
};

export interface MessageApiRow {
  id: string;
  case_id: string;
  sender: string;
  raw_text: string;
  normalized_text: string | null;
  image_urls: string[];
  is_approved: boolean;
  disclaimer_version: string | null;
  created_at: string;
}

// ─── Drafts ───────────────────────────────────────────────────────────────────

export const draftsApi = {
  get: (caseId: string) =>
    apiFetch<DraftApiRow>(`/api/drafts?case_id=${caseId}`),
  create: (payload: { case_id: string; doctor_edited: string; ai_original?: string }) =>
    apiFetch<DraftApiRow>('/api/drafts', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id: string, doctorEdited: string) =>
    apiFetch<DraftApiRow>('/api/drafts', { method: 'PATCH', body: JSON.stringify({ id, doctor_edited: doctorEdited }) }),
};

export interface DraftApiRow {
  id: string;
  case_id: string;
  doctor_edited: string;
  ai_original: string | null;
  rag_snippets: unknown[];
  created_at: string;
}

// ─── Hospitals & Emergency ────────────────────────────────────────────────────

export const hospitalsApi = {
  list: () => apiFetch<Array<{ id: string; name: string; address: string | null; emergency_phone: string | null; priority: number }>>('/api/hospitals'),
};

export const emergencyApi = {
  keywords: () => apiFetch<Array<{ keyword: string; variants: string[] }>>('/api/emergency'),
};
