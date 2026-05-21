# MediKid-AI — API Documentation Sprint 2

Base URL: `http://localhost:3000`

Authentication: Các endpoint có dấu 🔒 yêu cầu header:
```
Authorization: Bearer <access_token>
```

---

## 1. Cases

### POST `/api/cases` 🔒
Tạo case tư vấn mới (parent gửi triệu chứng lần đầu).

**Body**
```json
{
  "child_id": "uuid-hoặc-null",
  "anxiety_level": "calm",
  "workflow_type": "general"
}
```
> Tất cả fields đều optional. `status` mặc định là `pending`, `sla_state` là `ok`.

**Giá trị hợp lệ**
- `anxiety_level`: `calm | concerned | panic`
- `workflow_type`: `igg | respiratory | skin | general`

**Response 201**
```json
{
  "data": {
    "id": "uuid",
    "parent_id": "uuid-của-user",
    "child_id": null,
    "doctor_id": null,
    "status": "pending",
    "anxiety_level": "calm",
    "workflow_type": "general",
    "sla_state": "ok",
    "fusion_weights": null,
    "created_at": "2026-05-21T08:00:00.000Z",
    "approved_at": null
  }
}
```

---

### GET `/api/cases` 🔒
Lấy danh sách case.

**Query Params**
```
status=pending          (optional — lọc theo trạng thái)
role=doctor             (optional — nếu có, lấy tất cả cases; mặc định lấy theo parent_id)
```

**Response 200**
```json
{
  "data": [
    {
      "id": "uuid",
      "parent_id": "uuid",
      "status": "pending",
      "anxiety_level": "concerned",
      "workflow_type": "respiratory",
      "sla_state": "ok",
      "created_at": "2026-05-21T08:00:00.000Z"
    }
  ]
}
```

---

### PATCH `/api/cases/:id` 🔒
Doctor approve / reject / forward case.

**Path Params**
```
id = uuid của case
```

**Body**
```json
{
  "status": "approved",
  "doctor_id": "uuid-của-doctor"
}
```
> `doctor_id` optional. Khi `status=approved`, server tự set `approved_at`.

**Giá trị hợp lệ cho `status`**: `pending | approved | rejected | forwarded | emergency`

**Response 200**
```json
{
  "data": {
    "id": "uuid",
    "status": "approved",
    "doctor_id": "uuid-của-doctor",
    "approved_at": "2026-05-21T09:00:00.000Z"
  }
}
```

**Response 400**
```json
{
  "error": "status must be one of: pending, approved, rejected, forwarded, emergency"
}
```

---

## 2. Messages

### POST `/api/messages` 🔒
Gửi tin nhắn vào một case.

**Body**
```json
{
  "case_id": "uuid",
  "sender": "parent",
  "raw_text": "Bé bị sốt 3 ngày",
  "normalized_text": "be bi sot 3 ngay",
  "image_urls": [],
  "is_approved": false,
  "disclaimer_version": null
}
```
> Bắt buộc: `case_id`, `sender`, `raw_text`. Còn lại optional.

**Giá trị hợp lệ cho `sender`**: `parent | doctor | system`

**Response 201**
```json
{
  "data": {
    "id": "uuid",
    "case_id": "uuid",
    "sender": "parent",
    "raw_text": "Bé bị sốt 3 ngày",
    "normalized_text": "be bi sot 3 ngay",
    "image_urls": [],
    "is_approved": false,
    "disclaimer_version": null,
    "cv_metadata": null,
    "created_at": "2026-05-21T08:00:00.000Z"
  }
}
```

---

### GET `/api/messages?case_id=<uuid>` 🔒
Lấy toàn bộ tin nhắn của một case, sắp xếp theo thời gian.

**Query Params**
```
case_id=uuid-của-case
```

**Response 200**
```json
{
  "data": [
    {
      "id": "uuid",
      "case_id": "uuid",
      "sender": "parent",
      "raw_text": "Bé bị sốt 3 ngày",
      "is_approved": false,
      "created_at": "2026-05-21T08:00:00.000Z"
    },
    {
      "id": "uuid",
      "case_id": "uuid",
      "sender": "doctor",
      "raw_text": "Cho bé uống hạ sốt...",
      "is_approved": true,
      "disclaimer_version": "v1",
      "created_at": "2026-05-21T08:05:00.000Z"
    }
  ]
}
```

---

## 3. Drafts (AI Drafts)

### POST `/api/drafts` 🔒
Tạo draft phản hồi của bác sĩ cho một case.

**Body**
```json
{
  "case_id": "uuid",
  "doctor_edited": "Cho bé uống thuốc hạ sốt...",
  "ai_original": null,
  "rag_snippets": []
}
```
> Bắt buộc: `case_id`, `doctor_edited`.

**Response 201**
```json
{
  "data": {
    "id": "uuid",
    "case_id": "uuid",
    "doctor_edited": "Cho bé uống thuốc hạ sốt...",
    "ai_original": null,
    "rag_snippets": [],
    "token_diff": null,
    "created_at": "2026-05-21T08:05:00.000Z"
  }
}
```

---

### GET `/api/drafts?case_id=<uuid>` 🔒
Lấy draft mới nhất của một case.

**Query Params**
```
case_id=uuid-của-case
```

**Response 200**
```json
{
  "data": {
    "id": "uuid",
    "case_id": "uuid",
    "doctor_edited": "Cho bé uống thuốc hạ sốt...",
    "ai_original": null,
    "rag_snippets": [],
    "created_at": "2026-05-21T08:05:00.000Z"
  }
}
```

**Response 404**
```json
{
  "error": "Not found"
}
```

---

### PATCH `/api/drafts` 🔒
Cập nhật nội dung draft.

**Body**
```json
{
  "id": "uuid-của-draft",
  "doctor_edited": "Nội dung đã chỉnh sửa..."
}
```

**Response 200**
```json
{
  "data": {
    "id": "uuid",
    "case_id": "uuid",
    "doctor_edited": "Nội dung đã chỉnh sửa...",
    "created_at": "2026-05-21T08:05:00.000Z"
  }
}
```

---

## 4. Hospitals

### GET `/api/hospitals`
Lấy danh sách bệnh viện khẩn cấp. **Không cần auth.**

**Response 200**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Bệnh viện Nhi Đồng 1",
      "address": "341 Sư Vạn Hạnh, Q.10, TP.HCM",
      "lat": 10.7721,
      "lng": 106.6655,
      "emergency_phone": "028 3927 1119",
      "priority": 1
    }
  ]
}
```

---

## 5. Emergency Keywords

### GET `/api/emergency`
Lấy danh sách từ khóa khẩn cấp đang active. **Không cần auth.**

**Response 200**
```json
{
  "data": [
    {
      "keyword": "co giật",
      "variants": ["co giat", "giat kinh", "kinh giật"]
    },
    {
      "keyword": "khó thở",
      "variants": ["kho tho", "không thở được", "thở khó"]
    }
  ]
}
```

---

## Error Responses chung

| Status | Ý nghĩa |
|---|---|
| 400 | Bad request — thiếu field hoặc data không hợp lệ |
| 401 | Unauthorized — thiếu hoặc token không hợp lệ |
| 404 | Not found |
| 500 | Lỗi server / Supabase |

---

## Test Flow với Postman (Sprint 2)

```
Tiền đề: đã có access_token từ Sprint 1 verify flow

1. POST /api/cases          { anxiety_level: "concerned", workflow_type: "respiratory" }  + Bearer
2. GET  /api/cases          ?role=doctor                                                   + Bearer (doctor view)
3. POST /api/messages       { case_id, sender: "parent", raw_text: "Bé bị sốt" }          + Bearer
4. GET  /api/messages       ?case_id=...                                                   + Bearer
5. POST /api/drafts         { case_id, doctor_edited: "Cho bé uống..." }                  + Bearer
6. PATCH /api/cases/:id     { status: "approved", doctor_id: "..." }                      + Bearer
7. PATCH /api/drafts        { id: "...", doctor_edited: "Nội dung cập nhật" }             + Bearer
8. GET  /api/hospitals      (no auth)
9. GET  /api/emergency      (no auth)
```
