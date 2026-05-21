import { getSupabase } from './client';
import type { CaseRow } from './types';

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
  return data as CaseRow;
}

export async function listPendingCases(): Promise<CaseRow[]> {
  const { data, error } = await getSupabase()
    .from('cases')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as CaseRow[];
}

export async function listCasesByParent(parentId: string): Promise<CaseRow[]> {
  const { data, error } = await getSupabase()
    .from('cases')
    .select('*')
    .eq('parent_id', parentId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as CaseRow[];
}

export async function updateCaseStatus(
  caseId: string,
  status: CaseRow['status'],
  doctorId?: string
): Promise<void> {
  const patch: Record<string, unknown> = { status };
  if (doctorId) patch.doctor_id = doctorId;
  if (status === 'approved') patch.approved_at = new Date().toISOString();

  const { error } = await getSupabase().from('cases').update(patch).eq('id', caseId);
  if (error) throw new Error(error.message);
}

export function subscribeToNewCases(
  onInsert: (row: CaseRow) => void,
  onUpdate: (row: CaseRow) => void
) {
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
