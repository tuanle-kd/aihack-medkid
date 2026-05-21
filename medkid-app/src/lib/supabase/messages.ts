import { getSupabase } from './client';
import type { MessageRow } from './types';

export async function insertMessage(
  caseId: string,
  sender: MessageRow['sender'],
  text: string,
  opts?: {
    imageUrls?: string[];
    isApproved?: boolean;
    disclaimerVersion?: string;
    normalizedText?: string;
  }
): Promise<MessageRow> {
  const { data, error } = await getSupabase()
    .from('messages')
    .insert({
      case_id: caseId,
      sender,
      raw_text: text,
      normalized_text: opts?.normalizedText ?? null,
      image_urls: opts?.imageUrls ?? [],
      is_approved: opts?.isApproved ?? false,
      disclaimer_version: opts?.disclaimerVersion ?? null,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as MessageRow;
}

export async function listMessages(caseId: string): Promise<MessageRow[]> {
  const { data, error } = await getSupabase()
    .from('messages')
    .select('*')
    .eq('case_id', caseId)
    .order('created_at', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as MessageRow[];
}

export function subscribeToMessages(
  caseId: string,
  onMessage: (row: MessageRow) => void
) {
  return getSupabase()
    .channel(`messages-${caseId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `case_id=eq.${caseId}` },
      (payload) => onMessage(payload.new as MessageRow)
    )
    .subscribe();
}
