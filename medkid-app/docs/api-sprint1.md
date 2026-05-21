# MediKid-AI — API Documentation Sprint 1

Base URL: `http://localhost:3000`

Authentication: Các endpoint có dấu 🔒 yêu cầu header:
```
Authorization: Bearer <access_token>
```

---

## 1. Auth

### POST `/api/auth/otp`
Gửi mã OTP SMS đến số điện thoại phụ huynh.

**Headers**
```
Content-Type: application/json
```

**Body**
```json
{
  "phone": "+84901234567"
}
```

**Response 200**
```json
{
  "data": {
    "message": "OTP sent"
  }
}
```

**Response 400**
```json
{
  "error": "phone is required"
}
```

---

### POST `/api/auth/verify`
Xác thực OTP → trả về access token để dùng cho các endpoint tiếp theo.

**Headers**
```
Content-Type: application/json
```

**Body**
```json
{
  "phone": "+84901234567",
  "token": "123456"
}
```

**Response 200**
```json
{
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "v1.abc123...",
    "user": {
      "id": "uuid-của-user",
      "phone": "+84901234567"
    }
  }
}
```

**Response 400**
```json
{
  "error": "Token has expired or is invalid"
}
```

---

## 2. Profile

### GET `/api/profile` 🔒
Lấy thông tin profile và role của user hiện tại.

**Headers**
```
Authorization: Bearer <access_token>
```

**Response 200**
```json
{
  "data": {
    "id": "uuid-của-user",
    "role": "parent",
    "full_name": "Nguyễn Văn Nam",
    "phone": "+84901234567",
    "created_at": "2026-05-21T08:00:00.000Z"
  }
}
```

---

### PATCH `/api/profile` 🔒
Cập nhật tên hoặc số điện thoại.

**Headers**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Body** (tất cả fields đều optional, ít nhất 1 field)
```json
{
  "full_name": "Nguyễn Văn Nam",
  "phone": "+84901234567"
}
```

**Response 200**
```json
{
  "data": {
    "id": "uuid-của-user",
    "role": "parent",
    "full_name": "Nguyễn Văn Nam",
    "phone": "+84901234567",
    "created_at": "2026-05-21T08:00:00.000Z"
  }
}
```

**Response 400**
```json
{
  "error": "No fields to update"
}
```

---

## 3. Consents

### POST `/api/consents`
Lưu đồng thuận xử lý dữ liệu theo Nghị định 13/2023/NĐ-CP.
Đồng thời ghi audit log `CONSENT_GRANTED`.
Auth optional — nếu có token thì gắn `parent_id`.

**Headers**
```
Content-Type: application/json
Authorization: Bearer <access_token>   (optional)
```

**Body**
```json
{
  "session_uuid": "550e8400-e29b-41d4-a716-446655440000"
}
```
> Nếu không truyền `session_uuid`, server tự tạo UUID v4.

**Response 201**
```json
{
  "data": {
    "id": "uuid",
    "parent_id": "uuid-của-user-hoặc-null",
    "session_uuid": "550e8400-e29b-41d4-a716-446655440000",
    "granted_at": "2026-05-21T08:00:00.000Z",
    "revoked_at": null
  }
}
```

---

### GET `/api/consents?session_uuid=<uuid>`
Kiểm tra session đã đồng thuận chưa.

**Query Params**
```
session_uuid=550e8400-e29b-41d4-a716-446655440000
```

**Response 200 — đã consent**
```json
{
  "data": {
    "consented": true,
    "consent": {
      "id": "uuid",
      "granted_at": "2026-05-21T08:00:00.000Z"
    }
  }
}
```

**Response 200 — chưa consent**
```json
{
  "data": {
    "consented": false,
    "consent": null
  }
}
```

---

## 4. Children

### POST `/api/children` 🔒
Tạo hồ sơ bệnh nhi cho phụ huynh hiện tại.

**Headers**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Body**
```json
{
  "full_name": "Nguyễn Bảo An",
  "dob": "2022-03-15",
  "gender": "male",
  "weight_kg": 12.5,
  "vclinic_sid": "VCL-001"
}
```
> Chỉ `full_name` là bắt buộc. Các field còn lại optional.

**Response 201**
```json
{
  "data": {
    "id": "uuid",
    "parent_id": "uuid-của-user",
    "full_name": "Nguyễn Bảo An",
    "dob": "2022-03-15",
    "gender": "male",
    "weight_kg": 12.5,
    "vclinic_sid": "VCL-001",
    "avatar_color": "#4A90D9",
    "created_at": "2026-05-21T08:00:00.000Z"
  }
}
```

**Response 400**
```json
{
  "error": "full_name is required"
}
```

---

### GET `/api/children` 🔒
Lấy danh sách bệnh nhi của phụ huynh hiện tại.

**Headers**
```
Authorization: Bearer <access_token>
```

**Response 200**
```json
{
  "data": [
    {
      "id": "uuid",
      "parent_id": "uuid-của-user",
      "full_name": "Nguyễn Bảo An",
      "dob": "2022-03-15",
      "gender": "male",
      "weight_kg": 12.5,
      "vclinic_sid": "VCL-001",
      "avatar_color": "#4A90D9",
      "created_at": "2026-05-21T08:00:00.000Z"
    }
  ]
}
```

---

## 5. Audit

### POST `/api/audit`
Ghi audit log thủ công. Auth optional.

**Headers**
```
Content-Type: application/json
Authorization: Bearer <access_token>   (optional)
```

**Body**
```json
{
  "event_type": "SESSION_START",
  "session_uuid": "550e8400-e29b-41d4-a716-446655440000",
  "case_id": null,
  "payload": {
    "source": "web"
  }
}
```

**Giá trị hợp lệ cho `event_type`**
```
CONSENT_GRANTED | SESSION_START | SESSION_EXPIRED |
MESSAGE_SENT | DRAFT_GENERATED | APPROVED |
REJECTED | FORWARDED | DATA_DELETED | EMERGENCY_BYPASS
```

**Response 201**
```json
{
  "data": {
    "id": "uuid",
    "event_type": "SESSION_START",
    "actor_id": "uuid-của-user-hoặc-null",
    "case_id": null,
    "session_uuid": "550e8400-e29b-41d4-a716-446655440000",
    "payload": { "source": "web" },
    "created_at": "2026-05-21T08:00:00.000Z"
  }
}
```

**Response 400**
```json
{
  "error": "event_type and session_uuid are required"
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

## Test Flow với Postman

```
1. POST /api/auth/otp        { phone }
2. POST /api/auth/verify     { phone, token }  → lấy access_token
3. POST /api/consents        { session_uuid }   + Bearer token
4. GET  /api/consents        ?session_uuid=...
5. PATCH /api/profile        { full_name }      + Bearer token
6. POST /api/children        { full_name, ... } + Bearer token
7. GET  /api/children                           + Bearer token
```
