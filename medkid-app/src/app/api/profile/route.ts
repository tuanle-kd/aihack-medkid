import { NextRequest } from 'next/server';
import { createServiceClient, verifyUser } from '@/lib/supabase/server';
import { ok, err, unauthorized } from '@/lib/api-response';

// GET /api/profile
// Header: Authorization: Bearer <access_token>
// Trả về profile + role của user hiện tại
export async function GET(req: NextRequest) {
  const user = await verifyUser(req);
  if (!user) return unauthorized();

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();
  if (error) return err(error.message);

  return ok(data);
}

// PATCH /api/profile
// Header: Authorization: Bearer <access_token>
// Body: { full_name?: string, phone?: string }
export async function PATCH(req: NextRequest) {
  const user = await verifyUser(req);
  if (!user) return unauthorized();

  const body = await req.json().catch(() => null);
  if (!body) return err('Invalid JSON body');

  const patch: Record<string, string> = {};
  if (body.full_name) patch.full_name = body.full_name;
  if (body.phone) patch.phone = body.phone;
  if (Object.keys(patch).length === 0) return err('No fields to update');

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('user_profiles')
    .update(patch)
    .eq('id', user.id)
    .select()
    .single();
  if (error) return err(error.message);

  return ok(data);
}
