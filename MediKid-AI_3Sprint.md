# MediKid-AI — Kế Hoạch 3 Sprint

> **Chiến lược:** UI + Auth + Flow trước → AI sau cùng  
> **Tổng thời gian:** 6 tuần  
> **v2.1** — E2.3 Image Upload hạ xuống Simulated · E8.1 KB Admin CMS chuyển Post-MVP

---

## Tổng quan

| Sprint | Thời gian | Trọng tâm | Deliverable |
|---|---|---|---|
| Sprint 1 | Tuần 1–2 | Auth · Consent · Profile | Phụ huynh đăng ký và vào được app |
| Sprint 2 | Tuần 3–4 | Chat UI · Emergency · Doctor flow | Demo được toàn bộ UI không cần AI |
| Sprint 3 | Tuần 5–6 | AI Pipeline · RAG · LLM Draft | App chạy thật end-to-end |

---

## Sprint 1 — Foundation (Tuần 1–2)

**Mục tiêu:** Setup xong, phụ huynh và bác sĩ đăng nhập được, hồ sơ tạo được.

### Setup (ngày 1–2)
- Khởi tạo Next.js 14 + Supabase + shadcn/ui
- Schema DB: `user_profiles`, `children`, `cases`, `messages`, `ai_drafts`, `audit_log`
- Middleware routing guard theo role: `(parent)` / `(doctor)` / `(admin)`
- CI/CD → Vercel staging

### Auth & Consent
| Story | SP |
|---|---|
| US-001 Consent modal — bắt buộc trước khi dùng | 3 |
| US-002 Persist consent vào sessionStorage + audit log | 2 |
| US-007 Session UUID v4 | 2 |
| US-008 Đăng ký phụ huynh + OTP SMS | 5 |
| US-005 Auto-logout sau 4h idle | 3 |

### Profile
| Story | SP |
|---|---|
| US-009 Tạo hồ sơ bệnh nhi (1 con) | 3 |
| US-065 Medical disclaimer tự động | 2 |

**Tổng Sprint 1: ~20 SP**

**Deliverable:** Phụ huynh đăng ký → consent → tạo hồ sơ con → vào trang chat (chưa có gì). Bác sĩ login được → thấy queue trống.

---

## Sprint 2 — UI & Flow (Tuần 3–4)

**Mục tiêu:** Demo được toàn bộ luồng với mock data — không cần AI chạy thật.

### Chat UI (phụ huynh)
| Story | SP |
|---|---|
| US-010 Text input chat box | 2 |
| US-013 Typing indicator | 1 |
| US-014 Lịch sử hội thoại | 3 |
| US-015 🟡 Giả lập mic ASR | 3 |
| US-018 🟡 Giả lập camera ~~Priority 1~~ → **Simulated only** | 3 |
| US-012 🟡 Anxiety mock (keyword đơn giản) | 2 |

### Emergency
| Story | SP |
|---|---|
| US-034 Emergency keyword filter (< 50ms) | 3 |
| US-035 Emergency UI: hotline 115 + 5 BV nhi HCM | 3 |
| US-036 Bypass toàn bộ xử lý khi emergency | 2 |

### Doctor flow
| Story | SP |
|---|---|
| US-040 Pending queue + anxiety badge | 3 |
| US-041 Realtime push khi có ca mới | 3 |
| US-080 Notification bell + badge | 3 |
| US-043 Hiển thị draft (placeholder mock) | 2 |
| US-045 Inline edit draft (TipTap) | 5 |
| US-047 APPROVE → dispatch | 5 |
| US-048 REJECT + lý do | 2 |
| US-023 🟡 CV overlay ảnh mẫu | 3 |

**Tổng Sprint 2: ~49 SP**

**Deliverable:** Demo đầy đủ UI — phụ huynh gửi tin → bác sĩ thấy ngay trong queue → edit mock draft → approve → phụ huynh nhận. AI draft là text cứng, chưa real.

---

## Sprint 3 — AI Pipeline (Tuần 5–6)

**Mục tiêu:** Thay toàn bộ mock bằng AI thật. App chạy end-to-end.

### Data layer
| Story | SP |
|---|---|
| US-026 🟡 VCLINIC mock JSON | 2 |
| US-027 Inject EMR vào LLM context | 3 |
| US-028 RAG: pgvector + seed 50 knowledge chunks | 8 |

### AI core
| Story | SP |
|---|---|
| US-025 Fusion Layer `H_t = Φ(W_nlp·f + W_cv·g)` | 3 |
| US-052 LLM draft generation — Claude API streaming | 8 |
| US-022 🟡 CV mock bounding box | 3 |
| US-033 🟡 Debug console: session ID, RAG sources | 3 |

### Swap mock → real
- Thay mock draft (Sprint 2) bằng LLM response thật
- Thay CV mock bằng bounding box từ CV service (nếu kịp)
- Wire anxiety score vào badge doctor queue

**Tổng Sprint 3: ~32 SP**

**Deliverable:** Phụ huynh gõ triệu chứng → AI phân tích → Claude sinh draft → bác sĩ review/approve → phụ huynh nhận. App chạy thật.

---

## Tổng kết

| | Sprint 1 | Sprint 2 | Sprint 3 | Tổng |
|---|---|---|---|---|
| Story Points | ~20 SP | ~49 SP | ~32 SP | **~101 SP** |
| AI cần chạy? | ❌ Không | ❌ Không | ✅ Có | |
| Demo được? | Auth flow | Full UI flow | Full AI flow | |

### Post-MVP backlog
ASR thật · **Upload ảnh thật (E2.3 — Simulated trong MVP)** · CV microservice · NLP normalize · SMS notification · **Admin CMS E8.1 (19 SP — bỏ khỏi MVP)** · Reporting · Multi-child · Feedback fine-tune

### Thay đổi so với spreadsheet epics
| Epic | MVP Priority cũ | Điều chỉnh | Lý do |
|---|---|---|---|
| E2.3 Image Upload & Management | Priority 1 | **Priority 3 — Simulated only** | Spec gốc đã đánh dấu Simulated, tiết kiệm 12 SP |
| E8.1 Knowledge Base Admin CMS | Priority 5 | **Post-MVP** | 19 SP admin tooling không cần thiết để demo core loop |

---

*MediKid-AI · 3-Sprint Plan · 2026 · KinderHealth*
