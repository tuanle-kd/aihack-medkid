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
