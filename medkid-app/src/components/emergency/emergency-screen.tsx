'use client';

import { useAppStore } from '@/store/app-store';
import { EMERGENCY_HOTLINE, isOfficeHours } from '@/lib/emergency';
import { Button } from '@/components/ui/button';
import { AlertOctagon, PhoneCall, MapPin, ArrowLeft } from 'lucide-react';

export function EmergencyScreen() {
  const resetEmergency = useAppStore((s) => s.resetEmergency);
  const officeHours = isOfficeHours();

  return (
    <div
      className="flex flex-col items-center justify-center h-full p-6 text-white text-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #7F1D1D 0%, #B91C1C 50%, #7F1D1D 100%)',
        animation: 'pulse-bg 2s ease-in-out infinite alternate',
      }}
    >
      {/* Decorative backing grid patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none" />

      <style>{`
        @keyframes pulse-bg {
          from { filter: brightness(0.9); }
          to { filter: brightness(1.1); }
        }
        @keyframes ripple-pulse {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(1.3); opacity: 0; }
        }
      `}</style>

      {/* Pulsing Emergency Alarm Ring */}
      <div className="relative mb-6 flex items-center justify-center">
        <span className="absolute inline-flex h-20 w-20 rounded-full bg-white/20" style={{ animation: 'ripple-pulse 2s infinite' }} />
        <span className="absolute inline-flex h-16 w-16 rounded-full bg-white/35" style={{ animation: 'ripple-pulse 2s infinite 0.5s' }} />
        <div className="relative z-10 w-14 h-14 rounded-full bg-white text-red-700 flex items-center justify-center shadow-2xl">
          <AlertOctagon className="h-8 w-8 animate-bounce text-red-600" />
        </div>
      </div>

      <h1 className="text-xl sm:text-2xl font-black tracking-tight mb-1 uppercase text-transparent bg-clip-text bg-linear-to-b from-white to-red-100">
        Cảnh Báo Nguy Hiểm Lâm Sàng
      </h1>

      <p className="text-[11px] font-bold text-red-200 uppercase tracking-widest bg-red-950/60 px-3 py-1 rounded-full border border-red-800/40 mb-6 shadow-inner">
        🚨 Tuyệt đối không tự ý dùng thuốc
      </p>

      {/* Main warning card */}
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 mb-6 w-full max-w-sm border border-white/10 shadow-2xl">
        <p className="text-xs text-red-200 mb-1 font-bold uppercase tracking-wider">Hệ thống phát hiện triệu chứng nguy kịch</p>
        <h3 className="font-extrabold text-base sm:text-lg text-white mb-2 leading-snug">ĐƯA TRẺ ĐẾN CƠ SỞ Y TẾ NGAY LẬP TỨC</h3>
        <p className="text-[11px] text-red-100/80 leading-relaxed font-medium">Triệu chứng của bé thuộc diện bypass khẩn cấp. Mọi hướng dẫn tư vấn AI đã được dừng để ưu tiên cấp cứu lâm sàng.</p>
      </div>

      {officeHours ? (
        <Button
          variant="secondary"
          size="lg"
          className="w-full max-w-sm py-6 bg-white hover:bg-red-50 text-red-800 font-extrabold text-base rounded-2xl shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2"
          onClick={() => {
            alert(`[DEMO] Gọi hotline cấp cứu nhi khoa KinderHealth: ${EMERGENCY_HOTLINE}`);
          }}
        >
          <PhoneCall className="h-5 w-5 animate-pulse text-red-600" />
          📞 BẤM GỌI CẤP CỨU NHI KHOA NGAY
        </Button>
      ) : (
        <div className="w-full max-w-sm space-y-3">
          <div className="bg-red-950/60 border border-red-800/30 rounded-2xl p-4 text-left">
            <p className="text-[10px] text-red-300 font-bold uppercase tracking-wider mb-1">⏰ Ngoài giờ hành chính (20:00 - 08:00)</p>
            <p className="text-xs font-semibold text-white leading-relaxed">
              Bạn hãy đưa bé tới ngay các khoa cấp cứu Nhi gần nhất của Thành phố:
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-left space-y-3 border border-white/5">
            <div className="flex items-start gap-2.5">
              <MapPin className="h-5 w-5 text-red-300 flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-white">Bệnh viện Nhi Đồng 1</p>
                <p className="text-[10px] text-red-200/90 leading-tight mt-0.5">341 Sư Vạn Hạnh, Phường 10, Quận 10, TP.HCM</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2.5 pt-2 border-t border-white/5">
              <MapPin className="h-5 w-5 text-red-300 flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-white">Bệnh viện Nhi Đồng 2</p>
                <p className="text-[10px] text-red-200/90 leading-tight mt-0.5">14 Lý Tự Trọng, Phường Bến Nghé, Quận 1, TP.HCM</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Return button */}
      <button
        onClick={resetEmergency}
        className="mt-6 text-xs text-red-200/80 hover:text-white underline font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-3 w-3" />
        Quay lại (Chỉ dùng khi không còn nguy hiểm lâm sàng)
      </button>
    </div>
  );
}
