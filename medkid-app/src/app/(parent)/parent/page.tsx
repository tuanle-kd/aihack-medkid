'use client';

import { ChatPanel } from '@/components/parent/chat-panel';
import { ConsentModal } from '@/components/shared/consent-modal';
import { OnboardingWizard } from '@/components/parent/onboarding-wizard';
import { RoleAppShell } from '@/components/shared/role-app-shell';
import { useAppStore } from '@/store/app-store';

export default function ParentPage() {
  const isConsented = useAppStore((s) => s.isConsented);
  const isOnboarded = useAppStore((s) => s.isOnboarded);

  return (
    <RoleAppShell
      role="parent"
      title="MediKid-AI Parent"
      subtitle="Kênh phụ huynh mô tả triệu chứng và nhận phản hồi đã duyệt"
    >
      <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col border-x border-slate-200 bg-white shadow-sm">
        <ChatPanel />
      </section>
      {!isOnboarded && <OnboardingWizard />}
      {isOnboarded && !isConsented && <ConsentModal />}
    </RoleAppShell>
  );
}
