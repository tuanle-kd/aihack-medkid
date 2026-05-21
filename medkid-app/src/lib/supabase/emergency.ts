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
  return (data ?? []) as EmergencyKeyword[];
}
