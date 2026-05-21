'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { ageLabel, formatTime } from '@/lib/utils';
import type { MedCase } from '@/types';
import { MOCK_DOCTORS } from '@/mock/data';

type Tab = 'patient' | 'messages' | 'draft';

export function CaseDetail() {
  const { selectedCaseId, cases, selectCase, approveCase, rejectCase } = useAppStore((s) => ({
    selectedCaseId: s.selectedCaseId,
    cases: s.cases,
    selectCase: s.selectCase,
    approveCase: s.approveCase,
    rejectCase: s.rejectCase,
  }));

  const medCase = cases.find((c) => c.id === selectedCaseId);
  const [activeTab, setActiveTab] = useState<Tab>('draft');
  const [draft, setDraft] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showDiff, setShowDiff] = useState(false);

  if (!medCase) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <span className="text-4xl mb-3">👈</span>
        <p className="text-sm">Chọn một ca để xem chi tiết</p>
      </div>
    );
  }

  const handleOpen = (c: MedCase) => {
    setDraft(c.ai_draft ?? '');
    setActiveTab('draft');
    setShowDiff(false);
  };

  // Initialize draft when case changes
  if (draft === '' && medCase.ai_draft) {
    setDraft(medCase.ai_draft);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white flex-shrink-0">
        <div>
          <h3 className="font-semibold text-gray-800">{medCase.patient_name}</h3>
          <p className="text-xs text-gray-500">
            {ageLabel(medCase.patient_age_months)} · {medCase.workflow_type.replace('_', ' ')}
          </p>
        </div>
        <button
          onClick={() => selectCase(null)}
          className="text-gray-400 hover:text-gray-600 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
        >
          ×
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white flex-shrink-0">
        {(['draft', 'patient', 'messages'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-xs font-medium transition-colors ${
              activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'draft' ? '✏️ Bản nháp AI' : tab === 'patient' ? '👤 Hồ sơ' : '💬 Tin nhắn'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'draft' && (
          <DraftTab
            medCase={medCase}
            draft={draft}
            setDraft={setDraft}
            showDiff={showDiff}
            setShowDiff={setShowDiff}
          />
        )}
        {activeTab === 'patient' && <PatientTab medCase={medCase} />}
        {activeTab === 'messages' && <MessagesTab medCase={medCase} />}
      </div>

      {/* Action buttons */}
      {medCase.status === 'pending' && (
        <div className="flex gap-2 p-3 border-t border-gray-200 bg-white flex-shrink-0">
          <button
            onClick={() => setShowRejectModal(true)}
            className="flex-1 py-2.5 rounded-xl border-2 border-red-500 text-red-600 font-semibold text-sm
                       hover:bg-red-50 active:scale-95 transition-all"
          >
            ❌ REJECT
          </button>
          <button
            onClick={() => approveCase(medCase.id, draft)}
            className="flex-[2] py-2.5 rounded-xl bg-green-600 text-white font-semibold text-sm
                       hover:bg-green-700 active:scale-95 transition-all shadow-md"
          >
            ✅ APPROVE & DISPATCH
          </button>
        </div>
      )}

      {/* Reject modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
          <div className="w-full max-w-lg bg-white rounded-t-2xl p-4 shadow-2xl">
            <h4 className="font-semibold text-gray-800 mb-3">Lý do từ chối</h4>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3"
              onChange={(e) => setRejectReason(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>Chọn lý do</option>
              <option value="Thông tin không đủ">Thông tin không đủ</option>
              <option value="Ảnh chất lượng kém">Ảnh chất lượng kém</option>
              <option value="Ca cần khám trực tiếp">Ca cần khám trực tiếp</option>
              <option value="Câu hỏi ngoài phạm vi">Câu hỏi ngoài phạm vi</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-600"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  if (rejectReason) {
                    rejectCase(medCase.id, rejectReason);
                    setShowRejectModal(false);
                  }
                }}
                disabled={!rejectReason}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm font-medium
                           disabled:opacity-50 enabled:hover:bg-red-600"
              >
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Draft Tab ────────────────────────────────────────────────────────────────

function DraftTab({
  medCase,
  draft,
  setDraft,
  showDiff,
  setShowDiff,
}: {
  medCase: MedCase;
  draft: string;
  setDraft: (v: string) => void;
  showDiff: boolean;
  setShowDiff: (v: boolean) => void;
}) {
  const original = medCase.ai_draft ?? '';
  const wordCount = draft.split(/\s+/).filter(Boolean).length;
  const originalCount = original.split(/\s+/).filter(Boolean).length;
  const diff = wordCount - originalCount;

  return (
    <div className="p-4 space-y-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{wordCount} từ</span>
          {diff !== 0 && (
            <span className={`text-xs font-medium ${diff > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {diff > 0 ? `+${diff}` : diff} từ
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowDiff(!showDiff)}
            className="text-xs text-blue-600 hover:underline"
          >
            {showDiff ? 'Xem bản hoàn chỉnh' : 'Xem diff'}
          </button>
          <button
            onClick={() => setDraft(original)}
            className="text-xs text-gray-500 hover:underline"
          >
            Khôi phục gốc
          </button>
        </div>
      </div>

      {showDiff ? (
        <DiffView original={original} edited={draft} />
      ) : (
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="w-full h-64 border border-yellow-200 bg-yellow-50 rounded-xl px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none leading-relaxed"
        />
      )}

      {/* RAG sources */}
      {medCase.rag_snippets && medCase.rag_snippets.length > 0 && (
        <details className="border border-gray-200 rounded-lg">
          <summary className="px-3 py-2 text-xs font-medium text-gray-600 cursor-pointer hover:bg-gray-50">
            📚 Nguồn tri thức AI ({medCase.rag_snippets.length})
          </summary>
          <div className="px-3 pb-3 space-y-2">
            {medCase.rag_snippets.map((s) => (
              <div key={s.id} className="text-xs border border-gray-100 rounded-lg p-2">
                <div className="flex justify-between items-start mb-1">
                  <p className="font-medium text-gray-700">{s.title}</p>
                  <span className="text-gray-400 ml-2 flex-shrink-0">
                    {(s.similarity * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-gray-500 leading-relaxed">{s.content}</p>
                <p className="text-gray-400 mt-1 italic">{s.source}</p>
              </div>
            ))}
          </div>
        </details>
      )}

      {/* CV analysis */}
      {medCase.cv_analysis && (
        <div className="border border-orange-200 bg-orange-50 rounded-lg p-3">
          <p className="text-xs font-medium text-orange-700 mb-2">🔬 CV Analysis</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-orange-800">
            <div>Diện tích: <strong>{medCase.cv_analysis.area_cm2} cm²</strong></div>
            <div>Màu: <strong>{medCase.cv_analysis.dominant_color}</strong></div>
            <div>Hình thái: <strong>{medCase.cv_analysis.morphology}</strong></div>
          </div>
        </div>
      )}
    </div>
  );
}

function DiffView({ original, edited }: { original: string; edited: string }) {
  const origWords = original.split(/\s+/);
  const editWords = edited.split(/\s+/);

  return (
    <div className="border border-gray-200 rounded-xl p-3 text-sm leading-relaxed bg-white">
      <p className="text-xs text-gray-500 mb-2">
        <span className="text-red-500 font-medium">Đỏ gạch</span> = xóa ·{' '}
        <span className="text-green-600 font-medium">Xanh gạch chân</span> = thêm
      </p>
      <p className="leading-relaxed">
        {origWords.map((w, i) => {
          if (!editWords.includes(w)) {
            return (
              <span key={i} className="line-through text-red-500">
                {w}{' '}
              </span>
            );
          }
          return <span key={i}>{w} </span>;
        })}
        {editWords
          .filter((w) => !origWords.includes(w))
          .map((w, i) => (
            <span key={`add-${i}`} className="underline text-green-600">
              {w}{' '}
            </span>
          ))}
      </p>
    </div>
  );
}

// ─── Patient Tab ──────────────────────────────────────────────────────────────

function PatientTab({ medCase }: { medCase: MedCase }) {
  const emr = medCase.emr;
  if (!emr) {
    return (
      <div className="p-4 text-center text-gray-400 text-sm">
        <p className="mb-1">⚠️ Không có dữ liệu EMR</p>
        <p className="text-xs">VCLINIC sync thất bại</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Basic info */}
      <div className="bg-white border border-gray-200 rounded-xl p-3">
        <p className="text-xs font-medium text-gray-500 uppercase mb-2">Thông tin bệnh nhân</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><span className="text-gray-500 text-xs">SID</span><br /><strong>{emr.sid}</strong></div>
          <div><span className="text-gray-500 text-xs">Giới tính</span><br /><strong>{emr.gender === 'female' ? 'Nữ' : 'Nam'}</strong></div>
          <div><span className="text-gray-500 text-xs">Tuổi</span><br /><strong>{ageLabel(emr.age_months)}</strong></div>
          <div><span className="text-gray-500 text-xs">Cân nặng</span><br /><strong>{emr.weight_kg} kg</strong></div>
        </div>
      </div>

      {/* Medical history */}
      <div className="bg-white border border-gray-200 rounded-xl p-3">
        <p className="text-xs font-medium text-gray-500 uppercase mb-2">Tiền sử bệnh</p>
        <div className="flex flex-wrap gap-1">
          {emr.medical_history.map((h) => (
            <span key={h} className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">{h}</span>
          ))}
        </div>
      </div>

      {/* Current medications */}
      {emr.current_medications.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-3">
          <p className="text-xs font-medium text-gray-500 uppercase mb-2">Thuốc đang dùng</p>
          {emr.current_medications.map((m) => (
            <p key={m} className="text-sm text-gray-700">• {m}</p>
          ))}
        </div>
      )}

      {/* IgG table */}
      {emr.igg_data.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-3">
          <p className="text-xs font-medium text-gray-500 uppercase mb-2">Kết quả IgG</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left pb-1 text-gray-500">Dị nguyên</th>
                <th className="text-right pb-1 text-gray-500">U/mL</th>
                <th className="text-right pb-1 text-gray-500">Mức</th>
              </tr>
            </thead>
            <tbody>
              {[...emr.igg_data].sort((a, b) => b.value - a.value).map((row) => (
                <tr key={row.allergen} className="border-b border-gray-50">
                  <td className="py-1 text-gray-700">{row.allergen}</td>
                  <td className="py-1 text-right font-mono">{row.value}</td>
                  <td className="py-1 text-right">
                    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                      row.level === 'high' ? 'bg-red-100 text-red-700' :
                      row.level === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {row.level === 'high' ? 'Cao' : row.level === 'medium' ? 'TB' : 'Thấp'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Messages Tab ──────────────────────────────────────────────────────────────

function MessagesTab({ medCase }: { medCase: MedCase }) {
  return (
    <div className="p-4 space-y-3">
      {medCase.messages.map((msg) => (
        <div key={msg.id} className="bg-blue-50 border border-blue-100 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-blue-700">👤 Phụ huynh</span>
            <span className="text-xs text-gray-400">{formatTime(msg.timestamp)}</span>
          </div>
          {msg.images?.map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-2 flex items-center gap-2 mb-2 text-xs text-gray-600">
              <span>📷</span> Ảnh đính kèm (sample-rash.jpg)
            </div>
          ))}
          <p className="text-sm text-gray-800 leading-relaxed">{msg.content}</p>
        </div>
      ))}
    </div>
  );
}
