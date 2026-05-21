import { NextRequest } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { ok, err } from '@/lib/api-response';

const DEV_OTP = '294296';
const isDevMode = process.env.NODE_ENV !== 'production';

// POST /api/auth/otp
// Body: { phone: string }
// Gửi OTP SMS đến số điện thoại
// Dev mode: bỏ qua Supabase, OTP mặc định là 294296
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.phone) return err('phone is required');

  if (isDevMode) {
    return ok({ message: 'OTP sent', dev_otp: DEV_OTP });
  }

  const supabase = createServiceClient();
  const { error } = await supabase.auth.signInWithOtp({ phone: body.phone });
  if (error) return err(error.message);

  return ok({ message: 'OTP sent' });
}
