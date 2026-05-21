import { CaseDetail } from '@/components/doctor/case-detail';
import { CaseQueue } from '@/components/doctor/case-queue';
import { RoleAppShell } from '@/components/shared/role-app-shell';

export default function DoctorPage() {
  return (
    <RoleAppShell
      role="doctor"
      title="MediKid-AI Doctor"
      subtitle="Hàng đợi ca, hồ sơ VCLINIC và duyệt phản hồi trước khi gửi phụ huynh"
    >
      <section className="flex min-w-0 flex-1 flex-col bg-white lg:flex-row">
        <aside className="h-80 shrink-0 overflow-y-auto border-b border-slate-200 lg:h-auto lg:w-[22rem] lg:border-r lg:border-b-0">
          <CaseQueue />
        </aside>
        <div className="min-w-0 flex-1 overflow-hidden">
          <CaseDetail />
        </div>
      </section>
    </RoleAppShell>
  );
}
