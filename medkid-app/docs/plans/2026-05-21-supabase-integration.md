# Supabase Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the in-memory mock layer (`src/lib/mock-db.ts`, `src/mock/data.ts`) with real Supabase calls, following the 3-Sprint plan, so the app persists data and supports realtime doctor queue updates.

**Architecture:** The app uses Next.js App Router with a client-side Zustand store (`app-store.ts`). The current `db` object in `mock-db.ts` is the seam — we replace it with Supabase client calls in a new `src/lib/supabase/` layer. The store (`app-store.ts`) is updated to call the new layer instead of `db`. Mock data stays for Sprint 3 AI features until real pipeline is built.

**Tech Stack:** Next.js 16, React 19, TypeScript, Supabase JS v2 (`@supabase/ssr` already installed), Zustand, Tailwind CSS 4. No new dependencies required for Sprints 1–2.

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `src/lib/supabase/client.ts` | Modify | Already exists — remove null mock guard, always return real client |
| `src/lib/supabase/types.ts` | Create | Database row types matching schema.sql (auto-mapped from Supabase schema) |
| `src/lib/supabase/auth.ts` | Create | signInWithOtp, verifyOtp, signOut, onAuthStateChange |
| `src/lib/supabase/consents.ts` | Create | insertConsent, checkConsent |
| `src/lib/supabase/cases.ts` | Create | createCase, listCases, updateCaseStatus, subscribeToNewCases |
| `src/lib/supabase/messages.ts` | Create | insertMessage, listMessages, subscribeToMessages |
| `src/lib/supabase/drafts.ts` | Create | createDraft, updateDraft (doctor_edited) |
| `src/lib/supabase/audit.ts` | Create | insertAuditLog |
| `src/lib/supabase/config.ts` | Create | getConfig (fetch app_config rows) |
| `src/lib/supabase/emergency.ts` | Create | fetchEmergencyKeywords |
| `src/lib/supabase/hospitals.ts` | Create | fetchHospitals |
| `src/lib/supabase/children.ts` | Create | createChild, listChildren |
| `src/store/app-store.ts` | Modify | Replace `db.*` calls with supabase/* module calls |
| `src/components/shared/consent-modal.tsx` | Modify | Call auth.ts + consents.ts instead of `db.audit.log` |
| `src/components/parent/chat-panel.tsx` | Modify | Use Supabase Realtime for incoming doctor messages |
| `src/components/doctor/case-queue.tsx` | Modify | Use Supabase Realtime subscription for live queue |
| `.env.local` | Create | NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY |

---

## Task 1: Environment & Supabase Client

**Files:**
- Modify: `medkid-app/src/lib/supabase/client.ts`
- Create: `medkid-app/.env.local`

- [ ] **Step 1: Create `.env.local`** (never commit this file)

```bash
# medkid-app/.env.local
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
NEXT_PUBLIC_USE_MOCK=false
```

Get values from: Supabase Dashboard → Project → Settings → API.

- [ ] **Step 2: Update `client.ts` to always return a real client**

Replace entire `medkid-app/src/lib/supabase/client.ts` with:

```ts
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Singleton for client components
let _client: ReturnType<typeof createClient> | null = null;
export function getSupabase() {
  if (!_client) _client = createClient();
  return _client;
}
```

- [ ] **Step 3: Verify app still starts**

```bash
cd medkid-app && npm run dev
```

Expected: no TypeScript errors on `client.ts` (type error on `Database` is ok — we fix in Task 2).

- [ ] **Step 4: Commit**

```bash
git add medkid-app/src/lib/supabase/client.ts
git commit -m "feat: wire real Supabase client, remove mock guard"
```

---

## Task 2: Database Types

**Files:**
- Create: `medkid-app/src/lib/supabase/types.ts`

These types map exactly to the tables in `supabase/schema.sql`.

- [ ] **Step 1: Create `types.ts`**

```ts
// Row types matching supabase/schema.sql

export interface UserProfileRow {
  id: string;
  role: 'parent' | 'doctor' | 'admin';
  full_name: string | null;
  phone: string | null;
  created_at: string;
}

export interface ChildRow {
  id: string;
  parent_id: string;
  full_name: string;
  dob: string | null;
  gender: 'male' | 'female' | 'other' | null;
  weight_kg: number | null;
  vclinic_sid: string | null;
  avatar_color: string;
  created_at: string;
}

export interface ConsentRow {
  id: string;
  parent_id: string | null;
  session_uuid: string;
  granted_at: string;
  revoked_at: string | null;
}

export interface CaseRow {
  id: string;
  child_id: string | null;
  parent_id: string;
  doctor_id: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'forwarded' | 'emergency';
  anxiety_level: 'calm' | 'concerned' | 'panic' | null;
  workflow_type: 'igg' | 'respiratory' | 'skin' | 'general' | null;
  fusion_weights: Record<string, number> | null;
  sla_state: 'ok' | 'warning' | 'breach';
  created_at: string;
  approved_at: string | null;
}

export interface MessageRow {
  id: string;
  case_id: string;
  sender: 'parent' | 'doctor' | 'system';
  raw_text: string | null;
  normalized_text: string | null;
  image_urls: string[];
  cv_metadata: Record<string, unknown> | null;
  is_approved: boolean;
  disclaimer_version: string | null;
  created_at: string;
}

export interface AiDraftRow {
  id: string;
  case_id: string;
  ai_original: string | null;
  doctor_edited: string | null;
  rag_snippets: Array<{ title: string; score: number; text: string }>;
  token_diff: Record<string, unknown> | null;
  created_at: string;
}

export interface AuditLogRow {
  id: string;
  event_type: string;
  actor_id: string | null;
  case_id: string | null;
  session_uuid: string | null;
  payload: Record<string, unknown> | null;
  created_at: string;
}

export interface EmergencyKeywordRow {
  id: string;
  keyword: string;
  variants: string[];
  active: boolean;
}

export interface HospitalRow {
  id: string;
  name: string;
  address: string | null;
  lat: number | null;
  lng: number | null;
  emergency_phone: string | null;
  priority: number;
}

export interface AppConfigRow {
  key: string;
  value: Record<string, unknown>;
}

// Database interface for createBrowserClient<Database>
export interface Database {
  public: {
    Tables: {
      user_profiles: { Row: UserProfileRow; Insert: Partial<UserProfileRow>; Update: Partial<UserProfileRow> };
      children: { Row: ChildRow; Insert: Partial<ChildRow>; Update: Partial<ChildRow> };
      consents: { Row: ConsentRow; Insert: Partial<ConsentRow>; Update: Partial<ConsentRow> };
      cases: { Row: CaseRow; Insert: Partial<CaseRow>; Update: Partial<CaseRow> };
      messages: { Row: MessageRow; Insert: Partial<MessageRow>; Update: Partial<MessageRow> };
      ai_drafts: { Row: AiDraftRow; Insert: Partial<AiDraftRow>; Update: Partial<AiDraftRow> };
      audit_log: { Row: AuditLogRow; Insert: Partial<AuditLogRow>; Update: Partial<AuditLogRow> };
      emergency_keywords: { Row: EmergencyKeywordRow; Insert: Partial<EmergencyKeywordRow>; Update: Partial<EmergencyKeywordRow> };
      hospitals: { Row: HospitalRow; Insert: Partial<HospitalRow>; Update: Partial<HospitalRow> };
      app_config: { Row: AppConfigRow; Insert: Partial<AppConfigRow>; Update: Partial<AppConfigRow> };
    };
    Functions: {
      match_knowledge: {
        Args: { query_embedding: number[]; match_threshold?: number; match_count?: number };
        Returns: Array<{ id: string; question_sample: string; answer_reference: string; tags: string[]; similarity: number }>;
      };
    };
  };
}
```

- [ ] **Step 2: Run build to confirm types compile**

```bash
cd medkid-app && npm run build 2>&1 | grep -E "error|warning" | head -20
```

Expected: type errors on `client.ts` `Database` import should now be resolved.

- [ ] **Step 3: Commit**

```bash
git add medkid-app/src/lib/supabase/types.ts medkid-app/src/lib/supabase/client.ts
git commit -m "feat: add Supabase database row types"
```

---

## Task 3: Auth Module (Sprint 1 — US-008)

**Files:**
- Create: `medkid-app/src/lib/supabase/auth.ts`

- [ ] **Step 1: Create `auth.ts`**

```ts
import { getSupabase } from './client';

export async function sendOtp(phone: string) {
  const { error } = await getSupabase().auth.signInWithOtp({ phone });
  if (error) throw new Error(error.message);
}

export async function verifyOtp(phone: string, token: string) {
  const { data, error } = await getSupabase().auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  });
  if (error) throw new Error(error.message);
  return data.session;
}

export async function signOut() {
  const { error } = await getSupabase().auth.signOut();
  if (error) throw new Error(error.message);
}

export function onAuthStateChange(callback: (userId: string | null) => void) {
  return getSupabase().auth.onAuthStateChange((_event, session) => {
    callback(session?.user?.id ?? null);
  });
}

export async function getCurrentUser() {
  const { data } = await getSupabase().auth.getUser();
  return data.user;
}
```

- [ ] **Step 2: Verify no build errors**

```bash
cd medkid-app && npm run build 2>&1 | grep "error TS" | head -10
```

Expected: 0 TypeScript errors in `auth.ts`.

- [ ] **Step 3: Commit**

```bash
git add medkid-app/src/lib/supabase/auth.ts
git commit -m "feat: add Supabase auth module (OTP + signOut)"
```

---

## Task 4: Consents Module (Sprint 1 — US-001/002)

**Files:**
- Create: `medkid-app/src/lib/supabase/consents.ts`

- [ ] **Step 1: Create `consents.ts`**

```ts
import { getSupabase } from './client';

export async function insertConsent(parentId: string, sessionUuid: string) {
  const { error } = await getSupabase()
    .from('consents')
    .insert({ parent_id: parentId, session_uuid: sessionUuid });
  if (error) throw new Error(error.message);
}

export async function hasConsented(sessionUuid: string): Promise<boolean> {
  const { data, error } = await getSupabase()
    .from('consents')
    .select('id')
    .eq('session_uuid', sessionUuid)
    .is('revoked_at', null)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data !== null;
}
```

- [ ] **Step 2: Commit**

```bash
git add medkid-app/src/lib/supabase/consents.ts
git commit -m "feat: add consents Supabase module"
```

---

## Task 5: Audit Log Module (Sprint 1)

**Files:**
- Create: `medkid-app/src/lib/supabase/audit.ts`

- [ ] **Step 1: Create `audit.ts`**

```ts
import { getSupabase } from './client';

export type AuditEventType =
  | 'CONSENT_GRANTED'
  | 'SESSION_START'
  | 'SESSION_EXPIRED'
  | 'MESSAGE_SENT'
  | 'DRAFT_GENERATED'
  | 'APPROVED'
  | 'REJECTED'
  | 'FORWARDED'
  | 'DATA_DELETED'
  | 'EMERGENCY_BYPASS';

export async function insertAuditLog(
  eventType: AuditEventType,
  sessionUuid: string,
  extra?: { actor_id?: string; case_id?: string; payload?: Record<string, unknown> }
) {
  const { error } = await getSupabase().from('audit_log').insert({
    event_type: eventType,
    session_uuid: sessionUuid,
    actor_id: extra?.actor_id ?? null,
    case_id: extra?.case_id ?? null,
    payload: extra?.payload ?? null,
  });
  if (error) console.error('[audit_log insert]', error.message);
  // Audit failures are non-fatal — log but don't throw
}
```

- [ ] **Step 2: Commit**

```bash
git add medkid-app/src/lib/supabase/audit.ts
git commit -m "feat: add audit_log Supabase module"
```

---

## Task 6: App Config & Emergency Keywords (Sprint 2)

**Files:**
- Create: `medkid-app/src/lib/supabase/config.ts`
- Create: `medkid-app/src/lib/supabase/emergency.ts`
- Create: `medkid-app/src/lib/supabase/hospitals.ts`

- [ ] **Step 1: Create `config.ts`**

```ts
import { getSupabase } from './client';

export async function getConfig(key: string): Promise<Record<string, unknown> | null> {
  const { data, error } = await getSupabase()
    .from('app_config')
    .select('value')
    .eq('key', key)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data?.value ?? null;
}

export async function getDisclaimer(): Promise<string> {
  const config = await getConfig('disclaimer');
  return (config?.text as string) ?? 'Thông tin chỉ mang tính tham khảo, không thay thế chẩn đoán của bác sĩ.';
}
```

- [ ] **Step 2: Create `emergency.ts`**

```ts
import { getSupabase } from './client';

export interface EmergencyKeyword {
  keyword: string;
  variants: string[];
}

export async function fetchEmergencyKeywords(): Promise<EmergencyKeyword[]> {
  const { data, error } = await getSupabase()
    .from('emergency_keywords')
    .select('keyword, variants')
    .eq('active', true);
  if (error) throw new Error(error.message);
  return data ?? [];
}
```

- [ ] **Step 3: Create `hospitals.ts`**

```ts
import { getSupabase } from './client';
import type { HospitalRow } from './types';

export async function fetchHospitals(): Promise<HospitalRow[]> {
  const { data, error } = await getSupabase()
    .from('hospitals')
    .select('*')
    .order('priority', { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}
```

- [ ] **Step 4: Commit**

```bash
git add medkid-app/src/lib/supabase/config.ts medkid-app/src/lib/supabase/emergency.ts medkid-app/src/lib/supabase/hospitals.ts
git commit -m "feat: add config, emergency keywords, hospitals Supabase modules"
```

---

## Task 7: Cases Module (Sprint 2 — Core Loop)

**Files:**
- Create: `medkid-app/src/lib/supabase/cases.ts`

- [ ] **Step 1: Create `cases.ts`**

```ts
import { getSupabase } from './client';
import type { CaseRow } from './types';
import type { RealtimeChannel } from '@supabase/supabase-js';

export async function createCase(
  parentId: string,
  childId: string | null,
  anxietyLevel: CaseRow['anxiety_level'],
  workflowType: CaseRow['workflow_type']
): Promise<CaseRow> {
  const { data, error } = await getSupabase()
    .from('cases')
    .insert({ parent_id: parentId, child_id: childId, anxiety_level: anxietyLevel, workflow_type: workflowType })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function listPendingCases(): Promise<CaseRow[]> {
  const { data, error } = await getSupabase()
    .from('cases')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listCasesByParent(parentId: string): Promise<CaseRow[]> {
  const { data, error } = await getSupabase()
    .from('cases')
    .select('*')
    .eq('parent_id', parentId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function updateCaseStatus(
  caseId: string,
  status: CaseRow['status'],
  doctorId?: string
): Promise<void> {
  const patch: Partial<CaseRow> = { status };
  if (doctorId) patch.doctor_id = doctorId;
  if (status === 'approved') patch.approved_at = new Date().toISOString();

  const { error } = await getSupabase().from('cases').update(patch).eq('id', caseId);
  if (error) throw new Error(error.message);
}

export function subscribeToNewCases(
  onInsert: (row: CaseRow) => void,
  onUpdate: (row: CaseRow) => void
): RealtimeChannel {
  return getSupabase()
    .channel('cases-channel')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'cases' }, (payload) =>
      onInsert(payload.new as CaseRow)
    )
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'cases' }, (payload) =>
      onUpdate(payload.new as CaseRow)
    )
    .subscribe();
}
```

- [ ] **Step 2: Commit**

```bash
git add medkid-app/src/lib/supabase/cases.ts
git commit -m "feat: add cases Supabase module with Realtime subscription"
```

---

## Task 8: Messages Module (Sprint 2 — US-010)

**Files:**
- Create: `medkid-app/src/lib/supabase/messages.ts`

- [ ] **Step 1: Create `messages.ts`**

```ts
import { getSupabase } from './client';
import type { MessageRow } from './types';
import type { RealtimeChannel } from '@supabase/supabase-js';

export async function insertMessage(
  caseId: string,
  sender: MessageRow['sender'],
  text: string,
  opts?: {
    imageUrls?: string[];
    isApproved?: boolean;
    disclaimerVersion?: string;
    normalizedText?: string;
  }
): Promise<MessageRow> {
  const { data, error } = await getSupabase()
    .from('messages')
    .insert({
      case_id: caseId,
      sender,
      raw_text: text,
      normalized_text: opts?.normalizedText ?? null,
      image_urls: opts?.imageUrls ?? [],
      is_approved: opts?.isApproved ?? false,
      disclaimer_version: opts?.disclaimerVersion ?? null,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function listMessages(caseId: string): Promise<MessageRow[]> {
  const { data, error } = await getSupabase()
    .from('messages')
    .select('*')
    .eq('case_id', caseId)
    .order('created_at', { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export function subscribeToMessages(
  caseId: string,
  onMessage: (row: MessageRow) => void
): RealtimeChannel {
  return getSupabase()
    .channel(`messages-${caseId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `case_id=eq.${caseId}` },
      (payload) => onMessage(payload.new as MessageRow)
    )
    .subscribe();
}
```

- [ ] **Step 2: Commit**

```bash
git add medkid-app/src/lib/supabase/messages.ts
git commit -m "feat: add messages Supabase module with per-case Realtime"
```

---

## Task 9: AI Drafts Module (Sprint 2 — US-043/045)

**Files:**
- Create: `medkid-app/src/lib/supabase/drafts.ts`

- [ ] **Step 1: Create `drafts.ts`**

```ts
import { getSupabase } from './client';
import type { AiDraftRow } from './types';

export async function createDraft(caseId: string, doctorEdited: string): Promise<AiDraftRow> {
  const { data, error } = await getSupabase()
    .from('ai_drafts')
    .insert({ case_id: caseId, ai_original: null, doctor_edited: doctorEdited })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateDraft(draftId: string, doctorEdited: string): Promise<void> {
  const { error } = await getSupabase()
    .from('ai_drafts')
    .update({ doctor_edited: doctorEdited })
    .eq('id', draftId);
  if (error) throw new Error(error.message);
}

export async function getDraftByCase(caseId: string): Promise<AiDraftRow | null> {
  const { data, error } = await getSupabase()
    .from('ai_drafts')
    .select('*')
    .eq('case_id', caseId)
    .order('created_at', { ascending: false })
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}
```

- [ ] **Step 2: Commit**

```bash
git add medkid-app/src/lib/supabase/drafts.ts
git commit -m "feat: add ai_drafts Supabase module"
```

---

## Task 10: Children Module (Sprint 1 — US-009)

**Files:**
- Create: `medkid-app/src/lib/supabase/children.ts`

- [ ] **Step 1: Create `children.ts`**

```ts
import { getSupabase } from './client';
import type { ChildRow } from './types';

export async function createChild(
  parentId: string,
  fullName: string,
  opts?: { dob?: string; gender?: ChildRow['gender']; weightKg?: number; vclinicSid?: string }
): Promise<ChildRow> {
  const { data, error } = await getSupabase()
    .from('children')
    .insert({
      parent_id: parentId,
      full_name: fullName,
      dob: opts?.dob ?? null,
      gender: opts?.gender ?? null,
      weight_kg: opts?.weightKg ?? null,
      vclinic_sid: opts?.vclinicSid ?? null,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function listChildren(parentId: string): Promise<ChildRow[]> {
  const { data, error } = await getSupabase()
    .from('children')
    .select('*')
    .eq('parent_id', parentId)
    .order('created_at', { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}
```

- [ ] **Step 2: Commit**

```bash
git add medkid-app/src/lib/supabase/children.ts
git commit -m "feat: add children Supabase module"
```

---

## Task 11: Wire Consent Modal to Supabase (Sprint 1)

**Files:**
- Modify: `medkid-app/src/store/app-store.ts`

Replace `db.audit.log('CONSENT_GRANTED', ...)` in `grantConsent` with real Supabase calls. The store still uses `sessionId` for in-session state but now persists to Supabase.

- [ ] **Step 1: Update `grantConsent` in `app-store.ts`**

Add these imports at the top of `app-store.ts`:

```ts
import { insertConsent } from '@/lib/supabase/consents';
import { insertAuditLog } from '@/lib/supabase/audit';
import { getCurrentUser } from '@/lib/supabase/auth';
```

Replace the `grantConsent` action body:

```ts
grantConsent: async () => {
  const sessionId = uuidv4();
  const user = await getCurrentUser();
  const parentId = user?.id ?? null;

  // Persist consent to Supabase (non-blocking for hackathon)
  if (parentId) {
    await insertConsent(parentId, sessionId).catch(console.error);
  }
  insertAuditLog('CONSENT_GRANTED', sessionId, { actor_id: parentId ?? undefined }).catch(console.error);
  insertAuditLog('SESSION_START', sessionId, { actor_id: parentId ?? undefined }).catch(console.error);

  // Keep mock debug log for debug console
  db.debug.log('system', `[SESSION ID: ${sessionId}]`);
  set({ sessionId, isConsented: true, cases: db.cases.list() });
},
```

Note: `grantConsent` becomes `async` — update the store type signature:

```ts
grantConsent: () => Promise<void>;
```

And update callers in `src/components/shared/consent-modal.tsx` — add `await` or `.catch()` if it calls `grantConsent()`.

- [ ] **Step 2: Run lint**

```bash
cd medkid-app && npm run lint 2>&1 | grep -E "error|warning" | head -20
```

- [ ] **Step 3: Run dev and manually click "Đồng ý" on consent modal**

```bash
cd medkid-app && npm run dev
```

Open Supabase Dashboard → Table Editor → `audit_log`. After clicking consent, one row with `event_type=CONSENT_GRANTED` should appear.

- [ ] **Step 4: Commit**

```bash
git add medkid-app/src/store/app-store.ts
git commit -m "feat: persist consent + audit to Supabase on grantConsent"
```

---

## Task 12: Wire sendMessage to Supabase (Sprint 2 — US-010)

**Files:**
- Modify: `medkid-app/src/store/app-store.ts`

Replace mock `db.cases.upsert(newCase)` with Supabase `createCase` + `insertMessage`.

- [ ] **Step 1: Add imports to `app-store.ts`**

```ts
import { createCase, listPendingCases } from '@/lib/supabase/cases';
import { insertMessage } from '@/lib/supabase/messages';
import { getCurrentUser } from '@/lib/supabase/auth';
```

- [ ] **Step 2: Update `sendMessage` in `app-store.ts`**

Replace the block after `runPipeline` resolves (where `createNewCase` is called) with:

```ts
// Create case in Supabase
const user = await getCurrentUser();
const parentId = user?.id ?? 'anonymous';
const parent = db.parent();
const activeChild = parent.children.find((c) => c.id === parent.active_child_id);

const sbCase = await createCase(
  parentId,
  null, // child_id: null until children are wired in Sprint 1 profile
  result.anxietyLevel === 'panic' ? 'panic'
    : result.anxietyLevel === 'concerned' ? 'concerned'
    : 'calm',
  result.workflowType === 'Skin_Lesion' ? 'skin'
    : result.workflowType === 'Respiratory' ? 'respiratory'
    : result.workflowType === 'IgG_Food_Sensitivity' ? 'igg'
    : 'general'
);

await insertMessage(sbCase.id, 'parent', text, {
  imageUrls: images ?? [],
  normalizedText: result.normalizedText,
});

await insertAuditLog('MESSAGE_SENT', sessionId, { case_id: sbCase.id });

// Also keep mock in-memory so UI still works while we progressively migrate
const newCase = createNewCase(sessionId, result, text, activeChild?.name ?? 'Bệnh nhi',
  activeChild ? Math.floor((Date.now() - new Date(activeChild.dob).getTime()) / (1000 * 60 * 60 * 24 * 30)) : 36,
  images
);
```

- [ ] **Step 3: Manual test**

Start dev server. Submit a chat message. Check Supabase Dashboard → `cases` table: one new row. Check `messages` table: one row with `sender=parent`.

- [ ] **Step 4: Commit**

```bash
git add medkid-app/src/store/app-store.ts
git commit -m "feat: persist case + parent message to Supabase on sendMessage"
```

---

## Task 13: Wire Realtime Doctor Queue (Sprint 2 — US-041)

**Files:**
- Modify: `medkid-app/src/components/doctor/case-queue.tsx`
- Modify: `medkid-app/src/store/app-store.ts`

Replace polling mock data with Supabase Realtime subscription for live pending case list.

- [ ] **Step 1: Add `subscribeToCases` action to app-store**

Add to the `AppState` interface:

```ts
initRealtimeQueue: () => () => void; // returns unsubscribe fn
```

Add to store implementation:

```ts
initRealtimeQueue: () => {
  const channel = subscribeToNewCases(
    (newRow) => {
      // Append new pending case to in-memory list (minimal — no full SB fetch)
      const draft: MedCase = {
        id: newRow.id,
        session_id: newRow.id,
        patient_id: newRow.parent_id,
        patient_name: 'Bệnh nhi',
        patient_age_months: 0,
        created_at: newRow.created_at,
        status: 'pending',
        anxiety_level: (newRow.anxiety_level as MedCase['anxiety_level']) ?? 'calm',
        workflow_type: (newRow.workflow_type as MedCase['workflow_type']) ?? 'General',
        has_images: false,
        symptom_keywords: [],
        messages: [],
      };
      set((s) => ({ cases: [draft, ...s.cases] }));
    },
    (updatedRow) => {
      set((s) => ({
        cases: s.cases.map((c) =>
          c.id === updatedRow.id ? { ...c, status: updatedRow.status as MedCase['status'] } : c
        ),
      }));
    }
  );
  return () => { getSupabase().removeChannel(channel); };
},
```

Add import: `import { subscribeToNewCases } from '@/lib/supabase/cases';`

- [ ] **Step 2: Call `initRealtimeQueue` in `case-queue.tsx`**

Add a `useEffect` at the top of the `CaseQueue` component:

```ts
const initRealtimeQueue = useAppStore((s) => s.initRealtimeQueue);

useEffect(() => {
  const unsubscribe = initRealtimeQueue();
  return unsubscribe;
}, [initRealtimeQueue]);
```

- [ ] **Step 3: Enable Realtime on `cases` table in Supabase**

In Supabase Dashboard → Database → Replication → enable `cases` table for `INSERT` and `UPDATE`.

- [ ] **Step 4: Manual test**

Open two browser tabs. On Tab 1: submit a chat message. On Tab 2 (doctor view): the case should appear in the queue within ~1 second without refresh.

- [ ] **Step 5: Commit**

```bash
git add medkid-app/src/store/app-store.ts medkid-app/src/components/doctor/case-queue.tsx
git commit -m "feat: live doctor queue via Supabase Realtime"
```

---

## Task 14: Wire Approve/Reject to Supabase (Sprint 2 — US-047/048)

**Files:**
- Modify: `medkid-app/src/store/app-store.ts`

- [ ] **Step 1: Add imports**

```ts
import { updateCaseStatus } from '@/lib/supabase/cases';
import { createDraft } from '@/lib/supabase/drafts';
import { getDisclaimer } from '@/lib/supabase/config';
```

- [ ] **Step 2: Update `approveCase`**

```ts
approveCase: async (caseId, finalDraft) => {
  const { sessionId } = get();
  const user = await getCurrentUser();
  const doctorId = user?.id ?? 'dr-unknown';

  await updateCaseStatus(caseId, 'approved', doctorId);
  await createDraft(caseId, finalDraft);

  const disclaimer = await getDisclaimer();

  await insertMessage(caseId, 'doctor', finalDraft, {
    isApproved: true,
    disclaimerVersion: 'v1',
  });
  await insertAuditLog('APPROVED', sessionId ?? 'unknown', {
    actor_id: doctorId,
    case_id: caseId,
  });

  // Keep mock state in sync for immediate UI update
  db.cases.approve(caseId, doctorId, finalDraft);
  db.audit.log('APPROVED', sessionId ?? 'unknown', { case_id: caseId });

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
```

Update the `AppState` type: `approveCase: (caseId: string, finalDraft: string) => Promise<void>;`

- [ ] **Step 3: Update `rejectCase`**

```ts
rejectCase: async (caseId, reason) => {
  const { sessionId } = get();
  const user = await getCurrentUser();
  const doctorId = user?.id ?? 'dr-unknown';

  await updateCaseStatus(caseId, 'rejected', doctorId);
  await insertAuditLog('REJECTED', sessionId ?? 'unknown', {
    actor_id: doctorId,
    case_id: caseId,
    payload: { reason },
  });

  db.cases.reject(caseId, doctorId, reason);
  set({ cases: db.cases.list(), selectedCaseId: null, debugLogs: db.debug.list() });
},
```

Update the `AppState` type: `rejectCase: (caseId: string, reason: string) => Promise<void>;`

- [ ] **Step 4: Manual test**

Submit a message → doctor queue shows case → click Approve with a draft text → check Supabase `cases` (status=approved), `ai_drafts` (doctor_edited set), `messages` (one row sender=doctor, is_approved=true), `audit_log` (APPROVED event).

- [ ] **Step 5: Commit**

```bash
git add medkid-app/src/store/app-store.ts
git commit -m "feat: persist approve/reject to Supabase (cases, ai_drafts, messages, audit_log)"
```

---

## Task 15: Wire Emergency Keywords from Supabase (Sprint 2 — US-034)

**Files:**
- Modify: `medkid-app/src/lib/emergency.ts`

Currently `checkEmergency` uses `EMERGENCY_KEYWORDS` constant from mock data. Update to load from Supabase on app init and fall back to the constant.

- [ ] **Step 1: Add `loadEmergencyKeywords` to `app-store.ts`**

Add to `AppState`:

```ts
loadEmergencyKeywords: () => Promise<void>;
```

Add import: `import { fetchEmergencyKeywords } from '@/lib/supabase/emergency';`

Add to store:

```ts
loadEmergencyKeywords: async () => {
  try {
    const rows = await fetchEmergencyKeywords();
    const allKeywords = rows.flatMap((r) => [r.keyword, ...r.variants]);
    set({ emergencyKeywords: allKeywords });
  } catch {
    // Keep default mock keywords on error
  }
},
```

- [ ] **Step 2: Update `checkEmergency` to accept keyword list parameter**

In `medkid-app/src/lib/emergency.ts`, update the function signature:

```ts
export function checkEmergency(
  text: string,
  keywords?: string[]
): { triggered: boolean; matched: string[] } {
  const list = keywords ?? EMERGENCY_KEYWORDS;
  const normalized = normalize(text);
  const matched: string[] = [];

  for (const kw of list) {
    const normalizedKw = normalize(kw);
    if (normalized.includes(normalizedKw)) {
      matched.push(kw);
      continue;
    }
    if (normalizedKw.length > 5) {
      const words = normalized.split(/\s+/);
      for (const word of words) {
        if (Math.abs(word.length - normalizedKw.length) <= 2) {
          if (levenshtein(word, normalizedKw) <= 1) {
            matched.push(kw);
            break;
          }
        }
      }
    }
  }
  return { triggered: matched.length > 0, matched };
}
```

- [ ] **Step 3: Pass keywords from store in `pipeline.ts`**

In `runPipeline`, the `emergencyKeywords` from store state is passed in. Update `runPipeline` signature:

```ts
export async function runPipeline(
  rawText: string,
  sessionId: string,
  vclinicId?: string,
  hasImage = false,
  emergencyKeywords?: string[]  // <-- add this
): Promise<PipelineResult> {
  // ...
  const emergencyResult = checkEmergency(rawText, emergencyKeywords);
```

Update caller in `app-store.ts` `sendMessage`:

```ts
const result = await runPipeline(text, sessionId, vclinicId, !!images?.length, get().emergencyKeywords.length > 0 ? get().emergencyKeywords : undefined);
```

- [ ] **Step 4: Call `loadEmergencyKeywords` on app start**

In `medkid-app/src/app/page.tsx`, add:

```ts
const loadEmergencyKeywords = useAppStore((s) => s.loadEmergencyKeywords);
useEffect(() => { loadEmergencyKeywords(); }, [loadEmergencyKeywords]);
```

- [ ] **Step 5: Commit**

```bash
git add medkid-app/src/lib/emergency.ts medkid-app/src/lib/pipeline.ts medkid-app/src/store/app-store.ts medkid-app/src/app/page.tsx
git commit -m "feat: load emergency keywords from Supabase, fallback to mock"
```

---

## Task 16: Build & Smoke Test

**Files:** None — verification only.

- [ ] **Step 1: Run full build**

```bash
cd medkid-app && npm run build 2>&1
```

Expected: Build succeeds with 0 TypeScript errors.

- [ ] **Step 2: Run lint**

```bash
cd medkid-app && npm run lint 2>&1
```

Expected: 0 errors.

- [ ] **Step 3: Manual end-to-end smoke test**

1. Open `http://localhost:3000`
2. Click "Đồng ý" on consent modal → check `audit_log` in Supabase: CONSENT_GRANTED row
3. Type "bé bị sốt" in chat → Submit → check `cases` table: new pending row
4. Doctor panel: pending case appears (realtime or after refresh)
5. Doctor clicks case → types draft → clicks Approve
6. Check `cases.status = approved`, `messages` has doctor response, `ai_drafts` has draft
7. Parent chat panel: doctor reply appears
8. Type "bé bị co giật" → Emergency screen should appear (using Supabase keywords)

- [ ] **Step 4: Commit smoke test passing**

```bash
git commit --allow-empty -m "chore: Sprint 2 Supabase integration smoke test passed"
```

---

## Sprint 3 Notes (Not in this plan)

The following are deferred to a separate plan per the 3-Sprint schedule:

- `src/lib/supabase/knowledge.ts` — `matchKnowledge(embedding)` calling `match_knowledge` RPC
- Embedding generation Edge Function (`supabase/functions/embed_query/`)
- `dispatch_response` Edge Function for atomic approve + disclaimer
- Claude API streaming integration replacing `MOCK_AI_DRAFT`
- EMR mock wiring: `emr_mock` table → inject into LLM context
- `src/lib/supabase/server.ts` — server-side client using `createServerClient` from `@supabase/ssr` for any Route Handlers added in Sprint 3
