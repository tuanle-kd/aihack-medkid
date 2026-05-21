'use client';

import { useAppStore } from '@/store/app-store';
import { EMERGENCY_HOTLINE, isOfficeHours } from '@/lib/emergency';

export function EmergencyScreen() {
  const resetEmergency = useAppStore((s) => s.resetEmergency);
  const officeHours = isOfficeHours();

  return (
    <div
      className="flex flex-col items-center justify-center h-full p-6 text-white text-center"
      style={{
        background: '#C0392B',
        animation: 'pulse-bg 1s ease-in-out infinite alternate',
      }}
    >
      <style>{`
        @keyframes pulse-bg {
          from { background-color: #C0392B; }
          to { background-color: #E74C3C; }
        }
      `}</style>

      <div className="text-5xl mb-4">🚨</div>

      <h1 className="text-2xl font-black tracking-wide mb-2 uppercase">
        Cảnh báo nguy hiểm lâm sàng
      </h1>

      <p className="text-red-100 text-base font-bold mb-6 uppercase tracking-wider">
        Tuyệt đối không tự ý dùng thuốc
      </p>

      <div className="bg-white/10 rounded-xl p-4 mb-6 w-full max-w-xs">
        <p className="text-sm text-red-100 mb-1">Phát hiện triệu chứng nguy hiểm:</p>
        <p className="font-bold text-lg">Đưa trẻ đến cơ sở y tế ngay lập tức</p>
      </div>

      {officeHours ? (
        <button
          className="w-full max-w-xs py-4 bg-white text-red-700 font-black text-lg rounded-2xl
                     shadow-lg active:scale-95 transition-transform min-h-[64px]"
          onClick={() => {
            // In production: window.location.href = `tel:${EMERGENCY_HOTLINE}`
            alert(`[DEMO] Gọi hotline: ${EMERGENCY_HOTLINE}`);
          }}
        >
          📞 BẤM GỌI HOTLINE KINDERHEALTH CẤP CỨU NGAY
        </button>
      ) : (
        <div className="w-full max-w-xs">
          <div className="bg-white/20 rounded-xl p-4 mb-3">
            <p className="text-sm text-red-100 mb-1">Ngoài giờ hành chính (20:00–08:00)</p>
            <p className="font-bold text-base">
              ĐƯA TRẺ ĐẾN PHÒNG CẤP CỨU BỆNH VIỆN NHI GẦN NHẤT LẬP TỨC
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-xs text-red-100 mb-2">Bệnh viện gần nhất:</p>
            <div className="space-y-2 text-sm text-left">
              <div className="flex items-start gap-2">
                <span>📍</span>
                <div>
                  <p className="font-semibold">BV Nhi Đồng 1</p>
                  <p className="text-red-200 text-xs">341 Sư Vạn Hạnh, Q10, TP.HCM</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span>📍</span>
                <div>
                  <p className="font-semibold">BV Nhi Đồng 2</p>
                  <p className="text-red-200 text-xs">14 Lý Tự Trọng, Q1, TP.HCM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={resetEmergency}
        className="mt-6 text-sm text-red-200 underline"
      >
        Quay lại (chỉ dùng khi không còn nguy hiểm)
      </button>
    </div>
  );
}
