import { NextRequest } from 'next/server';
import { createServiceClient, verifyUser } from '@/lib/supabase/server';
import { ok, err, unauthorized } from '@/lib/api-response';

// GET /api/messages?case_id=<uuid> 🔒
// Lấy toàn bộ tin nhắn của một case
export async function GET(req: NextRequest) {
  const user = await verifyUser(req);
  if (!user) return unauthorized();

  const caseId = req.nextUrl.searchParams.get('case_id');
  if (!caseId) return err('case_id is required');

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('case_id', caseId)
    .order('created_at', { ascending: true });
  if (error) return err(error.message);

  return ok(data);
}

// POST /api/messages 🔒
// Body: { case_id, sender, raw_text, image_urls?, is_approved?, disclaimer_version?, normalized_text? }
export async function POST(req: NextRequest) {
  const user = await verifyUser(req);
  if (!user) return unauthorized();

  const body = await req.json().catch(() => null);
  if (!body?.case_id || !body?.sender || !body?.raw_text) {
    return err('case_id, sender and raw_text are required');
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('messages')
    .insert({
      case_id: body.case_id,
      sender: body.sender,
      raw_text: body.raw_text,
      normalized_text: body.normalized_text ?? null,
      image_urls: body.image_urls ?? [],
      is_approved: body.is_approved ?? false,
      disclaimer_version: body.disclaimer_version ?? null,
    })
    .select()
    .single();
  if (error) return err(error.message);

  return ok(data, 201);
}
