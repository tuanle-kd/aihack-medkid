import { getSupabase } from './client';
import type { AiDraftRow } from './types';

export async function createDraft(caseId: string, doctorEdited: string): Promise<AiDraftRow> {
  const { data, error } = await getSupabase()
    .from('ai_drafts')
    .insert({ case_id: caseId, ai_original: null, doctor_edited: doctorEdited })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as AiDraftRow;
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
  return data as AiDraftRow | null;
}
