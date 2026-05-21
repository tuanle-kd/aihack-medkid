'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { ageLabel, formatTime, cn } from '@/lib/utils';
import type { MedCase } from '@/types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  MessageSquare,
  CornerUpLeft,
  Check,
  X,
  Sparkles,
  Microscope,
  Heart,
  Calendar,
  Weight,
  Dna,
  History,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  Camera
} from 'lucide-react';
import { TipTapEditor } from '@/components/ui/tiptap-editor';
import { CVImageOverlay } from '@/components/doctor/cv-image-overlay';

export function CaseDetail() {
  const selectedCaseId = useAppStore((s) => s.selectedCaseId);
  const cases = useAppStore((s) => s.cases);
  const selectCase = useAppStore((s) => s.selectCase);
  const approveCase = useAppStore((s) => s.approveCase);
  const rejectCase = useAppStore((s) => s.rejectCase);

  const medCase = cases.find((c) => c.id === selectedCaseId);
  const [draftState, setDraftState] = useState({ caseId: '', value: '' });
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showDiffState, setShowDiffState] = useState({ caseId: '', value: false });

  if (!medCase) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 bg-slate-50/10">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mb-4 border border-slate-200/50 shadow-inner">
          <MessageSquare className="h-6 w-6 text-slate-400" />
        </div>
        <h4 className="text-sm font-bold text-slate-700 mb-1">Chi Tiết Ca Bệnh Sơ Bộ</h4>
        <p className="text-xs text-slate-500 max-w-[200px] text-center leading-relaxed">
          Chọn một ca bệnh ở danh sách hàng đợi bên trái để bắt đầu phê duyệt y tế.
        </p>
      </div>
    );
  }

  const handleResetDraft = () => {
    setDraftState({ caseId: medCase.id, value: medCase.ai_draft ?? '' });
  };

  const draft = draftState.caseId === medCase.id ? draftState.value : medCase.ai_draft ?? '';
  const showDiff = showDiffState.caseId === medCase.id ? showDiffState.value : false;
  const setDraft = (value: string) => setDraftState({ caseId: medCase.id, value });
  const setShowDiff = (value: boolean) => setShowDiffState({ caseId: medCase.id, value });

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
        <div className="min-w-0">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h3 className="text-base font-bold text-slate-800">{medCase.patient_name}</h3>
            <Badge variant="outline" className="text-[10px] font-black uppercase text-teal-700 border-teal-200 bg-teal-50">
              {medCase.workflow_type.replace(/_/g, ' ')}
            </Badge>
          </div>
          <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Tuổi: {ageLabel(medCase.patient_age_months)} · Mã số: {medCase.id.slice(0, 8).toUpperCase()}
          </p>
        </div>
        <button
          onClick={() => selectCase(null)}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-red-500"
          aria-label="Đóng chi tiết ca"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Tabs Container */}
      <Tabs defaultValue="draft" className="flex flex-1 flex-col overflow-hidden">
        <div className="shrink-0 overflow-x-auto border-b border-slate-200 bg-white px-4 sm:px-6">
          <TabsList className="w-max min-w-full justify-start gap-1 bg-slate-50 p-1">
            <TabsTrigger value="draft" className="flex-1 gap-1.5 py-2 sm:flex-initial">
              <Sparkles className="h-3.5 w-3.5 text-teal-600" />
              Bản Nháp AI
            </TabsTrigger>
            <TabsTrigger value="patient" className="flex-1 gap-1.5 py-2 sm:flex-initial">
              <FileText className="h-3.5 w-3.5 text-teal-600" />
              Hồ Sơ VCLINIC
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex-1 gap-1.5 py-2 sm:flex-initial">
              <MessageSquare className="h-3.5 w-3.5 text-teal-600" />
              Triệu Chứng Đầu Vào
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab content area */}
        <div className="flex-1 overflow-y-auto">
          {/* Draft tab */}
          <TabsContent value="draft" className="m-0 space-y-4 p-4 sm:p-6">
            <DraftTabContent
              medCase={medCase}
              draft={draft}
              setDraft={setDraft}
              showDiff={showDiff}
              setShowDiff={setShowDiff}
              onReset={handleResetDraft}
            />
          </TabsContent>

          {/* Patient tab */}
          <TabsContent value="patient" className="m-0 space-y-4 p-4 sm:p-6">
            <PatientTabContent medCase={medCase} />
          </TabsContent>

          {/* Messages tab */}
          <TabsContent value="messages" className="m-0 space-y-4 p-4 sm:p-6">
            <MessagesTabContent medCase={medCase} />
          </TabsContent>
        </div>
      </Tabs>

      {/* Action buttons */}
      {medCase.status === 'pending' && (
        <div className="flex shrink-0 flex-col gap-2 border-t border-slate-200 bg-white p-4 sm:flex-row sm:gap-3">
          <Button
            onClick={() => setShowRejectModal(true)}
            variant="outline"
            className="flex-1 border-red-200 font-bold text-red-600 hover:border-red-300 hover:bg-red-50"
          >
            <X className="h-4 w-4 mr-1.5 text-red-500" />
            Từ chối duyệt ca
          </Button>
          <Button
            onClick={() => approveCase(medCase.id, draft)}
            variant="default"
            className="flex-[2] bg-emerald-600 font-black tracking-wide text-white shadow-lg shadow-emerald-700/10 hover:bg-emerald-700"
          >
            <Check className="h-4 w-4 mr-1.5 text-white" />
            Ký duyệt & gửi phụ huynh
          </Button>
        </div>
      )}

      {/* Reject modal overlay */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-3 text-red-600">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <h4 className="font-bold text-slate-800 text-sm sm:text-base">Lý Do Từ Chối Duyệt Ca</h4>
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Vui lòng chọn lý do chính xác để hệ thống gửi phản hồi và hướng dẫn khám trực tiếp phù hợp về cho phụ huynh.
            </p>

            <select
              className="mb-4 min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-base font-medium transition-all focus:outline-hidden focus:ring-2 focus:ring-teal-600 sm:text-sm"
              onChange={(e) => setRejectReason(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>Chọn lý do lâm sàng</option>
              <option value="Thông tin triệu chứng không đủ để sàng lọc">Triệu chứng khai báo quá mập mờ</option>
              <option value="Hình ảnh tổn thương da mờ hoặc không đủ ánh sáng">Ảnh chụp tổn thương mờ/thiếu sáng</option>
              <option value="Triệu chứng cần chỉ định khám lâm sàng trực tiếp ngay">Bắt buộc khám lâm sàng trực tiếp</option>
              <option value="Câu hỏi ngoài phạm vi y tế nhi khoa hỗ trợ">Câu hỏi ngoài phạm vi y tế nhi khoa</option>
            </select>

            <div className="flex gap-2">
              <Button
                onClick={() => setShowRejectModal(false)}
                variant="outline"
                className="flex-1 text-xs"
              >
                Hủy
              </Button>
              <Button
                onClick={() => {
                  if (rejectReason) {
                    rejectCase(medCase.id, rejectReason);
                    setShowRejectModal(false);
                  }
                }}
                disabled={!rejectReason}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
              >
                Xác nhận từ chối
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Draft Tab Content Component ──────────────────────────────────────────────

function DraftTabContent({
  medCase,
  draft,
  setDraft,
  showDiff,
  setShowDiff,
  onReset,
}: {
  medCase: MedCase;
  draft: string;
  setDraft: (v: string) => void;
  showDiff: boolean;
  setShowDiff: (v: boolean) => void;
  onReset: () => void;
}) {
  const original = medCase.ai_draft ?? '';
  const wordCount = draft.split(/\s+/).filter(Boolean).length;
  const originalCount = original.split(/\s+/).filter(Boolean).length;
  const diff = wordCount - originalCount;

  return (
    <div className="space-y-4">
      {/* Editor toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/50 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{wordCount} từ soạn thảo</span>
          {diff !== 0 && (
            <span className={cn(
              'text-[10px] font-black px-2 py-0.5 rounded-full uppercase',
              diff > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
            )}>
              {diff > 0 ? `+${diff}` : diff} từ thay đổi
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowDiff(!showDiff)}
            className="flex min-h-9 cursor-pointer items-center gap-1 rounded-lg text-xs font-bold text-teal-700 hover:underline"
          >
            {showDiff ? 'Hiện ô sửa đổi' : 'Xem diff chi tiết'}
          </button>
          <button
            onClick={onReset}
            className="flex min-h-9 cursor-pointer items-center gap-1 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-700 hover:underline"
          >
            <CornerUpLeft className="h-3 w-3" />
            Khôi phục gốc
          </button>
        </div>
      </div>

      {/* Editor body */}
      {showDiff ? (
        <DiffView original={original} edited={draft} />
      ) : (
        <TipTapEditor
          value={draft}
          onChange={setDraft}
          disabled={medCase.status !== 'pending'}
          placeholder="Viết hoặc hiệu chỉnh đơn thuốc/hướng dẫn chăm sóc lâm sàng..."
        />
      )}

      {/* CV skin analysis banner */}
      {medCase.cv_analysis && (
        <div className="flex flex-col gap-3.5 rounded-2xl border border-teal-100 bg-teal-50/20 p-4 sm:flex-row sm:items-start">
          <div className="bg-teal-100 p-2 rounded-xl text-teal-700">
            <Microscope className="h-5 w-5 text-teal-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-bold text-teal-950 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              Phân Tích Bounding-box Thị Giác Máy Tính (CV Analysis)
            </h4>
            <div className="grid gap-3 text-xs text-slate-600 sm:grid-cols-3">
              <div className="bg-white p-2 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Diện tích</span>
                <strong className="text-slate-800 text-sm mt-0.5 block">{medCase.cv_analysis.area_cm2} cm²</strong>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Màu sắc</span>
                <strong className="text-slate-800 text-sm mt-0.5 block capitalize">{medCase.cv_analysis.dominant_color}</strong>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Hình thái học</span>
                <strong className="text-slate-800 text-sm mt-0.5 block capitalize">{medCase.cv_analysis.morphology}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RAG Knowledge sources accordion */}
      {medCase.rag_snippets && medCase.rag_snippets.length > 0 && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="rag-sources" className="border border-slate-200/65 rounded-2xl bg-slate-50/20 overflow-hidden px-4">
            <AccordionTrigger className="hover:no-underline font-bold text-slate-700 text-xs py-3.5">
              <span className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-teal-600" />
                Tài liệu RAG đối chiếu chéo ({medCase.rag_snippets.length})
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              {medCase.rag_snippets.map((s) => (
                <div key={s.id} className="text-xs border border-slate-100 bg-white rounded-xl p-3.5 shadow-xs">
                  <div className="flex justify-between items-start mb-1.5">
                    <p className="font-bold text-slate-800 leading-tight flex items-center gap-1.5">
                      <Heart className="h-3.5 w-3.5 text-teal-600 fill-teal-50" />
                      {s.title}
                    </p>
                    <span className="text-[10px] font-black bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-100/50 flex-shrink-0 ml-2">
                      Độ tương đồng: {(s.similarity * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-slate-500 leading-relaxed font-medium">{s.content}</p>
                  <p className="text-[10px] text-slate-400 mt-2 italic font-semibold">Nguồn trích dẫn: {s.source}</p>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}

// ─── Visual Word Diff Component ──────────────────────────────────────────────

function DiffView({ original, edited }: { original: string; edited: string }) {
  const origWords = original.split(/\s+/);
  const editWords = edited.split(/\s+/);

  return (
    <div className="border border-slate-200 rounded-2xl p-4 text-xs sm:text-sm leading-relaxed bg-slate-50/30">
      <div className="mb-3 flex w-fit max-w-full flex-wrap items-center gap-3 rounded-xl border border-slate-200/40 bg-white p-2 text-[10px] font-bold text-slate-500">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-red-100 border border-red-300 line-through rounded-xs inline-block" />
          Màu đỏ = Câu gốc AI
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-emerald-100 border border-emerald-300 underline rounded-xs inline-block" />
          Màu xanh = Bác sĩ thêm mới
        </span>
      </div>
      <p className="leading-relaxed font-medium text-slate-800">
        {origWords.map((w, i) => {
          if (!editWords.includes(w)) {
            return (
              <span key={i} className="line-through bg-red-50 text-red-600 px-1 rounded-sm border border-red-200/30 mx-0.5">
                {w}{' '}
              </span>
            );
          }
          return <span key={i}>{w} </span>;
        })}
        {editWords
          .filter((w) => !origWords.includes(w))
          .map((w, i) => (
            <span key={`add-${i}`} className="underline bg-emerald-50 text-emerald-700 px-1 rounded-sm border border-emerald-200/30 font-bold mx-0.5">
              {w}{' '}
            </span>
          ))}
      </p>
    </div>
  );
}

// ─── Patient EMR Tab Content Component ────────────────────────────────────────

function PatientTabContent({ medCase }: { medCase: MedCase }) {
  const emr = medCase.emr;
  if (!emr) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-slate-200/50 bg-slate-50 text-slate-400">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <p className="font-bold text-slate-600">Đồng bộ EMR VCLINIC thất bại</p>
        <p className="text-slate-400 mt-0.5">Không tìm thấy mã SID y khoa của trẻ em trên hồ sơ liên thông.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Basic EMR cards grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-3 flex items-start gap-2.5">
          <Dna className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Mã SID</span>
            <strong className="text-slate-800 text-xs mt-0.5 block">{emr.sid}</strong>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-3 flex items-start gap-2.5">
          <Calendar className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Tuổi trẻ em</span>
            <strong className="text-slate-800 text-xs mt-0.5 block">{ageLabel(emr.age_months)}</strong>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-3 flex items-start gap-2.5">
          <Weight className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Cân nặng</span>
            <strong className="text-slate-800 text-xs mt-0.5 block">{emr.weight_kg} kg</strong>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-3 flex items-start gap-2.5">
          <History className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Khám cuối</span>
            <strong className="text-slate-800 text-xs mt-0.5 block truncate max-w-[70px]">{formatTime(emr.last_visit_date)}</strong>
          </div>
        </div>
      </div>

      {/* History and active drugs */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="bg-white border border-slate-200/50 rounded-2xl p-4">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
            <History className="h-3.5 w-3.5 text-teal-600" />
            Tiền sử dịch tễ & dị ứng
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {emr.medical_history.map((h) => (
              <Badge key={h} variant="outline" className="text-[11px] font-bold text-slate-700 bg-slate-50 border-slate-200">
                {h}
              </Badge>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200/50 rounded-2xl p-4">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5 text-teal-600" />
            Các thuốc điều trị hiện tại
          </h4>
          {emr.current_medications.length > 0 ? (
            <div className="space-y-1.5">
              {emr.current_medications.map((m) => (
                <p key={m} className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                  {m}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 font-semibold italic">Không có thuốc điều trị nào đang dùng.</p>
          )}
        </div>
      </div>

      {/* Stylized IgG Food Allergy Table */}
      {emr.igg_data.length > 0 && (
        <div className="bg-white border border-slate-200/50 rounded-2xl p-4">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3.5 flex items-center gap-1.5">
            <Microscope className="h-3.5 w-3.5 text-teal-600" />
            Chỉ số xét nghiệm IgG bán định lượng dị nguyên
          </h4>
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full min-w-[520px] text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/40 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                  <th className="text-left px-4 py-2.5">Dị nguyên sữa & thực phẩm</th>
                  <th className="text-right px-4 py-2.5">Nồng độ IgG (U/mL)</th>
                  <th className="text-right px-4 py-2.5">Cấp độ lo ngại</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-medium">
                {[...emr.igg_data].sort((a, b) => b.value - a.value).map((row) => (
                  <tr key={row.allergen} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-4 py-2 text-slate-700 font-bold">{row.allergen}</td>
                    <td className="px-4 py-2 text-right font-mono font-semibold text-slate-800">{row.value}</td>
                    <td className="px-4 py-2 text-right">
                      <span className={cn(
                        'px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border',
                        row.level === 'high' ? 'bg-red-50 text-red-700 border-red-200/40 animate-pulse-slow' :
                        row.level === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200/40' :
                        'bg-teal-50 text-teal-700 border-teal-200/40'
                      )}>
                        {row.level === 'high' ? 'Cao lâm sàng' : row.level === 'medium' ? 'Trung bình' : 'Thấp an toàn'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Input Messages Tab Content Component ─────────────────────────────────────

function MessagesTabContent({ medCase }: { medCase: MedCase }) {
  return (
    <div className="space-y-4">
      {medCase.messages.map((msg) => (
        <div key={msg.id} className="bg-teal-50/10 border border-teal-200/30 rounded-2xl p-4 shadow-xs">
          <div className="mb-2.5 flex items-center justify-between gap-3 border-b border-slate-100 pb-2">
            <span className="text-xs font-bold text-teal-800 flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5 text-teal-600" />
              Phụ Huynh Khai Triệu Chứng
            </span>
            <span className="text-[10px] font-bold text-slate-400">{formatTime(msg.timestamp)}</span>
          </div>
          {msg.images?.map((_, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-2.5 flex items-center gap-2 mb-3 text-xs font-bold text-slate-700 shadow-xs">
              <Camera className="h-4 w-4 text-teal-600" />
              Ảnh tổn thương da đính kèm (sample-rash.jpg)
            </div>
          ))}
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-semibold whitespace-pre-wrap">{msg.content}</p>
        </div>
      ))}

      {/* CV bounding box overlay — shown when case has images + CV data */}
      {medCase.has_images && medCase.cv_analysis && (
        <CVImageOverlay cv={medCase.cv_analysis} />
      )}
    </div>
  );
}
