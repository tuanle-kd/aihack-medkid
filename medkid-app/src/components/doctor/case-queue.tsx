'use client';

import { useAppStore } from '@/store/app-store';
import { formatRelativeTime, ageLabel } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { MedCase, AnxietyLevel } from '@/types';

const ANXIETY_CONFIG: Record<AnxietyLevel, { label: string; emoji: string; color: string }> = {
  calm: { label: 'Bình tĩnh', emoji: '🟢', color: 'text-green-600' },
  concerned: { label: 'Lo lắng', emoji: '🟡', color: 'text-yellow-600' },
  panic: { label: 'Hoảng loạn', emoji: '🔴', color: 'text-red-600' },
};

function waitMinutes(isoString: string) {
  return Math.floor((Date.now() - new Date(isoString).getTime()) / 60000);
}

export function CaseQueue() {
  const { cases, selectedCaseId, selectCase } = useAppStore((s) => ({
    cases: s.cases,
    selectedCaseId: s.selectedCaseId,
    selectCase: s.selectCase,
  }));

  const pendingCases = cases.filter((c) => c.status === 'pending');
  const approvedCases = cases.filter((c) => c.status !== 'pending');

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-800 text-sm">Hàng đợi duyệt</h2>
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {pendingCases.length} Pending
          </span>
        </div>
      </div>

      {/* Queue list */}
      <div className="flex-1 overflow-y-auto">
        {pendingCases.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <span className="text-3xl mb-2">✅</span>
            <p className="text-sm">Không có ca nào đang chờ</p>
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
            <div className="px-4 py-2 bg-gray-50 border-y border-gray-200">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đã xử lý ({approvedCases.length})
              </p>
            </div>
            {approvedCases.map((c) => (
              <CaseCard key={c.id} medCase={c} isSelected={false} onSelect={() => {}} faded />
            ))}
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
  const isSLAWarning = waitMins > 30 && c.status === 'pending';
  const isSLABreach = waitMins > 60 && c.status === 'pending';

  return (
    <button
      onClick={onSelect}
      className={cn(
        'w-full text-left px-4 py-3 border-b border-gray-100 transition-colors',
        isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-gray-50',
        faded && 'opacity-50',
        isSLABreach && 'border-l-4 border-l-red-500',
        isSLAWarning && !isSLABreach && 'border-l-4 border-l-orange-400',
        c.status === 'pending' && c.anxiety_level === 'panic' && !isSelected && 'animate-pulse'
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <div>
          <p className="font-semibold text-gray-800 text-sm">{c.patient_name}</p>
          <p className="text-xs text-gray-500">{ageLabel(c.patient_age_months)}</p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {c.has_images && <span title="Có ảnh" className="text-sm">📷</span>}
          <span className={cn('text-xs font-medium', anxiety.color)}>
            {anxiety.emoji} {anxiety.label}
          </span>
        </div>
      </div>

      {/* Symptom keywords */}
      <div className="flex flex-wrap gap-1 mb-1">
        {c.symptom_keywords.map((kw) => (
          <span key={kw} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
            {kw}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span
          className={cn(
            'text-xs',
            isSLABreach ? 'text-red-600 font-bold' : isSLAWarning ? 'text-orange-500 font-medium' : 'text-gray-400'
          )}
        >
          {formatRelativeTime(c.created_at)}
        </span>
        <span
          className={cn(
            'text-xs px-2 py-0.5 rounded-full font-medium',
            c.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
            c.status === 'approved' ? 'bg-green-100 text-green-700' :
            'bg-red-100 text-red-700'
          )}
        >
          {c.status === 'pending' ? 'Chờ duyệt' : c.status === 'approved' ? 'Đã duyệt' : 'Từ chối'}
        </span>
      </div>
    </button>
  );
}
