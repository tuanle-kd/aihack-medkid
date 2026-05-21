/**
 * Mock AI Pipeline — mô phỏng toàn bộ luồng xử lý.
 * Mỗi stage log latency ra debug console.
 */

import { db } from './mock-db';
import { checkEmergency } from './emergency';
import { MOCK_RAG_SNIPPETS, MOCK_AI_DRAFT, MOCK_EMR } from '@/mock/data';
import type { MedCase, AnxietyLevel, WorkflowType } from '@/types';
import { v4 as uuidv4 } from 'uuid';

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function logStage(stage: string, durationMs: number, status: 'ok' | 'error' = 'ok') {
  db.debug.log('system', `[${stage}] ${status.toUpperCase()} — ${durationMs}ms`, {
    stage,
    duration_ms: durationMs,
  });
}

// ─── NLP Normalize ───────────────────────────────────────────────────────────

const TYPO_MAP: Record<string, string> = {
  'sôt': 'sốt', 'hot': 'ho', 'nguc': 'ngực', 'kho tho': 'khó thở',
  'phat ban': 'phát ban', 'ngua': 'ngứa',
};

export function nlpNormalize(text: string): string {
  let result = text.toLowerCase();
  for (const [typo, correct] of Object.entries(TYPO_MAP)) {
    result = result.replace(new RegExp(typo, 'gi'), correct);
  }
  return result;
}

export function detectAnxiety(text: string): AnxietyLevel {
  const panicWords = ['cứu', 'nguy hiểm', 'chết', 'sợ quá', 'lo quá', 'khẩn cấp'];
  const concernedWords = ['lo', 'sợ', 'không biết', 'cần khám'];
  const lower = text.toLowerCase();
  if (panicWords.some((w) => lower.includes(w))) return 'panic';
  if (concernedWords.some((w) => lower.includes(w))) return 'concerned';
  return 'calm';
}

export function detectWorkflow(text: string): WorkflowType {
  const lower = text.toLowerCase();
  if (/phát ban|nổi mẩn|tổn thương da|ngứa/.test(lower)) return 'Skin_Lesion';
  if (/ho|thở|khò khè|hô hấp/.test(lower)) return 'Respiratory';
  if (/dị ứng|igg|thức ăn/.test(lower)) return 'IgG_Food_Sensitivity';
  return 'General';
}

export function extractKeywords(text: string): string[] {
  const keywords: string[] = [];
  const patterns = ['sốt', 'ho', 'phát ban', 'ngứa', 'đau bụng', 'nôn', 'tiêu chảy', 'khò khè'];
  for (const p of patterns) {
    if (text.toLowerCase().includes(p)) keywords.push(p);
  }
  return keywords.slice(0, 3);
}

// ─── Full Pipeline ────────────────────────────────────────────────────────────

export interface PipelineResult {
  isEmergency: boolean;
  emergencyKeywords?: string[];
  normalizedText: string;
  anxietyLevel: AnxietyLevel;
  workflowType: WorkflowType;
  ragSnippets: typeof MOCK_RAG_SNIPPETS;
  emrData: (typeof MOCK_EMR)[string] | null;
  cvAnalysis: MedCase['cv_analysis'] | null;
  aiDraft: string;
  pipelineDurationMs: number;
}

export async function runPipeline(
  rawText: string,
  sessionId: string,
  vclinicId?: string,
  hasImage = false
): Promise<PipelineResult> {
  const pipelineStart = Date.now();

  db.debug.log('system', `[PIPELINE START] session=${sessionId} hasImage=${hasImage}`);

  // Stage 1: Emergency check (synchronous, < 20ms)
  const t0 = Date.now();
  const emergencyResult = checkEmergency(rawText);
  logStage('Emergency_Filter', Date.now() - t0);

  if (emergencyResult.triggered) {
    db.debug.log('system', `[EMERGENCY BYPASS] keywords=${emergencyResult.matched.join(', ')}`);
    db.audit.log('EMERGENCY_BYPASS', sessionId);
    return {
      isEmergency: true,
      emergencyKeywords: emergencyResult.matched,
      normalizedText: rawText,
      anxietyLevel: 'panic',
      workflowType: 'General',
      ragSnippets: [],
      emrData: null,
      cvAnalysis: null,
      aiDraft: '',
      pipelineDurationMs: Date.now() - pipelineStart,
    };
  }

  // Stage 2: NLP normalize
  const t1 = Date.now();
  await delay(80 + Math.random() * 50);
  const normalizedText = nlpNormalize(rawText);
  const anxietyLevel = detectAnxiety(rawText);
  const workflowType = detectWorkflow(normalizedText);
  logStage('NLP_Preprocess', Date.now() - t1);
  db.debug.log('feedback', `[NLP] anxiety=${anxietyLevel} workflow=${workflowType}`);

  // Stage 3: RAG retrieve + EMR sync (parallel)
  const [ragResult, emrResult] = await Promise.all([
    (async () => {
      const t = Date.now();
      await delay(200 + Math.random() * 100);
      const snippets = MOCK_RAG_SNIPPETS.filter((s) => s.similarity > 0.6);
      logStage('RAG_Retrieve', Date.now() - t);
      db.debug.log('ml', `[RAG] top-${snippets.length} retrieved, max_sim=${snippets[0]?.similarity}`);
      return snippets;
    })(),
    (async () => {
      const t = Date.now();
      await delay(150 + Math.random() * 100);
      const emr = vclinicId ? (MOCK_EMR[vclinicId] ?? null) : null;
      logStage('EMR_Sync', Date.now() - t, emr ? 'ok' : 'ok');
      if (!emr) db.debug.log('system', '[VCLINIC] no EMR found, proceeding without');
      return emr;
    })(),
  ]);

  // Stage 4: CV analyze (if image)
  let cvAnalysis: MedCase['cv_analysis'] | null = null;
  if (hasImage) {
    const t = Date.now();
    await delay(800 + Math.random() * 200);
    cvAnalysis = {
      bounding_box: { x: 110 + Math.random() * 20, y: 70 + Math.random() * 20, w: 190, h: 145 },
      area_cm2: parseFloat((3.5 + Math.random() * 2).toFixed(1)),
      dominant_color: 'red',
      morphology: workflowType === 'Skin_Lesion' ? 'papule' : 'unknown',
    };
    logStage('CV_Analyze', Date.now() - t);
    db.debug.log('ml', `[CV] area=${cvAnalysis.area_cm2}cm² color=${cvAnalysis.dominant_color}`);
  }

  // Stage 5: Fusion
  const t4 = Date.now();
  await delay(50);
  const wCv = workflowType === 'Skin_Lesion' ? 0.7 : workflowType === 'Respiratory' ? 0.3 : 0.2;
  const wNlp = 1 - wCv;
  logStage('Fusion', Date.now() - t4);
  db.debug.log('tuning', `[FUSION] W_nlp=${wNlp} W_cv=${wCv} workflow=${workflowType}`);

  // Stage 6: LLM draft
  const t5 = Date.now();
  await delay(1000 + Math.random() * 500);
  const aiDraft = MOCK_AI_DRAFT; // In production: call Claude API
  logStage('LLM_Draft', Date.now() - t5);
  db.debug.log('system', `[LLM] draft generated, ${aiDraft.split(' ').length} words`);

  const total = Date.now() - pipelineStart;
  db.debug.log('system', `[PIPELINE DONE] total=${total}ms`);

  return {
    isEmergency: false,
    normalizedText,
    anxietyLevel,
    workflowType,
    ragSnippets: ragResult,
    emrData: emrResult,
    cvAnalysis,
    aiDraft,
    pipelineDurationMs: total,
  };
}

// ─── New Case ────────────────────────────────────────────────────────────────

export function createNewCase(
  sessionId: string,
  result: PipelineResult,
  rawText: string,
  patientName: string,
  patientAgeMonths: number,
  images?: string[]
): MedCase {
  const caseId = `case-${uuidv4().slice(0, 8)}`;
  const now = new Date().toISOString();

  const newCase: MedCase = {
    id: caseId,
    session_id: sessionId,
    patient_id: 'current-patient',
    patient_name: patientName,
    patient_age_months: patientAgeMonths,
    created_at: now,
    status: 'pending',
    anxiety_level: result.anxietyLevel,
    workflow_type: result.workflowType,
    has_images: !!images?.length,
    symptom_keywords: extractKeywords(rawText),
    messages: [
      {
        id: `msg-${uuidv4().slice(0, 8)}`,
        session_id: sessionId,
        sender: 'parent',
        content: rawText,
        timestamp: now,
        images,
      },
    ],
    ai_draft: result.aiDraft,
    emr: result.emrData ?? undefined,
    rag_snippets: result.ragSnippets,
    cv_analysis: result.cvAnalysis ?? undefined,
  };

  db.cases.upsert(newCase);
  db.audit.log('MESSAGE_SENT', sessionId, { case_id: caseId });
  db.audit.log('DRAFT_GENERATED', sessionId, { case_id: caseId });

  return newCase;
}
