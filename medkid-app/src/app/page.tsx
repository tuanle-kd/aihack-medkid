import Link from 'next/link';
import { ArrowRight, HeartPulse, ShieldCheck, Stethoscope, UserRound } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-dvh bg-slate-100">
      <section className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col justify-center px-4 py-8">
        <div className="mb-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-700 text-white shadow-lg shadow-teal-700/20">
            <Stethoscope className="h-6 w-6" />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-teal-700">MVP Role Routes</p>
          <h1 className="mt-2 max-w-2xl text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            MediKid-AI
          </h1>
          <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-600">
            Chọn đúng không gian làm việc. Phụ huynh, bác sĩ và admin hiện đã tách thành
            route riêng thay vì chung một split-screen.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <RoleCard
            href="/parent"
            icon={<UserRound className="h-5 w-5" />}
            label="Phụ huynh"
            title="Parent Chat"
            description="Consent, hồ sơ trẻ và chat mô tả triệu chứng."
          />
          <RoleCard
            href="/doctor"
            icon={<HeartPulse className="h-5 w-5" />}
            label="Bác sĩ"
            title="Doctor Queue"
            description="Hàng đợi ca, VCLINIC, draft và duyệt gửi."
          />
          <RoleCard
            href="/admin"
            icon={<ShieldCheck className="h-5 w-5" />}
            label="Admin"
            title="Admin Ops"
            description="Placeholder vận hành cho Post-MVP admin CMS."
          />
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
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-lg hover:shadow-teal-900/5"
    >
      <div className="mb-5 flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
          {icon}
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-slate-500">
          {label}
        </span>
      </div>
      <h2 className="text-base font-black text-slate-950">{title}</h2>
      <p className="mt-2 min-h-10 text-sm font-medium leading-5 text-slate-600">{description}</p>
      <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-black text-teal-700">
        Mở route
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
