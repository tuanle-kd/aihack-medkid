import { getSupabase } from './client';

export async function sendOtp(phone: string) {
  const { error } = await getSupabase().auth.signInWithOtp({ phone });
  if (error) throw new Error(error.message);
}

export async function verifyOtp(phone: string, token: string) {
  const { data, error } = await getSupabase().auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  });
  if (error) throw new Error(error.message);
  return data.session;
}

export async function signOut() {
  const { error } = await getSupabase().auth.signOut();
  if (error) throw new Error(error.message);
}

export function onAuthStateChange(callback: (userId: string | null) => void) {
  return getSupabase().auth.onAuthStateChange((_event, session) => {
    callback(session?.user?.id ?? null);
  });
}

export async function getCurrentUser() {
  const { data } = await getSupabase().auth.getUser();
  return data.user;
}
