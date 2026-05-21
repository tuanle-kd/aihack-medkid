import { NextRequest } from 'next/server';
import { createServiceClient, verifyUser } from '@/lib/supabase/server';
import { ok, err, unauthorized } from '@/lib/api-response';

// GET /api/children
// Header: Authorization: Bearer <access_token>
// Trả về danh sách con của phụ huynh hiện tại
export async function GET(req: NextRequest) {
  const user = await verifyUser(req);
  if (!user) return unauthorized();

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('children')
    .select('*')
    .eq('parent_id', user.id)
    .order('created_at', { ascending: true });
  if (error) return err(error.message);

  return ok(data);
}

// POST /api/children
// Header: Authorization: Bearer <access_token>
// Body: { full_name, dob?, gender?, weight_kg?, vclinic_sid? }
// Tạo hồ sơ bệnh nhi mới
export async function POST(req: NextRequest) {
  const user = await verifyUser(req);
  if (!user) return unauthorized();

  const body = await req.json().catch(() => null);
  if (!body?.full_name) return err('full_name is required');

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('children')
    .insert({
      parent_id: user.id,
      full_name: body.full_name,
      dob: body.dob ?? null,
      gender: body.gender ?? null,
      weight_kg: body.weight_kg ?? null,
      vclinic_sid: body.vclinic_sid ?? null,
    })
    .select()
    .single();
  if (error) return err(error.message);

  return ok(data, 201);
}
