-- ============================================================
-- MediKid-AI — Supabase schema
-- Theo kế hoạch 3 Sprint: Sprint 1 (Auth/Consent/Profile) chạy ngay,
-- Sprint 2 (Chat/Emergency/Doctor flow), Sprint 3 (AI/RAG/LLM) để sẵn cột nullable.
-- Paste toàn bộ file này vào Supabase Dashboard > SQL Editor > Run.
-- ============================================================

-- ---------- Extensions ----------
create extension if not exists vector;        -- Sprint 3: RAG pgvector
create extension if not exists "pgcrypto";    -- gen_random_uuid()

-- ============================================================
-- 1. user_profiles  (liên kết auth.users, gắn role)
--    Sprint 1 — US-008 đăng ký phụ huynh + OTP SMS
-- ============================================================
create table if not exists user_profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        text not null default 'parent' check (role in ('parent','doctor','admin')),
  full_name   text,
  phone       text,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- 2. children  (hồ sơ bệnh nhi)
--    Sprint 1 — US-009 tạo hồ sơ bệnh nhi (MVP: 1 con)
-- ============================================================
create table if not exists children (
  id            uuid primary key default gen_random_uuid(),
  parent_id     uuid not null references user_profiles(id) on delete cascade,
  full_name     text not null,
  dob           date,
  gender        text check (gender in ('male','female','other')),
  weight_kg     numeric,
  vclinic_sid   text,                          -- Sprint 3: liên kết EMR mock
  avatar_color  text default '#4A90D9',
  created_at    timestamptz not null default now()
);
create index if not exists idx_children_parent on children(parent_id);

-- ============================================================
-- 3. consents  (đồng thuận Nghị định 13)
--    Sprint 1 — US-001/US-002 consent gate + audit
-- ============================================================
create table if not exists consents (
  id            uuid primary key default gen_random_uuid(),
  parent_id     uuid references user_profiles(id) on delete cascade,
  session_uuid  uuid not null,                 -- US-007 session UUID v4
  granted_at    timestamptz not null default now(),
  revoked_at    timestamptz
);

-- ============================================================
-- 4. cases  (ca tư vấn — core loop)
--    Sprint 1 tạo, Sprint 2 doctor flow, Sprint 3 thêm AI metadata
-- ============================================================
create table if not exists cases (
  id             uuid primary key default gen_random_uuid(),
  child_id       uuid references children(id) on delete set null,
  parent_id      uuid not null references user_profiles(id) on delete cascade,
  doctor_id      uuid references user_profiles(id),          -- Sprint 2: BS claim ca
  status         text not null default 'pending'
                   check (status in ('pending','approved','rejected','forwarded','emergency')),
  -- Sprint 3 — để sẵn nullable, chưa dùng ở Sprint 1-2:
  anxiety_level  text check (anxiety_level in ('calm','concerned','panic')),
  workflow_type  text check (workflow_type in ('igg','respiratory','skin','general')),
  fusion_weights jsonb,                          -- {"w_nlp":0.6,"w_cv":0.4}
  sla_state      text default 'ok' check (sla_state in ('ok','warning','breach')),
  created_at     timestamptz not null default now(),
  approved_at    timestamptz
);
create index if not exists idx_cases_status  on cases(status);
create index if not exists idx_cases_created on cases(created_at desc);
create index if not exists idx_cases_doctor  on cases(doctor_id);

-- ============================================================
-- 5. messages  (tin nhắn + ảnh; Sprint 3 thêm CV metadata)
--    Sprint 2 — US-010 chat, US-018 ảnh simulated
-- ============================================================
create table if not exists messages (
  id                  uuid primary key default gen_random_uuid(),
  case_id             uuid not null references cases(id) on delete cascade,
  sender              text not null check (sender in ('parent','doctor','system')),
  raw_text            text,
  normalized_text     text,                      -- Sprint 3: NLP normalize
  image_urls          text[] default '{}',
  cv_metadata         jsonb,                     -- Sprint 3: {bbox, area_cm2, color, morphology}
  is_approved         boolean default false,
  disclaimer_version  text,                      -- US-065 medical disclaimer
  created_at          timestamptz not null default now()
);
create index if not exists idx_messages_case on messages(case_id, created_at);

-- ============================================================
-- 6. ai_drafts  (bản nháp BS viết tay ở Sprint 2; AI sinh ở Sprint 3)
--    Sprint 2 — US-043/US-045 hiển thị + inline edit draft
-- ============================================================
create table if not exists ai_drafts (
  id            uuid primary key default gen_random_uuid(),
  case_id       uuid not null references cases(id) on delete cascade,
  ai_original   text,                            -- Sprint 2: NULL (BS tự viết) · Sprint 3: LLM sinh
  doctor_edited text,                            -- nội dung BS chỉnh / tự viết
  rag_snippets  jsonb default '[]'::jsonb,       -- Sprint 3: [{title, score, text}]
  token_diff    jsonb,                           -- Sprint 3: {added_words, removed_words, ...}
  created_at    timestamptz not null default now()
);
create index if not exists idx_drafts_case on ai_drafts(case_id);

-- ============================================================
-- 7. audit_log  (append-only, bất biến) — Sprint 1
-- ============================================================
create table if not exists audit_log (
  id            uuid primary key default gen_random_uuid(),
  event_type    text not null,
  actor_id      uuid,
  case_id       uuid,
  session_uuid  uuid,
  payload       jsonb,
  created_at    timestamptz not null default now()
);
create index if not exists idx_audit_created on audit_log(created_at desc);

-- ============================================================
-- 8. emergency_keywords  (admin CRUD) — Sprint 2 US-034
-- ============================================================
create table if not exists emergency_keywords (
  id        uuid primary key default gen_random_uuid(),
  keyword   text not null,
  variants  text[] default '{}',
  active    boolean default true
);

-- ============================================================
-- 9. hospitals  (BV cấp cứu) — Sprint 2 US-035
-- ============================================================
create table if not exists hospitals (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  address          text,
  lat              numeric,
  lng              numeric,
  emergency_phone  text,
  priority         int default 0
);

-- ============================================================
-- 10. app_config  (cấu hình hot-reload, key-value)
-- ============================================================
create table if not exists app_config (
  key    text primary key,
  value  jsonb not null
);

-- ============================================================
-- 11. emr_mock  (VCLINIC giả lập) — Sprint 3 US-026
-- ============================================================
create table if not exists emr_mock (
  vclinic_sid      text primary key,
  full_name        text not null,
  dob              date,
  gender           text,
  medical_history  jsonb default '[]'::jsonb,
  current_meds     jsonb default '[]'::jsonb,
  last_visit       jsonb,
  igg_results      jsonb default '[]'::jsonb,
  primary_doctor   text
);

-- ============================================================
-- 12. knowledge_base  (RAG + pgvector) — Sprint 3 US-028
-- ============================================================
create table if not exists knowledge_base (
  id                uuid primary key default gen_random_uuid(),
  question_sample   text not null,
  answer_reference  text not null,
  tags              text[] default '{}',
  embedding         vector(1536),                -- Sprint 3: backfill bằng script
  source            text,
  version           int default 1,
  created_at        timestamptz not null default now()
);
create index if not exists idx_kb_embedding
  on knowledge_base using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- ============================================================
-- RPC: match_knowledge  (cosine similarity cho RAG) — Sprint 3
-- ============================================================
create or replace function match_knowledge(
  query_embedding vector(1536),
  match_threshold float default 0.6,
  match_count     int   default 3
)
returns table (
  id               uuid,
  question_sample  text,
  answer_reference text,
  tags             text[],
  similarity       float
)
language sql stable
as $$
  select
    kb.id,
    kb.question_sample,
    kb.answer_reference,
    kb.tags,
    1 - (kb.embedding <=> query_embedding) as similarity
  from knowledge_base kb
  where kb.embedding is not null
    and 1 - (kb.embedding <=> query_embedding) > match_threshold
  order by kb.embedding <=> query_embedding
  limit match_count;
$$;

-- ============================================================
-- Trigger: auto-create user_profiles khi user đăng ký — Sprint 1
-- ============================================================
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.user_profiles (id, full_name, phone)
  values (new.id, new.raw_user_meta_data->>'full_name', new.phone);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table user_profiles       enable row level security;
alter table children            enable row level security;
alter table consents            enable row level security;
alter table cases               enable row level security;
alter table messages            enable row level security;
alter table ai_drafts           enable row level security;
alter table audit_log           enable row level security;
alter table emergency_keywords  enable row level security;
alter table hospitals           enable row level security;
alter table app_config          enable row level security;
alter table emr_mock            enable row level security;
alter table knowledge_base      enable row level security;

-- Helper: role của user hiện tại
create or replace function current_role_is(target text)
returns boolean language sql stable security definer as $$
  select exists (select 1 from user_profiles where id = auth.uid() and role = target);
$$;

-- user_profiles: tự xem/sửa hồ sơ mình; doctor/admin xem tất cả
create policy "profiles_self_select" on user_profiles for select
  using (id = auth.uid() or current_role_is('doctor') or current_role_is('admin'));
create policy "profiles_self_update" on user_profiles for update
  using (id = auth.uid());

-- children: phụ huynh quản lý con mình; doctor/admin xem
create policy "children_owner_all" on children for all
  using (parent_id = auth.uid()) with check (parent_id = auth.uid());
create policy "children_staff_select" on children for select
  using (current_role_is('doctor') or current_role_is('admin'));

-- consents: phụ huynh quản lý của mình
create policy "consents_owner_all" on consents for all
  using (parent_id = auth.uid()) with check (parent_id = auth.uid());

-- cases: phụ huynh xem ca mình; doctor/admin xem & cập nhật tất cả (shared queue)
create policy "cases_owner_select" on cases for select
  using (parent_id = auth.uid() or current_role_is('doctor') or current_role_is('admin'));
create policy "cases_parent_insert" on cases for insert
  with check (parent_id = auth.uid());
create policy "cases_staff_update" on cases for update
  using (current_role_is('doctor') or current_role_is('admin'));

-- messages: ai thấy case thì thấy message của case đó
create policy "messages_select" on messages for select
  using (exists (select 1 from cases c where c.id = case_id
    and (c.parent_id = auth.uid() or current_role_is('doctor') or current_role_is('admin'))));
create policy "messages_insert" on messages for insert
  with check (exists (select 1 from cases c where c.id = case_id
    and (c.parent_id = auth.uid() or current_role_is('doctor') or current_role_is('admin'))));

-- ai_drafts: chỉ doctor/admin
create policy "drafts_staff_all" on ai_drafts for all
  using (current_role_is('doctor') or current_role_is('admin'))
  with check (current_role_is('doctor') or current_role_is('admin'));

-- audit_log: INSERT cho user đăng nhập; SELECT chỉ admin; KHÔNG update/delete (bất biến)
create policy "audit_insert" on audit_log for insert with check (auth.uid() is not null);
create policy "audit_admin_select" on audit_log for select using (current_role_is('admin'));

-- emergency_keywords / hospitals / app_config / knowledge_base: mọi user đọc; admin ghi
create policy "ek_select" on emergency_keywords for select using (auth.uid() is not null);
create policy "ek_admin_write" on emergency_keywords for all
  using (current_role_is('admin')) with check (current_role_is('admin'));
create policy "hosp_select" on hospitals for select using (auth.uid() is not null);
create policy "hosp_admin_write" on hospitals for all
  using (current_role_is('admin')) with check (current_role_is('admin'));
create policy "cfg_select" on app_config for select using (auth.uid() is not null);
create policy "cfg_admin_write" on app_config for all
  using (current_role_is('admin')) with check (current_role_is('admin'));
create policy "kb_authenticated_select" on knowledge_base for select
  using (auth.uid() is not null);
create policy "kb_admin_write" on knowledge_base for all
  using (current_role_is('admin')) with check (current_role_is('admin'));

-- emr_mock: chỉ doctor/admin đọc
create policy "emr_staff_select" on emr_mock for select
  using (current_role_is('doctor') or current_role_is('admin'));

-- ============================================================
-- SEED DATA
-- ============================================================

-- app_config defaults (bao gồm medical disclaimer US-065)
insert into app_config (key, value) values
  ('business_hours', '{"open":"08:00","close":"20:00","timezone":"Asia/Ho_Chi_Minh"}'),
  ('hotline',        '{"number":"1900-xxxx"}'),
  ('disclaimer',     '{"version":"v1","text":"Thông tin chỉ mang tính tham khảo, không thay thế chẩn đoán trực tiếp của bác sĩ. Nếu có dấu hiệu nguy hiểm, hãy gọi 115."}'),
  ('fusion_weights', '{"skin":{"w_nlp":0.3,"w_cv":0.7},"respiratory":{"w_nlp":0.7,"w_cv":0.3},"igg":{"w_nlp":0.8,"w_cv":0.2},"general":{"w_nlp":0.6,"w_cv":0.4}}'),
  ('llm',            '{"temperature":0.4,"max_tokens":400}'),
  ('sla',            '{"warning_min":30,"breach_min":60}')
on conflict (key) do nothing;

-- emergency keywords (Sprint 2)
insert into emergency_keywords (keyword, variants) values
  ('co giật',        array['co giat','giật','giat']),
  ('tím tái',        array['tim tai','tím','tim']),
  ('khó thở',        array['kho tho','thở không được','tho khong duoc']),
  ('rút lõm ngực',   array['rut lom nguc']),
  ('bất tỉnh',       array['bat tinh','ngất xỉu','ngat xiu']),
  ('ngừng thở',      array['ngung tho'])
on conflict do nothing;

-- hospitals (mẫu TP.HCM) — Sprint 2
insert into hospitals (name, address, lat, lng, emergency_phone, priority) values
  ('Bệnh viện Nhi đồng 1', '341 Sư Vạn Hạnh, Q10, TP.HCM', 10.7715, 106.6680, '028-39271119', 1),
  ('Bệnh viện Nhi đồng 2', '14 Lý Tự Trọng, Q1, TP.HCM',    10.7820, 106.7000, '028-38295723', 2)
on conflict do nothing;

-- emr_mock (Sprint 3)
insert into emr_mock (vclinic_sid, full_name, dob, gender, medical_history, current_meds, last_visit, igg_results, primary_doctor)
values (
  'VCL-001', 'Nguyễn Minh An', '2021-03-15', 'male',
  '["Trào ngược dạ dày","Dị ứng đạm sữa bò"]'::jsonb,
  '["Men vi sinh"]'::jsonb,
  '{"date":"2026-04-10","diagnosis":"Viêm họng cấp"}'::jsonb,
  '[{"allergen":"Sữa bò","value_uml":120,"level":"red"},{"allergen":"Trứng","value_uml":65,"level":"yellow"},{"allergen":"Lúa mì","value_uml":30,"level":"green"}]'::jsonb,
  'BS. Trần Thị Hương'
) on conflict (vclinic_sid) do nothing;

-- knowledge_base seed (embedding = null, backfill ở Sprint 3) — US-028
insert into knowledge_base (question_sample, answer_reference, tags, source) values
  ('Bé bị sốt cao nên làm gì?', 'Hạ sốt bằng paracetamol theo cân nặng, lau mát, bù nước. Theo dõi sát, tái khám nếu sốt > 39°C kéo dài.', array['hô hấp','cấp cứu'], 'Cẩm nang KinderHealth'),
  ('Bé nổi mẩn đỏ khắp người', 'Có thể do dị ứng hoặc phát ban virus. Tránh gãi, giữ da sạch mát, theo dõi kèm sốt/khó thở.', array['da liễu','dị ứng'], 'Cẩm nang KinderHealth'),
  ('Bé bị tiêu chảy nhiều lần', 'Bù nước điện giải Oresol, ăn lỏng dễ tiêu. Tái khám nếu có dấu mất nước hoặc phân máu.', array['tiêu hóa'], 'Cẩm nang KinderHealth')
on conflict do nothing;

-- ============================================================
-- DONE
-- ============================================================
