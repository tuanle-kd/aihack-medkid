import { NextRequest } from 'next/server';
import { createServiceClient, verifyUser } from '@/lib/supabase/server';
import { ok, err, unauthorized, notFound } from '@/lib/api-response';

// GET /api/drafts?case_id=<uuid> 🔒
// Lấy draft mới nhất của một case
export async function GET(req: NextRequest) {
  const user = await verifyUser(req);
  if (!user) return unauthorized();

  const caseId = req.nextUrl.searchParams.get('case_id');
  if (!caseId) return err('case_id is required');

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('ai_drafts')
    .select('*')
    .eq('case_id', caseId)
    .order('created_at', { ascending: false })
    .maybeSingle();
  if (error) return err(error.message);
  if (!data) return notFound();

  return ok(data);
}

// POST /api/drafts 🔒
// Body: { case_id, doctor_edited, ai_original?, rag_snippets? }
export async function POST(req: NextRequest) {
  const user = await verifyUser(req);
  if (!user) return unauthorized();

  const body = await req.json().catch(() => null);
  if (!body?.case_id || !body?.doctor_edited) {
    return err('case_id and doctor_edited are required');
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('ai_drafts')
    .insert({
      case_id: body.case_id,
      doctor_edited: body.doctor_edited,
      ai_original: body.ai_original ?? null,
      rag_snippets: body.rag_snippets ?? [],
    })
    .select()
    .single();
  if (error) return err(error.message);

  return ok(data, 201);
}

// PATCH /api/drafts/:id  → truyền id qua body vì Next.js dynamic route cần [id]/route.ts
// Body: { id, doctor_edited }
export async function PATCH(req: NextRequest) {
  const user = await verifyUser(req);
  if (!user) return unauthorized();

  const body = await req.json().catch(() => null);
  if (!body?.id || !body?.doctor_edited) {
    return err('id and doctor_edited are required');
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('ai_drafts')
    .update({ doctor_edited: body.doctor_edited })
    .eq('id', body.id)
    .select()
    .single();
  if (error) return err(error.message);

  return ok(data);
}
