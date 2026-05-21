import { createBrowserClient } from '@supabase/ssr';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

// Real Supabase client (used when USE_MOCK=false)
export function createClient() {
  if (USE_MOCK) {
    // Return a no-op proxy for mock mode
    return null;
  }
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export { USE_MOCK };
