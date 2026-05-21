'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Activity, Bug, Stethoscope } from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import { DebugConsole } from '@/components/shared/debug-console';
import { cn } from '@/lib/utils';

type RoleAppShellProps = {
  role: 'parent' | 'doctor' | 'admin';
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

const ROLE_LABELS: Record<RoleAppShellProps['role'], string> = {
  parent: 'Phụ huynh',
  doctor: 'Bác sĩ',
  admin: 'Admin',
};

export function RoleAppShell({ role, title, subtitle, children }: RoleAppShellProps) {
  const showDebugConsole = useAppStore((s) => s.showDebugConsole);
  const toggleDebugConsole = useAppStore((s) => s.toggleDebugConsole);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        toggleDebugConsole();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggleDebugConsole]);

  return (
    <main className={cn('flex min-h-dvh flex-col bg-slate-100', showDebugConsole && 'pb-52')}>
      <header className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 ring-1 ring-teal-100 transition-colors hover:bg-teal-100"
            aria-label="Về màn chọn vai trò"
          >
            <Stethoscope className="h-5 w-5" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-sm font-black text-slate-900 sm:text-base">{title}</h1>
              <span className="hidden rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-teal-700 ring-1 ring-teal-100 sm:inline-flex">
                {ROLE_LABELS[role]}
              </span>
            </div>
            <p className="truncate text-[11px] font-medium text-slate-500">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-1 rounded-xl bg-slate-100 p-1 text-xs font-bold text-slate-600 sm:flex">
            <RoleLink href="/parent" active={role === 'parent'} label="Phụ huynh" />
            <RoleLink href="/doctor" active={role === 'doctor'} label="Bác sĩ" />
            <RoleLink href="/admin" active={role === 'admin'} label="Admin" />
          </nav>
          <button
            onClick={toggleDebugConsole}
            className={cn(
              'inline-flex h-9 items-center gap-1.5 rounded-xl px-3 text-xs font-bold transition-colors',
              showDebugConsole
                ? 'bg-slate-900 text-emerald-300'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            )}
          >
            <Bug className="h-3.5 w-3.5" />
            Debug
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">{children}</div>
      <DebugConsole />
    </main>
  );
}

function RoleLink({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center gap-1 rounded-lg px-3 py-1.5 transition-colors',
        active ? 'bg-white text-teal-700 shadow-xs' : 'hover:bg-white/70'
      )}
    >
      {active && <Activity className="h-3 w-3" />}
      {label}
    </Link>
  );
}
