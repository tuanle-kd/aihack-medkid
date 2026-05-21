import { NextRequest } from 'next/server';
import { createServiceClient, verifyUser } from '@/lib/supabase/server';
import { ok, err } from '@/lib/api-response';

// POST /api/audit
// Header: Authorization: Bearer <access_token>  (optional)
// Body: { event_type, session_uuid, case_id?, payload? }
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.event_type || !body?.session_uuid) {
    return err('event_type and session_uuid are required');
  }

  const user = await verifyUser(req);

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('audit_log')
    .insert({
      event_type: body.event_type,
      session_uuid: body.session_uuid,
      actor_id: user?.id ?? null,
      case_id: body.case_id ?? null,
      payload: body.payload ?? null,
    })
    .select()
    .single();
  if (error) return err(error.message);

  return ok(data, 201);
}
