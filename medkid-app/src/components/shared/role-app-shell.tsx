'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Activity, Bell, Bug, ChevronLeft, ShieldCheck, Stethoscope } from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import { DebugConsole } from '@/components/shared/debug-console';
import { IdleLogout } from '@/components/shared/idle-logout';
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
  const cases = useAppStore((s) => s.cases);
  const pendingCount = cases.filter((c) => c.status === 'pending').length;

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
    <main className={cn('flex min-h-dvh flex-col overflow-hidden bg-slate-100', showDebugConsole && 'pb-52')}>
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-700 text-white shadow-sm shadow-teal-700/20 transition-colors hover:bg-teal-800"
            aria-label="Về màn chọn vai trò"
          >
            <Stethoscope className="h-5 w-5" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-sm font-black text-slate-900 sm:text-base">{title}</h1>
              <span className="hidden rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-teal-700 ring-1 ring-teal-100 md:inline-flex">
                {ROLE_LABELS[role]}
              </span>
            </div>
            <p className="truncate text-[11px] font-medium text-slate-500">{subtitle}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <nav className="hidden items-center gap-1 rounded-xl bg-slate-100 p-1 text-xs font-bold text-slate-600 md:flex">
            <RoleLink href="/parent" active={role === 'parent'} label="Phụ huynh" />
            <RoleLink href="/doctor" active={role === 'doctor'} label="Bác sĩ" />
            <RoleLink href="/admin" active={role === 'admin'} label="Vận hành" />
          </nav>

          {/* Notification bell — doctor only */}
          {role === 'doctor' && (
            <div className="relative" title={`${pendingCount} ca đang chờ duyệt`}>
              <div className={cn(
                'flex h-10 w-10 items-center justify-center rounded-xl transition-colors',
                pendingCount > 0
                  ? 'bg-amber-50 text-amber-600 ring-1 ring-amber-200'
                  : 'bg-slate-100 text-slate-400'
              )}>
                <Bell className={cn('h-4 w-4', pendingCount > 0 && 'animate-[wiggle_1s_ease-in-out_infinite]')} />
              </div>
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white shadow-sm ring-1 ring-white">
                  {pendingCount > 9 ? '9+' : pendingCount}
                </span>
              )}
            </div>
          )}

          <button
            onClick={toggleDebugConsole}
            className={cn(
              'inline-flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-xs font-bold transition-colors',
              showDebugConsole
                ? 'bg-slate-900 text-emerald-300'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            )}
            aria-pressed={showDebugConsole}
            aria-label="Bật tắt bảng debug"
          >
            <Bug className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Debug</span>
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden">{children}</div>
      <nav className="grid grid-cols-3 border-t border-slate-200 bg-white px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 text-xs font-bold text-slate-600 shadow-[0_-8px_24px_rgba(15,23,42,0.06)] md:hidden">
        <MobileRoleLink href="/parent" active={role === 'parent'} label="Phụ huynh" />
        <MobileRoleLink href="/doctor" active={role === 'doctor'} label="Bác sĩ" />
        <MobileRoleLink href="/admin" active={role === 'admin'} label="Vận hành" />
      </nav>
      <DebugConsole />
      <IdleLogout />
    </main>
  );
}

function RoleLink({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex min-h-9 items-center gap-1 rounded-lg px-3 py-1.5 transition-colors',
        active ? 'bg-white text-teal-700 shadow-xs' : 'hover:bg-white/70'
      )}
    >
      {active ? <Activity className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3 rotate-180 opacity-40" />}
      {label}
    </Link>
  );
}

function MobileRoleLink({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={cn(
        'flex min-h-11 items-center justify-center gap-1 rounded-xl transition-colors',
        active ? 'bg-teal-50 text-teal-700' : 'text-slate-500'
      )}
    >
      {active ? <ShieldCheck className="h-3.5 w-3.5" /> : null}
      {label}
    </Link>
  );
}
