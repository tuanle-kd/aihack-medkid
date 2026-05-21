'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { formatRelativeTime, ageLabel } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { MedCase, AnxietyLevel } from '@/types';
import { ArrowDownUp, Clock, Image as ImageIcon, CheckCircle, Hourglass, Activity } from 'lucide-react';

type FilterType = 'all' | 'panic' | 'has_images' | 'overdue';
type SortType = 'oldest' | 'newest' | 'panic_first';

const ANXIETY_CONFIG: Record<AnxietyLevel, { label: string; badgeVariant: 'calm' | 'concerned' | 'panic' }> = {
  calm: { label: 'Bình tĩnh', badgeVariant: 'calm' },
  concerned: { label: 'Lo lắng', badgeVariant: 'concerned' },
  panic: { label: 'Hoảng loạn', badgeVariant: 'panic' },
};

function waitMinutes(isoString: string, now: number | null) {
  if (!now) return 0;
  return Math.floor((now - new Date(isoString).getTime()) / 60000);
}

export function CaseQueue() {
  const cases = useAppStore((s) => s.cases);
  const selectedCaseId = useAppStore((s) => s.selectedCaseId);
  const selectCase = useAppStore((s) => s.selectCase);
  const [now, setNow] = useState<number | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('oldest');

  useEffect(() => {
    const initial = window.setTimeout(() => setNow(Date.now()), 0);
    const interval = window.setInterval(() => setNow(Date.now()), 60000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(interval);
    };
  }, []);

  const allPending = cases.filter((c) => c.status === 'pending');
  const approvedCases = cases.filter((c) => c.status !== 'pending');

  const filteredCases = allPending.filter((c) => {
    if (filter === 'panic') return c.anxiety_level === 'panic';
    if (filter === 'has_images') return c.has_images;
    if (filter === 'overdue') {
      if (!now) return false;
      return Math.floor((now - new Date(c.created_at).getTime()) / 60000) > 30;
    }
    return true;
  });

  const pendingCases = [...filteredCases].sort((a, b) => {
    if (sort === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sort === 'panic_first') {
      const order = { panic: 0, concerned: 1, calm: 2 };
      return order[a.anxiety_level] - order[b.anxiety_level];
    }
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  return (
    <div className="flex h-full flex-col border-r border-slate-200 bg-slate-50/30">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-1.5">
            <Activity className="h-4 w-4 text-teal-600 animate-pulse" />
            <h2 className="truncate text-sm font-bold tracking-tight text-slate-800">Hàng đợi duyệt lâm sàng</h2>
          </div>
          <span className="shrink-0 rounded-full bg-teal-600 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-xs">
            {allPending.length} Chờ Duyệt
          </span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <QueueStat label="SLA" value="45m" />
          <QueueStat label="Panic" value={String(cases.filter((c) => c.anxiety_level === 'panic' && c.status === 'pending').length)} />
          <QueueStat label="Ảnh" value={String(cases.filter((c) => c.has_images && c.status === 'pending').length)} />
        </div>

        {/* Filter chips */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {(['all', 'panic', 'has_images', 'overdue'] as FilterType[]).map((f) => {
            const labels: Record<FilterType, string> = { all: 'Tất cả', panic: 'Panic', has_images: 'Có ảnh', overdue: 'Chờ > 30p' };
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide transition-colors',
                  filter === f
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                )}
              >
                {labels[f]}
              </button>
            );
          })}
        </div>

        {/* Sort row */}
        <div className="mt-2 flex items-center gap-2">
          <ArrowDownUp className="h-3 w-3 shrink-0 text-slate-400" />
          <div className="flex flex-wrap gap-1">
            {([['oldest', 'Chờ lâu nhất'], ['newest', 'Mới nhất'], ['panic_first', 'Panic trước']] as [SortType, string][]).map(([s, label]) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={cn(
                  'rounded-md px-2 py-0.5 text-[10px] font-bold transition-colors',
                  sort === s ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-700'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {filter !== 'all' && (
          <p className="mt-2 text-[10px] font-bold text-slate-500">
            Hiển thị {pendingCases.length}/{allPending.length} ca
          </p>
        )}
      </div>

      {/* Queue list */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {pendingCases.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 px-4 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-teal-100 bg-teal-50 text-teal-600">
              <CheckCircle className="h-5 w-5" />
            </div>
            <p className="text-xs font-bold text-slate-600">Đã sạch hàng đợi lâm sàng!</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Mọi ca tư vấn sơ bộ đều đã được giải quyết.</p>
          </div>
        )}

        {pendingCases.map((c) => (
          <CaseCard
            key={c.id}
            medCase={c}
            isSelected={selectedCaseId === c.id}
            onSelect={() => selectCase(selectedCaseId === c.id ? null : c.id)}
            now={now}
          />
        ))}

        {approvedCases.length > 0 && (
          <>
            <div className="px-4 py-2.5 bg-slate-100/70 border-y border-slate-200/60">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-slate-400" />
                Đã xử lý trong ca ({approvedCases.length})
              </p>
            </div>
            <div className="divide-y divide-slate-100">
              {approvedCases.map((c) => (
                <CaseCard key={c.id} medCase={c} isSelected={false} onSelect={() => {}} faded now={now} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function QueueStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-2 py-2">
      <p className="text-sm font-black text-slate-900">{value}</p>
      <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
    </div>
  );
}

function CaseCard({
  medCase: c,
  isSelected,
  onSelect,
  faded,
  now,
}: {
  medCase: MedCase;
  isSelected: boolean;
  onSelect: () => void;
  faded?: boolean;
  now: number | null;
}) {
  const waitMins = waitMinutes(c.created_at, now);
  const anxiety = ANXIETY_CONFIG[c.anxiety_level];
  const isSLAWarning = waitMins > 15 && c.status === 'pending';
  const isSLABreach = waitMins > 30 && c.status === 'pending';

  // SLA visual progress bar percentage
  const maxSLAMins = 45;
  const slaPercentage = Math.min(100, (waitMins / maxSLAMins) * 100);

  const slaProgressColor = isSLABreach
    ? 'bg-red-500 shadow-red-200 shadow-xs'
    : isSLAWarning
    ? 'bg-amber-500 shadow-amber-200 shadow-xs'
    : 'bg-teal-500 shadow-teal-200 shadow-xs';

  return (
    <button
      onClick={onSelect}
      className={cn(
        'relative min-h-28 w-full cursor-pointer border-l-4 px-4 py-3.5 text-left transition-all duration-200',
        isSelected
          ? 'bg-teal-50/50 border-l-teal-600 shadow-xs'
          : faded
          ? 'bg-slate-50/50 border-l-transparent opacity-60'
          : isSLABreach
          ? 'border-l-red-500 bg-white hover:bg-slate-50/50'
          : isSLAWarning
          ? 'border-l-amber-500 bg-white hover:bg-slate-50/50'
          : 'border-l-transparent bg-white hover:bg-slate-50/50',
        c.status === 'pending' && c.anxiety_level === 'panic' && !isSelected && 'animate-pulse-slow'
      )}
    >
      <div className="mb-1.5 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold leading-tight text-slate-800">{c.patient_name}</p>
          <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider">{ageLabel(c.patient_age_months)}</p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-1.5">
          {c.has_images && (
            <span title="Có ảnh lâm sàng" className="bg-slate-100 p-1 rounded-md text-slate-500">
              <ImageIcon className="h-3 w-3" />
            </span>
          )}
          <Badge variant={anxiety.badgeVariant}>
            {anxiety.label}
          </Badge>
        </div>
      </div>

      {/* Symptom keywords */}
      <div className="mb-2 flex flex-wrap gap-1">
        {c.symptom_keywords.slice(0, 3).map((kw) => (
          <span key={kw} className="bg-slate-100 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded-md border border-slate-200/50">
            {kw}
          </span>
        ))}
      </div>

      {/* SLA Timer and Wait Bar */}
      {c.status === 'pending' && (
        <div className="mb-2 w-full space-y-1">
          <div className="flex items-center justify-between text-[9px] font-bold text-slate-400">
            <span className="flex items-center gap-1" suppressHydrationWarning>
              <Clock className="h-3 w-3 text-slate-400" />
              Chờ y tế: {waitMins}m
            </span>
            <span>SLA: 45m</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200/10">
            <div
              className={cn('h-full rounded-full transition-all duration-350', slaProgressColor)}
              style={{ width: `${slaPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-1 flex items-center justify-between gap-2 border-t border-slate-200/40 pt-1.5">
        <span
          className={cn(
            'text-[10px] font-bold flex items-center gap-1',
            isSLABreach ? 'text-red-600' : isSLAWarning ? 'text-amber-500' : 'text-slate-400'
          )}
          suppressHydrationWarning
        >
          <Hourglass className="h-3 w-3" />
          {formatRelativeTime(c.created_at)}
        </span>
        <span
          className={cn(
            'text-[9px] px-2 py-0.5 rounded-md font-extrabold uppercase tracking-wide',
            c.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200/40' :
            c.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/40' :
            'bg-red-50 text-red-700 border border-red-200/40'
          )}
        >
          {c.status === 'pending' ? 'Chờ duyệt' : c.status === 'approved' ? 'Đã duyệt' : 'Từ chối'}
        </span>
      </div>
    </button>
  );
}
