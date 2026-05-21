import type {
  EMRRecord,
  MedCase,
  RAGSnippet,
  Doctor,
  Parent,
  AuditLog,
} from '@/types';

// ─── Mock Doctors ─────────────────────────────────────────────────────────────

export const MOCK_DOCTORS: Doctor[] = [
  { id: 'dr-001', name: 'BS. Nguyễn Thị Lan', specialty: 'Nhi khoa tổng quát', online: true },
  { id: 'dr-002', name: 'BS. Trần Minh Khoa', specialty: 'Da liễu nhi', online: true },
  { id: 'dr-003', name: 'BS. Lê Thị Hoa', specialty: 'Hô hấp nhi', online: false },
];

// ─── Mock Parent ──────────────────────────────────────────────────────────────

export const MOCK_PARENT: Parent = {
  id: 'parent-001',
  full_name: 'Nguyễn Văn Nam',
  phone: '0901234567',
  email: 'nguyen.nam@gmail.com',
  active_child_id: 'child-001',
  children: [
    {
      id: 'child-001',
      name: 'Nguyễn Bảo Anh',
      dob: '2022-03-15',
      gender: 'female',
      weight_kg: 12.5,
      vclinic_id: 'VC-2024-0815',
      avatar_color: '#FF6B6B',
    },
    {
      id: 'child-002',
      name: 'Nguyễn Minh Tú',
      dob: '2020-08-22',
      gender: 'male',
      weight_kg: 18.0,
      vclinic_id: 'VC-2023-0422',
      avatar_color: '#4ECDC4',
    },
  ],
};

// ─── Mock EMR ─────────────────────────────────────────────────────────────────

export const MOCK_EMR: Record<string, EMRRecord> = {
  'VC-2024-0815': {
    patient_id: 'child-001',
    sid: 'VC-2024-0815',
    full_name: 'Nguyễn Bảo Anh',
    dob: '2022-03-15',
    gender: 'female',
    age_months: 38,
    weight_kg: 12.5,
    medical_history: ['Trào ngược dạ dày', 'Dị ứng sữa bò'],
    current_medications: ['Omeprazole 5mg', 'Probiotics'],
    last_visit_date: '2026-04-10',
    last_diagnosis: 'Viêm da dị ứng nhẹ',
    attending_doctor: 'BS. Nguyễn Thị Lan',
    igg_data: [
      { allergen: 'Sữa bò', value: 145, level: 'high' },
      { allergen: 'Trứng', value: 78, level: 'medium' },
      { allergen: 'Đậu phộng', value: 32, level: 'low' },
      { allergen: 'Lúa mì', value: 55, level: 'medium' },
      { allergen: 'Cá hồi', value: 15, level: 'low' },
    ],
    last_synced: new Date().toISOString(),
  },
};

// ─── Mock RAG Snippets ────────────────────────────────────────────────────────

export const MOCK_RAG_SNIPPETS: RAGSnippet[] = [
  {
    id: 'rag-001',
    title: 'Viêm da dị ứng ở trẻ dưới 3 tuổi',
    content:
      'Viêm da dị ứng (eczema) thường xuất hiện ở trẻ dưới 3 tuổi với biểu hiện da đỏ, ngứa, khô. Điều trị bao gồm dưỡng ẩm thường xuyên và tránh tác nhân gây dị ứng.',
    similarity: 0.87,
    source: 'Cẩm nang Nhi khoa KinderHealth 2025, tr.142',
  },
  {
    id: 'rag-002',
    title: 'Phân biệt phát ban do dị ứng thực phẩm và nhiễm virus',
    content:
      'Phát ban do dị ứng thực phẩm thường xuất hiện 15–30 phút sau khi ăn, kèm ngứa. Phát ban do virus thường có sốt kèm và xuất hiện sau 2–3 ngày bệnh.',
    similarity: 0.82,
    source: 'Protocol Dị ứng Nhi KinderHealth, v2.1',
  },
  {
    id: 'rag-003',
    title: 'Điều trị ngứa cấp tính ở trẻ',
    content:
      'Khi trẻ ngứa cấp tính, có thể dùng khăn lạnh chườm nhẹ vùng bị ảnh hưởng. Tránh để trẻ gãi. Nếu ngứa nặng, cần thăm khám để được chỉ định thuốc kháng histamine phù hợp.',
    similarity: 0.75,
    source: 'Hướng dẫn xử trí dị ứng cấp, KinderHealth 2025',
  },
];

// ─── Mock AI Draft ─────────────────────────────────────────────────────────────

export const MOCK_AI_DRAFT = `Chào anh/chị,

Qua mô tả của anh/chị, bé Bảo Anh đang có biểu hiện **nổi mẩn đỏ và ngứa** vùng cánh tay. Với tiền sử dị ứng sữa bò và kết quả IgG cao (145 U/mL), cần lưu ý đến khả năng phản ứng dị ứng.

**Khuyến nghị tạm thời:**
- Tránh để bé gãi vùng bị ảnh hưởng
- Chườm khăn lạnh nhẹ để giảm ngứa
- Ghi lại những gì bé đã ăn trong 2 giờ qua
- Kiểm tra xem bé có tiếp xúc với chất tẩy rửa mới không

**Dấu hiệu cần đưa bé đến khám ngay:** khó thở, môi/lưỡi sưng, phát ban lan rộng nhanh.

Bé đã khám viêm da dị ứng ngày 10/04 vừa rồi, anh/chị có thể mang theo hồ sơ để bác sĩ tham chiếu.

Mời anh/chị tái khám hoặc ghi lại nhật ký triệu chứng để theo dõi diễn tiến.`;

// ─── Mock Cases ──────────────────────────────────────────────────────────────

export const MOCK_CASES: MedCase[] = [
  {
    id: 'case-001',
    session_id: 'sess-abc-001',
    patient_id: 'child-001',
    patient_name: 'Nguyễn Bảo Anh',
    patient_age_months: 38,
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 min ago
    status: 'pending',
    anxiety_level: 'concerned',
    workflow_type: 'Skin_Lesion',
    has_images: true,
    symptom_keywords: ['phát ban', 'ngứa', 'cánh tay'],
    messages: [
      {
        id: 'msg-001',
        session_id: 'sess-abc-001',
        sender: 'parent',
        content:
          'Bé nhà em 3 tuổi bị nổi mẩn đỏ ở cánh tay từ sáng tới giờ, nhìn có vẻ ngứa lắm, bé cứ gãi hoài. Em có chụp ảnh lại rồi ạ.',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        images: ['/mock/sample-rash.jpg'],
      },
    ],
    ai_draft: MOCK_AI_DRAFT,
    emr: MOCK_EMR['VC-2024-0815'],
    rag_snippets: MOCK_RAG_SNIPPETS,
    cv_analysis: {
      bounding_box: { x: 120, y: 80, w: 200, h: 150 },
      area_cm2: 4.2,
      dominant_color: 'red',
      morphology: 'papule',
    },
  },
  {
    id: 'case-002',
    session_id: 'sess-abc-002',
    patient_id: 'child-003',
    patient_name: 'Phạm Quốc Huy',
    patient_age_months: 24,
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 min ago
    status: 'pending',
    anxiety_level: 'panic',
    workflow_type: 'Respiratory',
    has_images: false,
    symptom_keywords: ['ho', 'sốt', 'khò khè'],
    messages: [
      {
        id: 'msg-002',
        session_id: 'sess-abc-002',
        sender: 'parent',
        content:
          'Bé nhà tôi 2 tuổi sốt 38.5 từ tối qua, ho nhiều lắm, thở có tiếng khò khè. Tôi lo quá không biết có sao không.',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      },
    ],
    ai_draft:
      'Chào anh/chị, qua mô tả, bé đang có triệu chứng sốt kèm ho và khò khè. Đây có thể là dấu hiệu của viêm phế quản hoặc viêm tiểu phế quản...',
    rag_snippets: MOCK_RAG_SNIPPETS.slice(0, 2),
  },
  {
    id: 'case-003',
    session_id: 'sess-abc-003',
    patient_id: 'child-004',
    patient_name: 'Trần Thị Mai',
    patient_age_months: 60,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h ago
    status: 'approved',
    anxiety_level: 'calm',
    workflow_type: 'General',
    has_images: false,
    symptom_keywords: ['tiêu chảy', 'nôn'],
    messages: [],
    approved_at: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    doctor_id: 'dr-001',
  },
];

// ─── Mock Audit Logs ──────────────────────────────────────────────────────────

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit-001',
    event: 'CONSENT_GRANTED',
    session_id: 'sess-abc-001',
    timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
  },
  {
    id: 'audit-002',
    event: 'SESSION_START',
    session_id: 'sess-abc-001',
    timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
  },
  {
    id: 'audit-003',
    event: 'MESSAGE_SENT',
    session_id: 'sess-abc-001',
    case_id: 'case-001',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 'audit-004',
    event: 'DRAFT_GENERATED',
    session_id: 'sess-abc-001',
    case_id: 'case-001',
    timestamp: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
  },
];

// ─── Emergency Keywords ───────────────────────────────────────────────────────

export const EMERGENCY_KEYWORDS = [
  'co giật', 'co giat', 'giật', 'giat',
  'tím tái', 'tim tai', 'tím', 'tim',
  'khó thở', 'kho tho', 'thở không được', 'tho khong duoc',
  'rút lõm ngực', 'rut lom nguc',
  'bất tỉnh', 'bat tinh', 'ngất xỉu', 'ngat xiu',
  'ngừng thở', 'ngung tho',
  'không thở', 'khong tho',
];

// ─── Mock ASR Sample Texts ────────────────────────────────────────────────────

export const MOCK_ASR_SAMPLES = [
  'Bé nhà em bị sốt từ tối qua, nhiệt độ 38.5 độ, ho nhiều và có vẻ mệt mỏi. Em lo không biết có cần đi khám không ạ.',
  'Con em 3 tuổi nổi mẩn đỏ ở cổ và ngực từ sáng sớm, không sốt nhưng bé cứ gãi hoài. Trước đây bé bị dị ứng sữa bò.',
  'Bé nhà tôi đi ngoài 5 lần từ sáng tới giờ, phân lỏng có nhầy, bé kêu đau bụng.',
];
