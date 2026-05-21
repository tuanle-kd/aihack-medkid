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

// ─── Insert types (only server-generated columns are optional) ───────────────

export interface UserProfileInsert {
  id: string; // from auth.users
  role?: 'parent' | 'doctor' | 'admin';
  full_name?: string | null;
  phone?: string | null;
  created_at?: string;
}

export interface ChildInsert {
  id?: string;
  parent_id: string;
  full_name: string;
  dob?: string | null;
  gender?: 'male' | 'female' | 'other' | null;
  weight_kg?: number | null;
  vclinic_sid?: string | null;
  avatar_color?: string;
  created_at?: string;
}

export interface ConsentInsert {
  id?: string;
  parent_id?: string | null;
  session_uuid: string;
  granted_at?: string;
  revoked_at?: string | null;
}

export interface CaseInsert {
  id?: string;
  child_id?: string | null;
  parent_id: string;
  doctor_id?: string | null;
  status?: 'pending' | 'approved' | 'rejected' | 'forwarded' | 'emergency';
  anxiety_level?: 'calm' | 'concerned' | 'panic' | null;
  workflow_type?: 'igg' | 'respiratory' | 'skin' | 'general' | null;
  fusion_weights?: Record<string, number> | null;
  sla_state?: 'ok' | 'warning' | 'breach';
  created_at?: string;
  approved_at?: string | null;
}

export interface MessageInsert {
  id?: string;
  case_id: string;
  sender: 'parent' | 'doctor' | 'system';
  raw_text?: string | null;
  normalized_text?: string | null;
  image_urls?: string[];
  cv_metadata?: Record<string, unknown> | null;
  is_approved?: boolean;
  disclaimer_version?: string | null;
  created_at?: string;
}

export interface AiDraftInsert {
  id?: string;
  case_id: string;
  ai_original?: string | null;
  doctor_edited?: string | null;
  rag_snippets?: Array<{ title: string; score: number; text: string }>;
  token_diff?: Record<string, unknown> | null;
  created_at?: string;
}

export interface AuditLogInsert {
  id?: string;
  event_type: string;
  actor_id?: string | null;
  case_id?: string | null;
  session_uuid?: string | null;
  payload?: Record<string, unknown> | null;
  created_at?: string;
}

// Database interface for createBrowserClient<Database>
export interface Database {
  public: {
    Views: Record<string, never>;
    Tables: {
      user_profiles: { Row: UserProfileRow; Insert: UserProfileInsert; Update: Partial<UserProfileRow>; Relationships: [] };
      children: { Row: ChildRow; Insert: ChildInsert; Update: Partial<ChildRow>; Relationships: [] };
      consents: { Row: ConsentRow; Insert: ConsentInsert; Update: Partial<ConsentRow>; Relationships: [] };
      cases: { Row: CaseRow; Insert: CaseInsert; Update: Partial<CaseRow>; Relationships: [] };
      messages: { Row: MessageRow; Insert: MessageInsert; Update: Partial<MessageRow>; Relationships: [] };
      ai_drafts: { Row: AiDraftRow; Insert: AiDraftInsert; Update: Partial<AiDraftRow>; Relationships: [] };
      audit_log: { Row: AuditLogRow; Insert: AuditLogInsert; Update: Partial<AuditLogRow>; Relationships: [] };
      emergency_keywords: { Row: EmergencyKeywordRow; Insert: Partial<EmergencyKeywordRow>; Update: Partial<EmergencyKeywordRow>; Relationships: [] };
      hospitals: { Row: HospitalRow; Insert: Partial<HospitalRow>; Update: Partial<HospitalRow>; Relationships: [] };
      app_config: { Row: AppConfigRow; Insert: Partial<AppConfigRow>; Update: Partial<AppConfigRow>; Relationships: [] };
    };
    Functions: {
      match_knowledge: {
        Args: { query_embedding: number[]; match_threshold?: number; match_count?: number };
        Returns: Array<{ id: string; question_sample: string; answer_reference: string; tags: string[]; similarity: number }>;
      };
    };
  };
}
