import { getSupabase } from './client';
import type { HospitalRow } from './types';

export async function fetchHospitals(): Promise<HospitalRow[]> {
  const { data, error } = await getSupabase()
    .from('hospitals')
    .select('*')
    .order('priority', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as HospitalRow[];
}
