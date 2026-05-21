import { NextRequest } from 'next/server';
import { createServiceClient, verifyUser } from '@/lib/supabase/server';
import { ok, err, unauthorized } from '@/lib/api-response';

// GET /api/cases 🔒
// Query: ?status=pending|approved|rejected|forwarded|emergency  (optional)
//        ?role=doctor  → list all cases (doctor); default → list by parent_id
export async function GET(req: NextRequest) {
  const user = await verifyUser(req);
  if (!user) return unauthorized();

  const supabase = createServiceClient();
  const status = req.nextUrl.searchParams.get('status');
  const role = req.nextUrl.searchParams.get('role');

  let query = supabase.from('cases').select('*').order('created_at', { ascending: false });

  if (role === 'doctor') {
    // Doctor sees all cases (optionally filtered by status)
    if (status) query = query.eq('status', status);
  } else {
    // Parent sees only their own cases
    query = query.eq('parent_id', user.id);
    if (status) query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) return err(error.message);

  return ok(data);
}

// POST /api/cases 🔒
// Body: { child_id?, anxiety_level?, workflow_type? }
export async function POST(req: NextRequest) {
  const user = await verifyUser(req);
  if (!user) return unauthorized();

  const body = await req.json().catch(() => ({}));

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('cases')
    .insert({
      parent_id: user.id,
      child_id: body.child_id ?? null,
      anxiety_level: body.anxiety_level ?? null,
      workflow_type: body.workflow_type ?? null,
      status: 'pending',
      sla_state: 'ok',
    })
    .select()
    .single();
  if (error) return err(error.message);

  return ok(data, 201);
}
