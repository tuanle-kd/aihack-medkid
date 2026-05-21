'use client';

import { useAppStore } from '@/store/app-store';
import { formatRelativeTime, ageLabel } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { MedCase, AnxietyLevel } from '@/types';
import { Clock, Image as ImageIcon, CheckCircle, Hourglass, Activity } from 'lucide-react';

const ANXIETY_CONFIG: Record<AnxietyLevel, { label: string; badgeVariant: 'calm' | 'concerned' | 'panic' }> = {
  calm: { label: 'Bình tĩnh', badgeVariant: 'calm' },
  concerned: { label: 'Lo lắng', badgeVariant: 'concerned' },
  panic: { label: 'Hoảng loạn', badgeVariant: 'panic' },
};

function waitMinutes(isoString: string) {
  return Math.floor((Date.now() - new Date(isoString).getTime()) / 60000);
}

export function CaseQueue() {
  const cases = useAppStore((s) => s.cases);
  const selectedCaseId = useAppStore((s) => s.selectedCaseId);
  const selectCase = useAppStore((s) => s.selectCase);

  const pendingCases = cases.filter((c) => c.status === 'pending');
  const approvedCases = cases.filter((c) => c.status !== 'pending');

  return (
    <div className="flex flex-col h-full bg-slate-50/30 border-r border-slate-200">
      {/* Header */}
      <div className="px-4 py-4 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Activity className="h-4 w-4 text-teal-600 animate-pulse" />
            <h2 className="font-bold text-slate-800 text-sm tracking-tight">Hàng Đợi Ca Lâm Sàng</h2>
          </div>
          <span className="bg-teal-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
            {pendingCases.length} Chờ Duyệt
          </span>
        </div>
      </div>

      {/* Queue list */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {pendingCases.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 px-4 text-center">
            <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 text-base mb-3 border border-teal-100/50">
              ✓
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
                <CaseCard key={c.id} medCase={c} isSelected={false} onSelect={() => {}} faded />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CaseCard({
  medCase: c,
  isSelected,
  onSelect,
  faded,
}: {
  medCase: MedCase;
  isSelected: boolean;
  onSelect: () => void;
  faded?: boolean;
}) {
  const waitMins = waitMinutes(c.created_at);
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
        'w-full text-left px-4 py-3.5 border-l-4 transition-all duration-200 cursor-pointer relative',
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
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div>
          <p className="font-bold text-slate-800 text-xs sm:text-sm leading-tight truncate max-w-[130px]">{c.patient_name}</p>
          <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider">{ageLabel(c.patient_age_months)}</p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
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
      <div className="flex flex-wrap gap-1 mb-2">
        {c.symptom_keywords.slice(0, 3).map((kw) => (
          <span key={kw} className="bg-slate-100 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded-md border border-slate-200/50">
            {kw}
          </span>
        ))}
      </div>

      {/* SLA Timer and Wait Bar */}
      {c.status === 'pending' && (
        <div className="w-full space-y-1 mb-2">
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
      <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-slate-150/40">
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
            c.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-250/40' :
            'bg-red-50 text-red-700 border border-red-200/40'
          )}
        >
          {c.status === 'pending' ? 'Chờ duyệt' : c.status === 'approved' ? 'Đã duyệt' : 'Từ chối'}
        </span>
      </div>
    </button>
  );
}
