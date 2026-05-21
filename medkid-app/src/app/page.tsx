import Link from 'next/link';
import {
  ArrowRight,
  Bell,
  ClipboardCheck,
  Database,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-dvh bg-[radial-gradient(circle_at_top_left,_rgba(13,148,136,0.13),_transparent_30%),linear-gradient(180deg,_#f8fbfa_0%,_#eef5f3_100%)]">
      <section className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4 rounded-xl border border-white/70 bg-white/85 px-4 py-3 shadow-sm backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-700 text-white shadow-lg shadow-teal-700/15">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-teal-700">MediKid-AI</p>
              <p className="text-xs font-semibold text-slate-500">Clinical triage workspace</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            3 bác sĩ trực tuyến
          </div>
        </header>

        <div className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-3 py-1.5 text-xs font-bold text-teal-800 shadow-sm">
              <ShieldCheck className="h-3.5 w-3.5" />
              Quy trình có bác sĩ duyệt trước khi gửi phụ huynh
            </div>
            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              MediKid-AI
            </h1>
            <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-slate-600 sm:text-lg">
              Không gian vận hành tư vấn nhi khoa: phụ huynh gửi triệu chứng, hệ thống sàng lọc nguy cấp,
              bác sĩ duyệt phản hồi và admin theo dõi chất lượng dữ liệu.
            </p>

            <div className="mt-7 grid max-w-3xl gap-3 sm:grid-cols-3">
              <Metric icon={<Bell className="h-4 w-4" />} label="Ca chờ duyệt" value="2" tone="amber" />
              <Metric icon={<ClipboardCheck className="h-4 w-4" />} label="Đã xử lý hôm nay" value="18" tone="teal" />
              <Metric icon={<Database className="h-4 w-4" />} label="Nguồn RAG" value="24" tone="slate" />
            </div>
          </div>

          <div className="grid gap-4">
            <RoleCard
              href="/parent"
              icon={<UserRound className="h-5 w-5" />}
              label="Phụ huynh"
              title="Theo dõi hồ sơ bé"
              description="Gửi triệu chứng, ảnh lâm sàng và nhận phản hồi đã ký duyệt."
              meta="Có consent và hồ sơ bệnh nhi"
            />
            <RoleCard
              href="/doctor"
              icon={<HeartPulse className="h-5 w-5" />}
              label="Bác sĩ"
              title="Duyệt ca lâm sàng"
              description="Ưu tiên hàng đợi, xem VCLINIC, hiệu chỉnh nháp AI và ký duyệt."
              meta="2 ca đang chờ"
              featured
            />
            <RoleCard
              href="/admin"
              icon={<ShieldCheck className="h-5 w-5" />}
              label="Vận hành"
              title="Kiểm soát chất lượng"
              description="Theo dõi audit, nguồn tri thức, trạng thái tích hợp và bảo mật dữ liệu."
              meta="Hệ thống ổn định"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function RoleCard({
  href,
  icon,
  label,
  title,
  description,
  meta,
  featured,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  title: string;
  description: string;
  meta: string;
  featured?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group rounded-xl border bg-white/90 p-5 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-teal-900/10 ${
        featured ? 'border-teal-300 ring-4 ring-teal-100/70' : 'border-white/80 hover:border-teal-200'
      }`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
          {icon}
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-slate-600">
          {label}
        </span>
      </div>
      <h2 className="text-lg font-black text-slate-950">{title}</h2>
      <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{description}</p>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <span className="text-xs font-bold text-slate-500">{meta}</span>
        <span className="inline-flex items-center gap-1.5 text-xs font-black text-teal-700">
          Mở không gian
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

function Metric({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: 'amber' | 'teal' | 'slate';
}) {
  const toneClass = {
    amber: 'bg-amber-50 text-amber-700 ring-amber-100',
    teal: 'bg-teal-50 text-teal-700 ring-teal-100',
    slate: 'bg-slate-100 text-slate-700 ring-slate-200',
  }[tone];

  return (
    <div className="rounded-xl border border-white/75 bg-white/80 p-4 shadow-sm backdrop-blur">
      <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ring-1 ${toneClass}`}>
        {icon}
      </div>
      <p className="text-2xl font-black tracking-tight text-slate-950">{value}</p>
      <p className="mt-1 text-xs font-bold text-slate-500">{label}</p>
    </div>
  );
}
