import { getSupabase } from './client';
import type { UserProfileRow } from './types';

export async function getProfile(userId: string): Promise<UserProfileRow | null> {
  const { data, error } = await getSupabase()
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data as UserProfileRow | null;
}

export async function updateProfile(
  userId: string,
  patch: { full_name?: string; phone?: string }
): Promise<void> {
  const { error } = await getSupabase()
    .from('user_profiles')
    .update(patch)
    .eq('id', userId);
  if (error) throw new Error(error.message);
}
