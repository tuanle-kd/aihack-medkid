import { NextRequest } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { ok, err } from '@/lib/api-response';

// GET /api/emergency
// Public — không cần auth
// Lấy danh sách từ khóa khẩn cấp đang active
export async function GET(_req: NextRequest) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('emergency_keywords')
    .select('keyword, variants')
    .eq('active', true);
  if (error) return err(error.message);

  return ok(data);
}
