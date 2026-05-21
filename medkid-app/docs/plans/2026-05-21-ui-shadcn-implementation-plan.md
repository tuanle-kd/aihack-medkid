# Kế Hoạch Triển Khai: Nâng Cấp Giao Diện MediKid-AI Sử Dụng Shadcn UI & Tailwind CSS v4

Kế hoạch chi tiết để tái cấu trúc và phát triển giao diện người dùng (UI) dựa trên hệ thống thiết kế **Stitch Design System** và **KinderHealth Brand System** qua 3 Sprint. UI mới sẽ áp dụng phong cách **Clinical Warmth** (Kết hợp sự chuyên nghiệp y khoa và sự ấm áp gần gũi với trẻ nhỏ) bằng cách kết hợp **Shadcn UI (Radix Primitives)** và **Tailwind CSS v4**.

---

## 🎨 Kiến trúc Thiết kế (Aesthetic Point-of-View)

Chúng ta cam kết một phong cách thiết kế đặc trưng mang tính đột phá cho các sản phẩm y tế nhi khoa: **"Clinical Warmth with Glassmorphism"**.
*   **Tone chủ đạo:** Tin cậy nhưng không lạnh lẽo. Tránh tông màu xanh dương bệnh viện truyền thống khô khan.
*   **Hệ màu thương hiệu Stitch:**
    *   `Primary (Medical Teal):` HSL `171, 85%, 29%` (`#0D9488` - Tông mòng két y tế mang lại sự thanh thản, sạch sẽ).
    *   `Brand Accents (KinderHealth Green):` HSL `142, 70%, 45%` (`#10B981` - Màu lá non thể hiện sự phát triển và sức sống của trẻ em).
    *   `Emergency Red (Clinical Danger):` HSL `6, 78%, 46%` (`#C0392B` - Màu đỏ cảnh báo mạnh mẽ nhưng dễ chịu cho mắt).
*   **Typography:** Sử dụng font chữ **Cabinet Grotesk** cho các tiêu đề (Display) tạo cảm giác hình học hiện đại, thân thiện, kết hợp với **Plus Jakarta Sans** cho phần nội dung (Body text) giúp đọc thông tin y khoa cực kỳ dễ dàng.
*   **Micro-interactions & Depth:** Tích hợp Glassmorphism (backdrop blur, border viền mờ), hiệu ứng đổ bóng đa tầng (layered shadows), và các hiệu ứng chuyển động mượt mà (spring animations) cho các bong bóng chat, nhịp đập trạng thái khẩn cấp (pulse state) của ca bệnh.

---

## ⚠️ User Review Required

> [!IMPORTANT]
> **Tương thích React 19 & Next.js 16:**
> Các thư viện UI Radix hiện tại của Shadcn UI cần được cài đặt với tùy chọn `--legacy-peer-deps` để tránh xung đột dependency với React 19. Chúng ta sẽ cấu hình trực tiếp các Primitives để đảm bảo hoạt động hoàn hảo.

> [!WARNING]
> **Tailwind CSS v4 & @theme:**
> Phiên bản Tailwind CSS v4 loại bỏ `tailwind.config.js`. Do đó, tất cả các định nghĩa biến màu Shadcn UI (`--primary`, `--accent`, `--border`, `--ring`, v.v.) sẽ được khai báo trực tiếp trong `src/app/globals.css` thông qua `@theme inline`. Điều này giúp đảm bảo hiệu năng và cấu trúc chuẩn hóa cho Next.js 16.

---

## ❓ Câu Hỏi Thảo Luận (Open Questions)

> [!TIP]
> **Q1: Về cơ chế Rich Text Editor cho Bác sĩ:**
> Bác sĩ sẽ có trình soạn thảo nháp (AI Draft Editor). Chúng tôi đề xuất tích hợp **TipTap Editor** được custom style sang giao diện tối giản của Stitch thay vì một ô `<textarea>` thô sơ. Bạn có đồng ý cài thêm `tiptap` hoặc `@tiptap/react` không?
>
> **Q2: Cơ chế so sánh AI Draft và Bác sĩ chỉnh sửa (Visual Diff):**
> Giao diện Stitch `US-054` yêu cầu hiển thị chi tiết so sánh ký tự bị xóa (đỏ gạch ngang) và từ được thêm mới (xanh lá gạch chân) giữa bản AI Draft gốc và bản Bác sĩ ký số. Chúng tôi sẽ viết một helper Diff siêu nhẹ (sử dụng thư viện `diff` hoặc logic custom) để render visual diff này trực quan. Bạn có ưu tiên giải pháp nào không?

---

## 📅 Lộ Trình Phát Triển 3 Sprint

### 🚀 SPRINT 1: Nền Tảng Theme, Pháp Lý & Đồng Ý Y Khoa (Tuần 1-2)
*   **Mục tiêu:** Cài đặt các primitives Shadcn UI, thiết lập hệ thống biến màu Tailwind CSS v4, tái cấu trúc Consent Modal theo chuẩn bảo mật Nghị định 13 và màn hình Thêm Hồ Sơ Trẻ Em.
*   **Thành phần UI phát triển:**
    *   Cấu hình `globals.css` với Tailwind CSS v4 `@theme`.
    *   `Button` (Shadcn Custom): Bo góc mềm (`rounded-2xl`), hiệu ứng scale nhỏ khi click.
    *   `Dialog` / `AlertDialog` (Radix Primitive): Dựng `ConsentModal` nổi, hỗ trợ cuộn mượt và khóa scroll màn hình sau.
    *   `Card` (Stitch Design): Có viền sáng 1px, đổ bóng mềm, nền mờ kính (`backdrop-blur`).
    *   `Form` & `Input` (Shadcn Style): Form nhập hồ sơ con (Add Child Profile) hỗ trợ Validation tự động, DatePicker tiếng Việt tùy biến.

### ⚡ SPRINT 2: UI Tư Vấn, Cảnh Báo Nguy Kịch & Hàng Đợi Bác Sĩ (Tuần 3-4)
*   **Mục tiêu:** Tạo trải nghiệm chat y khoa chân thực phía phụ huynh kết hợp hệ thống lọc cấp cứu bypass khẩn cấp và giao diện danh sách hàng đợi phân cấp cho bác sĩ.
*   **Thành phần UI phát triển:**
    *   `ScrollArea` (Shadcn): Cuộn tin nhắn mượt mà, tự động cuộn xuống khi có tin nhắn mới.
    *   `Badge` (Stitch Design): Phân loại mức độ lo âu của ca bệnh (`Calm` - Teal, `Concerned` - Orange, `Panic` - Red) với hiệu ứng phát sáng nhẹ.
    *   **Emergency Alert (Bypass Screen):** Overlay màu đỏ rực rỡ, sử dụng hoạt ảnh nhấp nháy cảnh báo, cung cấp Hotline 115 động và danh sách bản đồ 5 bệnh viện nhi gần nhất.
    *   **Parent Chat Bubbles:** Bong bóng chat bo góc bất đối xứng (phụ huynh bo tròn bên phải, bác sĩ/hệ thống bên trái) tích hợp micro-interactions khi gửi, nút giả lập mic ghi âm tiếng Việt động.
    *   **Doctor Queue Card List:** Thiết kế thẻ ca bệnh với thanh tiến trình đo thời gian chờ y tế (SLA progress bar), cảnh báo đổi màu từ xanh lá ➡️ vàng ➡️ đỏ dựa trên mức khẩn cấp.

### 🧠 SPRINT 3: AI Pipeline, RAG Source & Trình Duyệt Thuốc Nháp (Tuần 5-6)
*   **Mục tiêu:** Hoàn thiện trải nghiệm đỉnh cao cho bác sĩ bao gồm so sánh sửa đổi văn bản, nguồn tài liệu tham chiếu RAG, và console debug kỹ thuật.
*   **Thành phần UI phát triển:**
    *   `Tabs` (Shadcn Custom): Chuyển đổi giữa EMR hồ sơ y khoa, AI Draft, và Lịch sử trò chuyện của ca bệnh.
    *   `Accordion` (Shadcn): Hiển thị danh sách nguồn RAG tham chiếu y khoa, click để expand xem nội dung chi tiết mà không làm vỡ giao diện.
    *   **Rich Text Editor & Diff Component:** Tích hợp bộ Editor cho AI Draft và khung hiển thị so sánh chỉnh sửa trực quan (Visual Diff).
    *   `Sheet` / `Drawer` (Shadcn): Console Debug dưới chân trang, cho phép kéo lên/xuống mượt mà, hiển thị log dạng JSON màu sắc sống động.

---

## 🛠️ Thay Đổi Cấu Trúc Đề Xuất (Proposed Code Changes)

### ⚙️ Component & Dependency Layer

#### [MODIFY] [package.json](file:///Users/nb230601/Documents/aihack-medkid/medkid-app/package.json)
*   Cài đặt các radix primitives cần thiết cho Shadcn UI:
    *   `@radix-ui/react-dialog`
    *   `@radix-ui/react-tabs`
    *   `@radix-ui/react-scroll-area`
    *   `@radix-ui/react-accordion`
    *   `@radix-ui/react-slot` (cho cấu hình Button `asChild`)
    *   `lucide-react` (đã có, sẽ tận dụng triệt để)

---

### 🎨 Styling System

#### [MODIFY] [globals.css](file:///Users/nb230601/Documents/aihack-medkid/medkid-app/src/app/globals.css)
*   Định nghĩa toàn bộ CSS Variables tương thích cấu trúc Shadcn UI và khai báo các token trong `@theme inline` của Tailwind CSS v4:

```css
@import "tailwindcss";

:root {
  --background: 170 20% 98%; /* Soft clinical warm white */
  --foreground: 170 10% 10%;
  
  --card: 0 0% 100%;
  --card-foreground: 170 10% 10%;
  
  --popover: 0 0% 100%;
  --popover-foreground: 170 10% 10%;
  
  --primary: 171 85% 29%; /* Stitch Medical Teal */
  --primary-foreground: 0 0% 100%;
  
  --secondary: 142 70% 45%; /* KinderGreen Accent */
  --secondary-foreground: 0 0% 100%;
  
  --destructive: 6 78% 46%; /* Emergency Red */
  --destructive-foreground: 0 0% 100%;
  
  --muted: 170 10% 90%;
  --muted-foreground: 170 5% 40%;
  
  --accent: 171 50% 92%;
  --accent-foreground: 171 85% 29%;
  
  --border: 170 10% 88%;
  --input: 170 10% 88%;
  --ring: 171 85% 29%;
  
  --radius: 1rem;
}

@theme inline {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));
  
  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);
  
  --font-display: 'Cabinet Grotesk', sans-serif;
  --font-body: 'Plus Jakarta Sans', sans-serif;
  
  --animate-pulse-slow: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  --animate-fade-in-up: fadeInUp 0.4s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

### 🧱 UI Components & Shared Layout

#### [NEW] [button.tsx](file:///Users/nb230601/Documents/aihack-medkid/medkid-app/src/components/ui/button.tsx)
*   Thành phần nút bấm chuẩn Shadcn, bo góc `rounded-2xl`, hiệu ứng spring active.

#### [NEW] [dialog.tsx](file:///Users/nb230601/Documents/aihack-medkid/medkid-app/src/components/ui/dialog.tsx)
*   Thành phần popup sử dụng `@radix-ui/react-dialog` được custom style mờ nền kính sang trọng.

#### [NEW] [tabs.tsx](file:///Users/nb230601/Documents/aihack-medkid/medkid-app/src/components/ui/tabs.tsx)
*   Thành phần tab của bác sĩ sử dụng `@radix-ui/react-tabs`, có thanh trượt highlight dưới chân hoạt ảnh trơn tru.

#### [NEW] [scroll-area.tsx](file:///Users/nb230601/Documents/aihack-medkid/medkid-app/src/components/ui/scroll-area.tsx)
*   Cuộn mượt mà có thanh cuộn tự ẩn phong cách Apple.

#### [NEW] [accordion.tsx](file:///Users/nb230601/Documents/aihack-medkid/medkid-app/src/components/ui/accordion.tsx)
*   Thư mục nguồn RAG mở rộng bằng chuyển động trượt xuống tự nhiên.

#### [NEW] [badge.tsx](file:///Users/nb230601/Documents/aihack-medkid/medkid-app/src/components/ui/badge.tsx)
*   Nhãn trạng thái ca bệnh và mức lo âu của phụ huynh.

---

### 🔄 Refactoring Existing Components

#### [MODIFY] [consent-modal.tsx](file:///Users/nb230601/Documents/aihack-medkid/medkid-app/src/components/shared/consent-modal.tsx)
*   Thay thế mã HTML modal tự viết thô sơ bằng `AlertDialog` chuẩn của Shadcn UI.
*   Cải tiến phần văn bản điều khoản Nghị định 13 rõ ràng, có phân đoạn, hỗ trợ cuộn và hiển thị nút đồng ý ở trạng thái nổi bật.

#### [MODIFY] [chat-panel.tsx](file:///Users/nb230601/Documents/aihack-medkid/medkid-app/src/components/parent/chat-panel.tsx)
*   Cải tiến bong bóng tin nhắn chat: bo góc bất đối xứng, bo tròn mềm mại.
*   Thêm micro-interactions cho typing indicator của AI/Doctor.
*   Thêm nút kích hoạt mic giả lập với vòng tròn sóng âm lan tỏa (ripple pulse animation) khi nhấn giữ.
*   Hiển thị preview ảnh phát ban/tổn thương dạng thumbnail nổi có nút xóa nhanh trước khi gửi.

#### [MODIFY] [case-queue.tsx](file:///Users/nb230601/Documents/aihack-medkid/medkid-app/src/components/doctor/case-queue.tsx)
*   Thiết kế lại card ca bệnh trong danh sách chờ:
    *   Anxiety level badge được đặt nổi bật, trạng thái `panic` có viền đỏ nhấp nháy phát sáng nhẹ.
    *   Bổ sung thanh SLA Timer hiển thị trực quan số phút chờ y tế còn lại kèm màu sắc cảnh báo động (Xanh ➡️ Vàng ➡️ Đỏ).
    *   Sử dụng hiệu ứng hover nổi nhẹ 3D và bóng đổ tương tác.

#### [MODIFY] [case-detail.tsx](file:///Users/nb230601/Documents/aihack-medkid/medkid-app/src/components/doctor/case-detail.tsx)
*   Áp dụng layout tabs hiện đại chuyển đổi cực nhanh.
*   Hiển thị hồ sơ y tế VCLINIC dạng bảng dữ liệu IgG trực quan.
*   Tích hợp trình chỉnh sửa AI Draft nâng cao và khối visual diff hiển thị chính xác những sửa đổi của bác sĩ để BGK đánh giá cao tính an sau y khoa.

#### [MODIFY] [debug-console.tsx](file:///Users/nb230601/Documents/aihack-medkid/medkid-app/src/components/shared/debug-console.tsx)
*   Chuyển đổi debug console dưới đáy màn hình thành một `Sheet` (Drawer) kéo vuốt lên mượt mà.
*   Lọc log thông minh theo tags (`system`, `ml`, `error`) và định dạng cấu trúc JSON rõ ràng, tăng tối đa điểm thuyết trình công nghệ.

---

## 🧪 Kế Hoạch Xác Minh & Kiểm Thử (Verification Plan)

### Kiểm Thử Tự Động (Automated Testing)
Do chúng ta có Playwright E2E đã cài đặt trong dự án, chúng ta sẽ chạy bộ test tự động để đảm bảo các tương tác chính không bị hỏng:
1.  **Lệnh chạy kiểm tra cú pháp và build:**
    ```bash
    npm run lint
    npm run build
    ```
2.  **Lệnh chạy E2E tests:**
    ```bash
    npm run test:e2e
    ```

### Xác Minh Thủ Công (Manual Verification)
1.  **Giao diện Consent (Sprint 1):** Reload trang, xác nhận modal hiển thị che phủ toàn bộ màn hình, kiểm tra nút "Đồng ý" kích hoạt lưu Session và tắt modal mượt mà.
2.  **Emergency Guardrail (Sprint 2):** Nhập cụm từ *"bé co giật"* trong phần Phụ huynh. Xác minh màn hình lập tức chuyển sang overlay màu đỏ nhấp nháy khẩn cấp, hiển thị số Hotline 115 và 5 bệnh viện nhi lớn tại TP.HCM.
3.  **Tác vụ Bác sĩ & Ký duyệt (Sprint 3):** Click chọn ca bệnh, sửa đổi bản nháp AI Draft, bấm "APPROVE & DISPATCH". Xác nhận tin nhắn đã chỉnh sửa xuất hiện lập tức ở giao diện Chat phụ huynh bên trái với chữ ký số của bác sĩ.
