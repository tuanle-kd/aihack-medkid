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
      <section className="flex min-w-0 flex-1 bg-white">
        <aside className="w-80 shrink-0 overflow-y-auto border-r border-slate-200">
          <CaseQueue />
        </aside>
        <div className="min-w-0 flex-1 overflow-hidden">
          <CaseDetail />
        </div>
      </section>
    </RoleAppShell>
  );
}
