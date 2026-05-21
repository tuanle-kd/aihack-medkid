'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, ShieldAlert, ChevronDown, ChevronUp, Stethoscope } from 'lucide-react';

export function ConsentModal() {
  const [checked, setChecked] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const grantConsent = useAppStore((s) => s.grantConsent);

  return (
    <Dialog open={true}>
      <DialogContent 
        className="max-h-[calc(100dvh-2rem)] overflow-hidden border-teal-100/50 bg-white p-0 shadow-2xl sm:max-w-[480px]"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* Top header with clinical gradient */}
        <div className="relative bg-linear-to-r from-teal-700 to-emerald-600 px-6 py-6 text-white">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/20 p-2.5 backdrop-blur-md">
              <Stethoscope className="h-7 w-7" />
            </div>
            <div>
              <DialogTitle className="text-white text-xl font-bold tracking-tight">MediKid-AI</DialogTitle>
              <p className="text-teal-100 text-xs mt-0.5 font-medium tracking-wide uppercase">
                Hệ Thống Tư Vấn Nhi Khoa Thông Minh
              </p>
            </div>
          </div>
        </div>

        {/* Modal body */}
        <div className="max-h-[calc(100dvh-11rem)] space-y-4 overflow-y-auto px-6 py-5">
          <div className="flex gap-2 rounded-2xl border border-amber-100 bg-amber-50 p-3 text-amber-700">
            <ShieldAlert className="h-5 w-5 flex-shrink-0 mt-0.5 text-amber-500" />
            <div className="text-xs font-medium leading-relaxed">
              <strong>Nghị định 13/2023/NĐ-CP:</strong> Dữ liệu sức khỏe của con bạn được bảo vệ nghiêm ngặt. Vui lòng đọc kỹ và đồng thuận để bắt đầu tư vấn.
            </div>
          </div>

          <DialogDescription className="text-sm leading-relaxed text-slate-600">
            Chúng tôi cam kết bảo mật tuyệt đối dữ liệu y tế nhạy cảm của bé. Dữ liệu này chỉ được sử dụng cho mục đích phân tích triệu chứng lâm sàng sơ bộ và hỗ trợ bác sĩ tư vấn chuyên khoa.
          </DialogDescription>

          {/* Accordion detail */}
          <div className="overflow-hidden rounded-2xl border border-teal-100/60 bg-teal-50/20">
            <button
              className="flex min-h-11 w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-teal-900 transition-colors hover:bg-teal-50/50"
              onClick={() => setShowDetail((v) => !v)}
              aria-expanded={showDetail}
            >
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-teal-600" />
                Xem chi tiết điều khoản y tế
              </span>
              <span className="text-teal-600">
                {showDetail ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </span>
            </button>

            {showDetail && (
              <div className="max-h-40 space-y-3 overflow-y-auto border-t border-teal-100/30 px-4 pb-4 pt-3 text-xs text-slate-600">
                <div>
                  <p className="font-bold text-teal-950">1. Mục đích xử lý dữ liệu</p>
                  <p className="mt-0.5 leading-relaxed">Hỗ trợ rà soát lịch sử dịch tễ, phân cấp mức độ lo âu của phụ huynh và nạp tri thức y tế RAG hỗ trợ phác đồ chẩn đoán lâm sàng của bác sĩ nhi khoa.</p>
                </div>
                <div>
                  <p className="font-bold text-teal-950">2. Các loại dữ liệu nhạy cảm thu thập</p>
                  <p className="mt-0.5 leading-relaxed">Họ tên bé, tuổi (tháng), giới tính, cân nặng, hình ảnh phát ban/tổn thương ngoài da, mô tả triệu chứng và log hội thoại y tế.</p>
                </div>
                <div>
                  <p className="font-bold text-teal-950">3. Thời hạn lưu trữ & Quyền lợi</p>
                  <p className="mt-0.5 leading-relaxed">Lưu giữ an toàn trong 5 năm trên hệ thống mã hóa dữ liệu đầu cuối. Phụ huynh có toàn quyền yêu cầu truy cập, chỉnh sửa hoặc xóa vĩnh viễn dữ liệu.</p>
                </div>
              </div>
            )}
          </div>

          {/* Custom Checkbox */}
          <label htmlFor="consent-checkbox" className="group flex cursor-pointer select-none items-start gap-3 rounded-xl p-2">
            <div className="mt-0.5 relative">
              <input
                type="checkbox"
                id="consent-checkbox"
                className="peer sr-only"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
              />
              <div className="flex h-6 w-6 items-center justify-center rounded-lg border-2 border-teal-200 bg-white transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-teal-600 peer-checked:border-teal-600 peer-checked:bg-teal-600 peer-checked:[&>svg]:opacity-100 group-hover:border-teal-400">
                <svg className="h-3.5 w-3.5 text-white opacity-0 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <span className="text-sm font-medium leading-relaxed text-slate-700 transition-colors group-hover:text-teal-900">
              Tôi xác nhận là người giám hộ hợp pháp và đồng ý cho phép xử lý dữ liệu sức khỏe của con theo Nghị định 13/2023/NĐ-CP.
            </span>
          </label>

          {/* CTA Button */}
          <Button
            disabled={!checked}
            onClick={grantConsent}
            variant="default"
            size="lg"
            className="w-full text-base font-bold shadow-teal-700/20 shadow-lg"
          >
            Đồng Ý & Bắt Đầu Tư Vấn
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
