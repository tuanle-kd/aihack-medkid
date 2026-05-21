import Link from 'next/link';
import { Database, FileClock, ShieldCheck } from 'lucide-react';
import { RoleAppShell } from '@/components/shared/role-app-shell';

export default function AdminPage() {
  return (
    <RoleAppShell
      role="admin"
      title="MediKid-AI Admin"
      subtitle="Không gian vận hành và kiểm soát demo MVP"
    >
      <section className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-teal-700">Post-MVP</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
              Admin route đã được tách riêng
            </h2>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-600">
              Sprint plan đã đẩy Knowledge Base Admin CMS ra Post-MVP. Màn này giữ vai trò
              route vận hành để sau này gắn audit log, cấu hình tri thức và quản lý người dùng.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <AdminTile icon={<ShieldCheck className="h-5 w-5" />} title="Role guard" text="Chưa bật middleware thật." />
            <AdminTile icon={<FileClock className="h-5 w-5" />} title="Audit log" text="Mock audit đang nằm trong memory." />
            <AdminTile icon={<Database className="h-5 w-5" />} title="Knowledge base" text="CMS tri thức thuộc Post-MVP." />
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="/parent" className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-bold text-white hover:bg-teal-800">
              Mở Parent
            </Link>
            <Link href="/doctor" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800">
              Mở Doctor
            </Link>
          </div>
        </div>
      </section>
    </RoleAppShell>
  );
}

function AdminTile({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
        {icon}
      </div>
      <h3 className="text-sm font-black text-slate-900">{title}</h3>
      <p className="mt-1 text-xs font-medium leading-5 text-slate-500">{text}</p>
    </div>
  );
}
