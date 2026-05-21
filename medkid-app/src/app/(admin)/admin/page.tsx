import Link from 'next/link';
import { Activity, ArrowRight, Database, FileClock, LockKeyhole, ShieldCheck, UsersRound } from 'lucide-react';
import { RoleAppShell } from '@/components/shared/role-app-shell';

export default function AdminPage() {
  return (
    <RoleAppShell
      role="admin"
      title="MediKid-AI Admin"
      subtitle="Giám sát vận hành, audit và chất lượng nguồn tri thức"
    >
      <section className="flex flex-1 overflow-y-auto bg-slate-50 px-4 py-6 sm:px-6">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-teal-700">Operations Center</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                Bảng điều phối chất lượng y tế
              </h2>
              <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-600">
                Theo dõi phiên tư vấn, audit xử lý dữ liệu nhạy cảm, trạng thái đồng bộ VCLINIC
                và mức sẵn sàng nguồn tri thức RAG.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/parent" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-4 text-sm font-bold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50">
                Parent
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/doctor" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-teal-700 px-4 text-sm font-bold text-white hover:bg-teal-800">
                Doctor
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <AdminMetric icon={<UsersRound className="h-5 w-5" />} label="Phiên tư vấn hôm nay" value="42" detail="+12% so với hôm qua" />
            <AdminMetric icon={<ShieldCheck className="h-5 w-5" />} label="Consent hợp lệ" value="100%" detail="Không có phiên thiếu đồng ý" />
            <AdminMetric icon={<FileClock className="h-5 w-5" />} label="Audit events" value="318" detail="Đã ghi nhận theo session" />
            <AdminMetric icon={<Database className="h-5 w-5" />} label="RAG sources" value="24" detail="3 nguồn cần rà soát" />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900">Trạng thái tích hợp</h3>
                  <p className="mt-1 text-xs font-semibold text-slate-500">Các dịch vụ cần cho luồng tư vấn nhi khoa.</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-100">
                  Operational
                </span>
              </div>
              <div className="space-y-3">
                <StatusRow icon={<Activity className="h-4 w-4" />} name="Clinical triage pipeline" status="Online" note="P95 xử lý 1.8s" />
                <StatusRow icon={<Database className="h-4 w-4" />} name="VCLINIC EMR sync" status="Online" note="Lần đồng bộ gần nhất 2 phút trước" />
                <StatusRow icon={<LockKeyhole className="h-4 w-4" />} name="Sensitive data guard" status="Enforced" note="Ẩn dữ liệu khi debug" />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-black text-slate-900">Việc cần xử lý</h3>
              <div className="mt-4 space-y-3">
                <AdminTask title="Rà soát nguồn RAG dị ứng thực phẩm" meta="Ưu tiên cao · 3 tài liệu" />
                <AdminTask title="Kiểm tra ca quá SLA 45 phút" meta="1 ca đang cảnh báo" />
                <AdminTask title="Xuất audit theo phiên kiểm thử" meta="Sẵn sàng cho buổi trình bày sản phẩm" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </RoleAppShell>
  );
}

function AdminMetric({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
        {icon}
      </div>
      <p className="text-2xl font-black tracking-tight text-slate-950">{value}</p>
      <h3 className="mt-1 text-xs font-bold text-slate-600">{label}</h3>
      <p className="mt-2 text-xs font-medium leading-5 text-slate-500">{detail}</p>
    </div>
  );
}

function StatusRow({ icon, name, status, note }: { icon: React.ReactNode; name: string; status: string; note: string }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-teal-700 ring-1 ring-slate-200">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-800">{name}</p>
          <p className="truncate text-xs font-medium text-slate-500">{note}</p>
        </div>
      </div>
      <span className="w-fit shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-100">
        {status}
      </span>
    </div>
  );
}

function AdminTask({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-3">
      <p className="text-sm font-bold text-slate-800">{title}</p>
      <p className="mt-1 text-xs font-medium text-slate-500">{meta}</p>
    </div>
  );
}
