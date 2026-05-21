import { NextRequest } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { ok, err } from '@/lib/api-response';

const DEV_OTP = '294296';
const isDevMode = process.env.NODE_ENV !== 'production';

// POST /api/auth/verify
// Body: { phone: string, token: string }
// Trả về: { access_token, refresh_token, user }
// Dev mode: OTP 294296 → signInWithPassword bằng dev account (DEV_EMAIL + DEV_PASSWORD)
// Production: verifyOtp SMS thật
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.phone || !body?.token) return err('phone and token are required');

  const supabase = createServiceClient();

  if (isDevMode) {
    if (body.token !== DEV_OTP) return err(`Dev mode: use OTP ${DEV_OTP}`);
    const devEmail = process.env.DEV_EMAIL;
    const devPassword = process.env.DEV_PASSWORD;
    if (!devEmail || !devPassword) return err('DEV_EMAIL and DEV_PASSWORD not set in .env.local');
    const { data, error } = await supabase.auth.signInWithPassword({ email: devEmail, password: devPassword });
    if (error) return err(error.message);
    return ok({
      access_token: data.session?.access_token,
      refresh_token: data.session?.refresh_token,
      user: { id: data.user?.id, phone: data.user?.phone ?? body.phone },
    });
  }

  const { data, error } = await supabase.auth.verifyOtp({
    phone: body.phone,
    token: body.token,
    type: 'sms',
  });
  if (error) return err(error.message);

  return ok({
    access_token: data.session?.access_token,
    refresh_token: data.session?.refresh_token,
    user: {
      id: data.user?.id,
      phone: data.user?.phone,
    },
  });
}
