# MedKid Architecture

## Overview

MedKid hiện là ứng dụng Next.js dùng App Router, React, TypeScript và Tailwind CSS. Supabase đã có trong dependency, phù hợp cho auth, database và server-side integration khi cần.

## Current Stack

- Frontend/App: Next.js 16, React 19, TypeScript
- Styling: Tailwind CSS 4
- Data/Auth candidate: Supabase
- Tooling: ESLint, npm

## Source Layout

```text
src/app/       Next.js App Router routes, layout, global styles
src/types/     Shared TypeScript types
docs/          Product/architecture/plans/decisions
scripts/       Repeatable development commands
config/        Environment configuration templates
```

## Proposed Growth Structure

Khi dự án lớn hơn, có thể mở rộng theo hướng:

```text
src/components/ Shared UI components
src/features/   Feature modules by domain
src/lib/        Framework/client utilities
src/server/     Server-only logic, integrations, services
src/types/      Shared types
```

## Data Flow

Tạm thời cần cập nhật theo sản phẩm thực tế.

Luồng đề xuất:

1. User tương tác qua Next.js pages/components.
2. UI gọi server actions/route handlers hoặc Supabase client tuỳ use case.
3. Dữ liệu được validate trước khi lưu hoặc gửi sang AI/external service.
4. Kết quả được hiển thị với cảnh báo phù hợp, đặc biệt với nội dung y tế.

## Medical Safety Notes

- Không trình bày output AI như chẩn đoán chắc chắn.
- Nên có disclaimer: thông tin chỉ mang tính tham khảo, cần hỏi bác sĩ khi có triệu chứng nghiêm trọng.
- Không log hoặc expose dữ liệu sức khỏe cá nhân.

## Engineering Principles

- DRY: tránh copy-paste logic giữa các route/component.
- YAGNI: chỉ thêm abstraction khi có nhu cầu thật.
- Type-safe: ưu tiên TypeScript types rõ ràng.
- Small changes: mỗi feature nên có plan và task nhỏ.
