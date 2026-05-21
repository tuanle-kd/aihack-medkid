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
  Camera
} from 'lucide-react';

export function CaseDetail() {
  const selectedCaseId = useAppStore((s) => s.selectedCaseId);
  const cases = useAppStore((s) => s.cases);
  const selectCase = useAppStore((s) => s.selectCase);
  const approveCase = useAppStore((s) => s.approveCase);
  const rejectCase = useAppStore((s) => s.rejectCase);

  const medCase = cases.find((c) => c.id === selectedCaseId);
  const [draft, setDraft] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showDiff, setShowDiff] = useState(false);

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

  // Initialize draft when case changes
  if (draft === '' && medCase.ai_draft) {
    setDraft(medCase.ai_draft);
  }

  const handleResetDraft = () => {
    setDraft(medCase.ai_draft ?? '');
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-250 bg-white flex-shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-800 text-base">{medCase.patient_name}</h3>
            <Badge variant="outline" className="text-[10px] font-black uppercase text-teal-700 border-teal-200 bg-teal-50">
              {medCase.workflow_type.replace(/_/g, ' ')}
            </Badge>
          </div>
          <p className="text-[11px] text-slate-400 font-semibold mt-0.5 uppercase tracking-wide">
            Tuổi: {ageLabel(medCase.patient_age_months)} · Mã số: {medCase.id.slice(0, 8).toUpperCase()}
          </p>
        </div>
        <button
          onClick={() => selectCase(null)}
          className="text-slate-400 hover:text-red-500 text-lg w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Tabs Container */}
      <Tabs defaultValue="draft" className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 border-b border-slate-200 bg-white flex-shrink-0">
          <TabsList className="w-full justify-start gap-1 bg-slate-50 p-1">
            <TabsTrigger value="draft" className="flex-1 sm:flex-initial gap-1.5 py-2">
              <Sparkles className="h-3.5 w-3.5 text-teal-600" />
              Bản Nháp AI
            </TabsTrigger>
            <TabsTrigger value="patient" className="flex-1 sm:flex-initial gap-1.5 py-2">
              <FileText className="h-3.5 w-3.5 text-teal-600" />
              Hồ Sơ VCLINIC
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex-1 sm:flex-initial gap-1.5 py-2">
              <MessageSquare className="h-3.5 w-3.5 text-teal-600" />
              Triệu Chứng Đầu Vào
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab content area */}
        <div className="flex-1 overflow-y-auto">
          {/* Draft tab */}
          <TabsContent value="draft" className="p-6 m-0 space-y-4">
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
          <TabsContent value="patient" className="p-6 m-0 space-y-4">
            <PatientTabContent medCase={medCase} />
          </TabsContent>

          {/* Messages tab */}
          <TabsContent value="messages" className="p-6 m-0 space-y-4">
            <MessagesTabContent medCase={medCase} />
          </TabsContent>
        </div>
      </Tabs>

      {/* Action buttons */}
      {medCase.status === 'pending' && (
        <div className="flex gap-3 p-4 border-t border-slate-200 bg-white flex-shrink-0">
          <Button
            onClick={() => setShowRejectModal(true)}
            variant="outline"
            className="flex-1 font-bold text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
          >
            <X className="h-4 w-4 mr-1.5 text-red-500" />
            TỪ CHỐI DUYỆT CA
          </Button>
          <Button
            onClick={() => approveCase(medCase.id, draft)}
            variant="default"
            className="flex-[2] font-black tracking-wide bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-700/10"
          >
            <Check className="h-4 w-4 mr-1.5 text-white" />
            KÝ DUYỆT & GỬI PHỤ HUYNH
          </Button>
        </div>
      )}

      {/* Reject modal overlay */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs animate-fade-in-up">
          <div className="w-full max-w-sm mx-4 bg-white rounded-3xl p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center gap-2 mb-3 text-red-600">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <h4 className="font-bold text-slate-800 text-sm sm:text-base">Lý Do Từ Chối Duyệt Ca</h4>
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Vui lòng chọn lý do chính xác để hệ thống gửi phản hồi và hướng dẫn khám trực tiếp phù hợp về cho phụ huynh.
            </p>

            <select
              className="w-full border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium mb-4 bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-teal-600 transition-all"
              onChange={(e) => setRejectReason(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>-- Chọn lý do lâm sàng --</option>
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
      <div className="flex items-center justify-between bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200/50">
        <div className="flex items-center gap-3">
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
        <div className="flex gap-3">
          <button
            onClick={() => setShowDiff(!showDiff)}
            className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1 cursor-pointer"
          >
            {showDiff ? '✏️ Hiện ô sửa đổi' : '🔍 Xem Diff chi tiết'}
          </button>
          <button
            onClick={onReset}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 hover:underline flex items-center gap-1 cursor-pointer"
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
        <div className="relative">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            disabled={medCase.status !== 'pending'}
            className="w-full h-80 border border-teal-200/60 bg-teal-50/10 rounded-2xl px-4 py-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:bg-white focus:border-transparent transition-all leading-relaxed font-mono font-medium text-slate-800"
            placeholder="Viết hoặc hiệu chỉnh đơn thuốc/hướng dẫn chăm sóc lâm sàng..."
          />
          {medCase.status === 'pending' && (
            <span className="absolute bottom-3 right-4 text-[10px] font-bold text-slate-400 bg-white/80 px-2 py-0.5 rounded-md border border-slate-200/40">
              Bác sĩ soạn thảo tự do
            </span>
          )}
        </div>
      )}

      {/* CV skin analysis banner */}
      {medCase.cv_analysis && (
        <div className="border border-teal-100 bg-teal-50/20 rounded-2xl p-4 flex gap-3.5 items-start">
          <div className="bg-teal-100 p-2 rounded-xl text-teal-700">
            <Microscope className="h-5 w-5 text-teal-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-bold text-teal-950 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              Phân Tích Bounding-box Thị Giác Máy Tính (CV Analysis)
            </h4>
            <div className="grid grid-cols-3 gap-3 text-xs text-slate-600">
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
                📚 Tài liệu RAG đối chiếu chéo ({medCase.rag_snippets.length})
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
      <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 mb-3 bg-white p-2 rounded-xl border border-slate-150/40 w-fit">
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
            <span key={`add-${i}`} className="underline bg-emerald-50 text-emerald-700 px-1 rounded-sm border border-emerald-250/30 font-bold mx-0.5">
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
        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 text-lg mb-3 mx-auto border border-slate-200/50">
          ⚠️
        </div>
        <p className="font-bold text-slate-600">Đồng bộ EMR VCLINIC thất bại</p>
        <p className="text-slate-400 mt-0.5">Không tìm thấy mã SID y khoa của trẻ em trên hồ sơ liên thông.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Basic EMR cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
      <div className="grid sm:grid-cols-2 gap-4">
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
          <div className="overflow-hidden border border-slate-100 rounded-xl">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-150/40 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
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
          <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-teal-800 flex items-center gap-1">
              <span className="text-sm">👩‍👦</span>
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
    </div>
  );
}
