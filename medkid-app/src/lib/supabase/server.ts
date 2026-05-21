import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';

// Server-side client dùng service_role key để bypass RLS khi cần,
// hoặc dùng user JWT để enforce RLS.

export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Tạo client với JWT của user để RLS enforce đúng permission
export function createUserClient(accessToken: string) {
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  client.realtime.setAuth(accessToken);
  // Gắn JWT vào mọi request
  (client as unknown as { rest: { headers: Record<string, string> } }).rest.headers[
    'Authorization'
  ] = `Bearer ${accessToken}`;
  return client;
}

// Extract Bearer token từ Authorization header
export function extractToken(req: NextRequest): string | null {
  const auth = req.headers.get('authorization') ?? '';
  if (!auth.startsWith('Bearer ')) return null;
  return auth.slice(7);
}

// Verify token và trả về user — dùng service client để getUser
export async function verifyUser(req: NextRequest) {
  const token = extractToken(req);
  if (!token) return null;
  const { data, error } = await createServiceClient().auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}
