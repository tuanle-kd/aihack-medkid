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
