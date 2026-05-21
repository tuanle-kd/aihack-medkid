import { NextRequest } from 'next/server';
import { createServiceClient, verifyUser } from '@/lib/supabase/server';
import { ok, err, unauthorized } from '@/lib/api-response';
import { v4 as uuidv4 } from 'uuid';

// POST /api/consents
// Header: Authorization: Bearer <access_token>  (optional — anonymous consent supported)
// Body: { session_uuid?: string }
// Lưu đồng thuận Nghị định 13
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const sessionUuid = body.session_uuid ?? uuidv4();

  const user = await verifyUser(req);
  const parentId = user?.id ?? null;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('consents')
    .insert({ parent_id: parentId, session_uuid: sessionUuid })
    .select()
    .single();
  if (error) return err(error.message);

  // Ghi audit log
  await supabase.from('audit_log').insert({
    event_type: 'CONSENT_GRANTED',
    session_uuid: sessionUuid,
    actor_id: parentId,
  });

  return ok(data, 201);
}

// GET /api/consents?session_uuid=<uuid>
// Kiểm tra session đã consent chưa
export async function GET(req: NextRequest) {
  const sessionUuid = req.nextUrl.searchParams.get('session_uuid');
  if (!sessionUuid) return err('session_uuid is required');

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('consents')
    .select('id, granted_at')
    .eq('session_uuid', sessionUuid)
    .is('revoked_at', null)
    .maybeSingle();
  if (error) return err(error.message);

  return ok({ consented: data !== null, consent: data });
}
