// ─── Patient / Parent ────────────────────────────────────────────────────────

export interface Child {
  id: string;
  name: string;
  dob: string; // ISO date
  gender: 'male' | 'female';
  weight_kg?: number;
  vclinic_id?: string;
  avatar_color: string;
}

export interface Parent {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
  children: Child[];
  active_child_id: string;
}

// ─── Doctor ───────────────────────────────────────────────────────────────────

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  online: boolean;
}

// ─── EMR ──────────────────────────────────────────────────────────────────────

export interface IgGEntry {
  allergen: string;
  value: number; // U/mL
  level: 'low' | 'medium' | 'high';
}

export interface EMRRecord {
  patient_id: string;
  sid: string;
  full_name: string;
  dob: string;
  gender: 'male' | 'female';
  age_months: number;
  weight_kg: number;
  medical_history: string[];
  current_medications: string[];
  last_visit_date: string;
  last_diagnosis: string;
  attending_doctor: string;
  igg_data: IgGEntry[];
  last_synced: string;
}

// ─── Messages ────────────────────────────────────────────────────────────────

export type SenderType = 'parent' | 'doctor' | 'system';
export type AnxietyLevel = 'calm' | 'concerned' | 'panic';

export interface ChatMessage {
  id: string;
  session_id: string;
  sender: SenderType;
  content: string;
  timestamp: string;
  images?: string[]; // base64 or URLs
  is_approved?: boolean;
  disclaimer?: string;
}

// ─── Case / Queue ─────────────────────────────────────────────────────────────

export type CaseStatus = 'pending' | 'approved' | 'rejected' | 'forwarded';
export type WorkflowType =
  | 'IgG_Food_Sensitivity'
  | 'Respiratory'
  | 'Skin_Lesion'
  | 'General';

export interface CVAnalysis {
  bounding_box?: { x: number; y: number; w: number; h: number };
  area_cm2?: number;
  dominant_color?: 'red' | 'pink' | 'brown' | 'yellow' | 'unknown';
  morphology?: 'papule' | 'plaque' | 'lesion' | 'blister' | 'unknown';
}

export interface MedCase {
  id: string;
  session_id: string;
  patient_id: string;
  patient_name: string;
  patient_age_months: number;
  created_at: string;
  status: CaseStatus;
  messages: ChatMessage[];
  ai_draft?: string;
  edited_draft?: string;
  anxiety_level: AnxietyLevel;
  workflow_type: WorkflowType;
  has_images: boolean;
  cv_analysis?: CVAnalysis;
  emr?: EMRRecord;
  rag_snippets?: RAGSnippet[];
  symptom_keywords: string[];
  doctor_id?: string;
  approved_at?: string;
  rejected_at?: string;
  rejection_reason?: string;
  token_diff?: { added: string[]; removed: string[]; total_added: number; total_removed: number };
}

// ─── RAG ──────────────────────────────────────────────────────────────────────

export interface RAGSnippet {
  id: string;
  title: string;
  content: string;
  similarity: number;
  source: string;
}

// ─── Session ──────────────────────────────────────────────────────────────────

export interface AppSession {
  id: string;
  is_consented: boolean;
  consented_at?: string;
  parent?: Parent;
  created_at: string;
  last_active: string;
}

// ─── Audit ────────────────────────────────────────────────────────────────────

export type AuditEvent =
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

export interface AuditLog {
  id: string;
  event: AuditEvent;
  session_id: string;
  account_id?: string;
  case_id?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// ─── Debug Console ────────────────────────────────────────────────────────────

export type LogType = 'system' | 'feedback' | 'tuning' | 'ml' | 'error';

export interface DebugLog {
  id: string;
  type: LogType;
  message: string;
  timestamp: string;
  stage?: string;
  duration_ms?: number;
}
