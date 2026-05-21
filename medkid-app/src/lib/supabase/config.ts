import { getSupabase } from './client';

export async function getConfig(key: string): Promise<Record<string, unknown> | null> {
  const { data, error } = await getSupabase()
    .from('app_config')
    .select('value')
    .eq('key', key)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data?.value ?? null) as Record<string, unknown> | null;
}

export async function getDisclaimer(): Promise<string> {
  const config = await getConfig('disclaimer');
  return (config?.text as string) ?? 'Thông tin chỉ mang tính tham khảo, không thay thế chẩn đoán của bác sĩ.';
}
