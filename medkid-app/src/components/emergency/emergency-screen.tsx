'use client';

import { useAppStore } from '@/store/app-store';
import { EMERGENCY_HOTLINE, isOfficeHours } from '@/lib/emergency';
import { Button } from '@/components/ui/button';
import { AlertOctagon, ArrowLeft, Hospital, Map, MapPin, Navigation, PhoneCall } from 'lucide-react';

const HOSPITALS = [
  {
    name: 'Bệnh viện Nhi Đồng 1',
    address: '341 Sư Vạn Hạnh, P.10, Q.10',
    phone: '(028) 3927 1119',
  },
  {
    name: 'Bệnh viện Nhi Đồng 2',
    address: '14 Lý Tự Trọng, P. Bến Nghé, Q.1',
    phone: '(028) 3829 5723',
  },
  {
    name: 'Bệnh viện Nhi Đồng Thành Phố',
    address: '15 Võ Trần Chí, Bình Chánh',
    phone: '(028) 3620 4888',
  },
  {
    name: 'Bệnh viện Từ Dũ (Khoa Sơ sinh)',
    address: '284 Cống Quỳnh, P. Phạm Ngũ Lão, Q.1',
    phone: '(028) 3839 5117',
  },
  {
    name: 'Bệnh viện Hùng Vương (Khoa Nhi)',
    address: '128 Hồng Bàng, P.12, Q.5',
    phone: '(028) 3855 4153',
  },
];

export function EmergencyScreen() {
  const resetEmergency = useAppStore((s) => s.resetEmergency);
  const officeHours = isOfficeHours();

  return (
    <div
      className="relative flex h-full flex-col items-center overflow-y-auto p-6 text-center text-white"
      style={{
        background: 'linear-gradient(135deg, #7F1D1D 0%, #B91C1C 50%, #7F1D1D 100%)',
        animation: 'pulse-bg 2s ease-in-out infinite alternate',
      }}
    >
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

      {/* Pulsing alarm ring */}
      <div className="relative mt-6 mb-4 flex items-center justify-center">
        <span className="absolute inline-flex h-20 w-20 rounded-full bg-white/20" style={{ animation: 'ripple-pulse 2s infinite' }} />
        <span className="absolute inline-flex h-16 w-16 rounded-full bg-white/35" style={{ animation: 'ripple-pulse 2s infinite 0.5s' }} />
        <div className="relative z-10 w-14 h-14 rounded-full bg-white text-red-700 flex items-center justify-center shadow-2xl">
          <AlertOctagon className="h-8 w-8 animate-bounce text-red-600" />
        </div>
      </div>

      <h1 className="text-xl sm:text-2xl font-black tracking-tight mb-1 uppercase text-transparent bg-clip-text bg-linear-to-b from-white to-red-100">
        Cảnh Báo Nguy Hiểm Lâm Sàng
      </h1>
      <p className="text-[11px] font-bold text-red-200 uppercase tracking-widest bg-red-950/60 px-3 py-1 rounded-full border border-red-800/40 mb-4 shadow-inner">
        Tuyệt đối không tự ý dùng thuốc
      </p>

      {/* Warning card */}
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 mb-4 w-full max-w-sm border border-white/10 shadow-2xl">
        <p className="text-xs text-red-200 mb-1 font-bold uppercase tracking-wider">Hệ thống phát hiện triệu chứng nguy kịch</p>
        <h3 className="font-extrabold text-base text-white mb-2 leading-snug">ĐƯA TRẺ ĐẾN CƠ SỞ Y TẾ NGAY LẬP TỨC</h3>
        <p className="text-[11px] text-red-100/80 leading-relaxed font-medium">
          Triệu chứng của bé thuộc diện bypass khẩn cấp. Mọi hướng dẫn tư vấn AI đã được dừng để ưu tiên cấp cứu lâm sàng.
        </p>
      </div>

      {/* Hotline 115 — always visible */}
      <a
        href="tel:115"
        className="mb-2 flex min-h-14 w-full max-w-sm items-center justify-center gap-2 rounded-2xl bg-white py-4 text-base font-extrabold text-red-800 shadow-xl transition-all hover:-translate-y-0.5 hover:bg-red-50 active:scale-95"
      >
        <PhoneCall className="h-5 w-5 animate-pulse text-red-600" />
        GỌI CẤP CỨU 115 NGAY
      </a>

      {/* KinderHealth hotline — only during office hours */}
      {officeHours && (
        <Button
          variant="secondary"
          className="w-full max-w-sm mb-4 py-3 bg-red-900/60 hover:bg-red-900/80 text-white border border-red-700/40 font-bold text-sm rounded-2xl"
          onClick={() => alert(`Hotline KinderHealth: ${EMERGENCY_HOTLINE}`)}
        >
          <PhoneCall className="h-4 w-4 mr-2" />
          Hotline KinderHealth: {EMERGENCY_HOTLINE}
        </Button>
      )}

      {/* After-hours: map panel with 2 nearest hospitals prominently */}
      {!officeHours && (
        <div className="w-full max-w-sm mb-4">
          <div className="bg-red-950/60 border border-red-800/30 rounded-2xl p-3 mb-2">
            <p className="flex items-center gap-2 text-[10px] text-red-300 font-bold uppercase tracking-wider">
              <Map className="h-3.5 w-3.5" />
              Ngoài giờ hành chính — Đến bệnh viện gần nhất
            </p>
          </div>
          {/* Mock map panel */}
          <div
            className="relative mb-3 h-36 w-full overflow-hidden rounded-2xl border border-red-900/40"
            style={{ background: 'radial-gradient(ellipse at 40% 50%, #1a3a2a 0%, #0d1f17 60%, #0a150e 100%)' }}
          >
            {/* Grid overlay simulating map tiles */}
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.07) 1px,transparent 1px)', backgroundSize: '32px 32px' }} />
            {/* Street lines */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-1/2 left-0 right-0 h-px bg-emerald-500/50" />
              <div className="absolute top-0 bottom-0 left-1/3 w-px bg-emerald-500/50" />
              <div className="absolute top-1/4 left-0 right-0 h-px bg-emerald-500/20 rotate-[-8deg]" />
            </div>
            {/* Pin 1 */}
            <div className="absolute top-[30%] left-[25%] flex flex-col items-center">
              <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-red-500 shadow-lg shadow-red-900/60 ring-2 ring-white/30">
                <MapPin className="h-4 w-4 text-white fill-white" />
              </div>
              <div className="mt-1 rounded-md bg-black/70 px-1.5 py-0.5 text-[9px] font-bold text-white whitespace-nowrap">Nhi Đồng 1</div>
            </div>
            {/* Pin 2 */}
            <div className="absolute top-[45%] left-[58%] flex flex-col items-center">
              <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-red-500 shadow-lg shadow-red-900/60 ring-2 ring-white/30">
                <MapPin className="h-4 w-4 text-white fill-white" />
              </div>
              <div className="mt-1 rounded-md bg-black/70 px-1.5 py-0.5 text-[9px] font-bold text-white whitespace-nowrap">Nhi Đồng 2</div>
            </div>
            {/* You are here dot */}
            <div className="absolute top-[55%] left-[42%] flex h-4 w-4 items-center justify-center rounded-full bg-blue-400 ring-2 ring-blue-200/50 shadow-md">
              <Navigation className="h-2.5 w-2.5 text-white fill-white" />
            </div>
            <div className="absolute bottom-2 right-2 rounded-md bg-black/50 px-2 py-0.5 text-[9px] font-bold text-slate-300">
              TP. Hồ Chí Minh
            </div>
          </div>
          {/* Nearest 2 hospitals CTA */}
          <div className="space-y-2">
            {HOSPITALS.slice(0, 2).map((h) => (
              <a
                key={h.name}
                href={`https://maps.google.com/maps?q=${encodeURIComponent(h.name + ' ' + h.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-3 text-left backdrop-blur-sm transition-colors hover:bg-white/15"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-700/60">
                  <Hospital className="h-4 w-4 text-red-200" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white leading-tight">{h.name}</p>
                  <p className="text-[10px] text-red-200/80 mt-0.5">{h.address}</p>
                </div>
                <MapPin className="h-4 w-4 shrink-0 text-red-300" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Hospital list — always visible */}
      <div className="w-full max-w-sm mb-4">
        <div className="bg-red-950/50 border border-red-800/30 rounded-2xl p-3 mb-2 text-left">
          <p className="flex items-center gap-2 text-[10px] text-red-300 font-bold uppercase tracking-wider">
            <Hospital className="h-3.5 w-3.5" />
            5 Bệnh viện Nhi TP.HCM — Cấp cứu 24/7
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden">
          {HOSPITALS.map((h, i) => (
            <div
              key={h.name}
              className={`flex items-start gap-2.5 p-3 text-left ${i < HOSPITALS.length - 1 ? 'border-b border-white/10' : ''}`}
            >
              <MapPin className="h-4 w-4 text-red-300 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white leading-tight">{h.name}</p>
                <p className="text-[10px] text-red-200/80 mt-0.5">{h.address}</p>
              </div>
              <a
                href={`tel:${h.phone.replace(/\D/g, '')}`}
                className="flex min-h-9 flex-shrink-0 items-center rounded-lg bg-red-900/50 px-2 py-1 text-[10px] font-bold text-red-200 transition-colors hover:bg-red-800/60"
              >
                {h.phone}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Return */}
      <button
        onClick={resetEmergency}
        className="mb-6 flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg text-xs font-semibold text-red-200/80 underline transition-colors hover:text-white"
      >
        <ArrowLeft className="h-3 w-3" />
        Quay lại (Chỉ dùng khi không còn nguy hiểm lâm sàng)
      </button>
    </div>
  );
}
