import { NextRequest } from 'next/server';
import { createServiceClient, verifyUser } from '@/lib/supabase/server';
import { ok, err, unauthorized } from '@/lib/api-response';

// PATCH /api/cases/:id 🔒
// Body: { status, doctor_id? }
// Doctor dùng để approve / reject / forward case
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifyUser(req);
  if (!user) return unauthorized();

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body?.status) return err('status is required');

  const validStatuses = ['pending', 'approved', 'rejected', 'forwarded', 'emergency'];
  if (!validStatuses.includes(body.status)) {
    return err(`status must be one of: ${validStatuses.join(', ')}`);
  }

  const patch: Record<string, unknown> = { status: body.status };
  if (body.doctor_id) patch.doctor_id = body.doctor_id;
  if (body.status === 'approved') patch.approved_at = new Date().toISOString();

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('cases')
    .update(patch)
    .eq('id', id)
    .select()
    .single();
  if (error) return err(error.message);

  return ok(data);
}
