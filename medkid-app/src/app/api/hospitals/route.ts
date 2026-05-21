import { NextRequest } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { ok, err } from '@/lib/api-response';

// GET /api/hospitals
// Public — không cần auth
// Lấy danh sách bệnh viện khẩn cấp, sắp xếp theo priority
export async function GET(_req: NextRequest) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('hospitals')
    .select('*')
    .order('priority', { ascending: true });
  if (error) return err(error.message);

  return ok(data);
}
