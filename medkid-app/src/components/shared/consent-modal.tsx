'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';

export function ConsentModal() {
  const [checked, setChecked] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const grantConsent = useAppStore((s) => s.grantConsent);

  const handleConsent = async () => {
    setLoading(true);
    await grantConsent().catch(console.error);
    setLoading(false);
  };

  return (
    <Dialog open={true}>
      <DialogContent 
        className="sm:max-w-[480px] p-0 overflow-hidden border-teal-100/50 shadow-2xl bg-white animate-fade-in-up"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* Top header with clinical gradient */}
        <div className="bg-linear-to-r from-teal-700 to-emerald-600 px-6 py-6 text-white relative">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-md">
              <span className="text-3xl">🏥</span>
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
        <div className="px-6 py-5 space-y-4">
          <div className="flex gap-2 text-amber-600 bg-amber-50 p-3 rounded-2xl border border-amber-100">
            <ShieldAlert className="h-5 w-5 flex-shrink-0 mt-0.5 text-amber-500" />
            <div className="text-xs font-medium leading-relaxed">
              <strong>Nghị định 13/2023/NĐ-CP:</strong> Dữ liệu sức khỏe của con bạn được bảo vệ nghiêm ngặt. Vui lòng đọc kỹ và đồng thuận để bắt đầu tư vấn.
            </div>
          </div>

          <DialogDescription className="text-gray-600 text-sm leading-relaxed">
            Chúng tôi cam kết bảo mật tuyệt đối dữ liệu y tế nhạy cảm của bé. Dữ liệu này chỉ được sử dụng cho mục đích phân tích triệu chứng lâm sàng sơ bộ và hỗ trợ bác sĩ tư vấn chuyên khoa.
          </DialogDescription>

          {/* Accordion detail */}
          <div className="border border-teal-100/60 rounded-2xl overflow-hidden bg-teal-50/20">
            <button
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-teal-900 hover:bg-teal-50/50 transition-colors"
              onClick={() => setShowDetail((v) => !v)}
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
              <div className="px-4 pb-4 max-h-40 overflow-y-auto border-t border-teal-100/30 text-xs text-gray-600 space-y-3 pt-3">
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
          <label className="flex items-start gap-3 cursor-pointer group p-1 select-none">
            <div className="mt-0.5 relative">
              <input
                type="checkbox"
                id="consent-checkbox"
                className="peer sr-only"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
              />
              <div className="w-5 h-5 border-2 border-teal-200 rounded-lg bg-white peer-checked:bg-teal-600 peer-checked:border-teal-600 transition-all flex items-center justify-center group-hover:border-teal-400">
                <svg className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <span className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed group-hover:text-teal-900 transition-colors">
              Tôi xác nhận là người giám hộ hợp pháp và đồng ý cho phép xử lý dữ liệu sức khỏe của con theo Nghị định 13/2023/NĐ-CP.
            </span>
          </label>

          {/* CTA Button */}
          <Button
            disabled={!checked || loading}
            onClick={handleConsent}
            variant="default"
            size="lg"
            className="w-full text-base font-bold shadow-teal-700/20 shadow-lg"
          >
            {loading ? 'Đang xử lý...' : 'Đồng Ý & Bắt Đầu Tư Vấn'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
