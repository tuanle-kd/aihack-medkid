import { getSupabase } from './client';

export type AuditEventType =
  | 'CONSENT_GRANTED'
  | 'SESSION_START'
  | 'SESSION_EXPIRED'
  | 'MESSAGE_SENT'
  | 'DRAFT_GENERATED'
  | 'APPROVED'
  | 'REJECTED'
  | 'FORWARDED'
  | 'DATA_DELETED'
  | 'EMERGENCY_BYPASS';

export async function insertAuditLog(
  eventType: AuditEventType,
  sessionUuid: string,
  extra?: { actor_id?: string; case_id?: string; payload?: Record<string, unknown> }
) {
  const { error } = await getSupabase().from('audit_log').insert({
    event_type: eventType,
    session_uuid: sessionUuid,
    actor_id: extra?.actor_id ?? null,
    case_id: extra?.case_id ?? null,
    payload: extra?.payload ?? null,
  });
  if (error) console.error('[audit_log insert]', error.message);
  // Audit failures are non-fatal — log but don't throw
}
