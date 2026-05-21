'use client';

import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { Button } from '@/components/ui/button';
import { Clock, LogOut } from 'lucide-react';

const IDLE_MS = 4 * 60 * 60 * 1000;      // 4 giờ
const WARN_BEFORE_MS = 5 * 60 * 1000;     // cảnh báo trước 5 phút
const WARN_AT_MS = IDLE_MS - WARN_BEFORE_MS;

const ACTIVITY_EVENTS: (keyof WindowEventMap)[] = [
  'mousemove',
  'keydown',
  'click',
  'touchstart',
  'scroll',
];

export function IdleLogout() {
  const isConsented = useAppStore((s) => s.isConsented);
  const logout = useAppStore((s) => s.logout);

  const [showWarning, setShowWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(WARN_BEFORE_MS / 1000);

  const warnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoutTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = () => {
    if (warnTimer.current) clearTimeout(warnTimer.current);
    if (logoutTimer.current) clearTimeout(logoutTimer.current);
    if (countdownInterval.current) clearInterval(countdownInterval.current);
  };

  const startTimers = () => {
    clearTimers();

    warnTimer.current = setTimeout(() => {
      setShowWarning(true);
      setSecondsLeft(WARN_BEFORE_MS / 1000);

      countdownInterval.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            if (countdownInterval.current) clearInterval(countdownInterval.current);
            return 0;
          }
          return s - 1;
        });
      }, 1000);

      logoutTimer.current = setTimeout(() => {
        logout();
      }, WARN_BEFORE_MS);
    }, WARN_AT_MS);
  };

  const handleStayActive = () => {
    setShowWarning(false);
    startTimers();
  };

  useEffect(() => {
    if (!isConsented) return;

    startTimers();

    const onActivity = () => {
      if (!showWarning) startTimers();
    };

    ACTIVITY_EVENTS.forEach((ev) => window.addEventListener(ev, onActivity));
    return () => {
      clearTimers();
      ACTIVITY_EVENTS.forEach((ev) => window.removeEventListener(ev, onActivity));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConsented]);

  if (!isConsented || !showWarning) return null;

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timeLabel = mins > 0 ? `${mins}:${String(secs).padStart(2, '0')}` : `${secs}s`;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 ring-1 ring-amber-200">
          <Clock className="h-7 w-7 text-amber-500" />
        </div>
        <h3 className="text-base font-black text-slate-900 mb-1">Phiên làm việc sắp hết hạn</h3>
        <p className="text-sm text-slate-500 mb-4 leading-relaxed">
          Bạn không hoạt động trong <strong>gần 4 giờ</strong>. Hệ thống sẽ tự đăng xuất sau{' '}
          <span className="font-black text-amber-600">{timeLabel}</span> để bảo vệ dữ liệu bệnh nhi.
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 text-sm font-bold text-red-600 border-red-200 hover:bg-red-50"
            onClick={logout}
          >
            <LogOut className="h-4 w-4 mr-1.5" />
            Đăng xuất ngay
          </Button>
          <Button
            className="flex-[2] bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm"
            onClick={handleStayActive}
          >
            Tôi vẫn đang làm việc
          </Button>
        </div>
      </div>
    </div>
  );
}
