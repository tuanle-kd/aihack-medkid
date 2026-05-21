'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/app-store';
import { ConsentModal } from '@/components/shared/consent-modal';
import { ChatPanel } from '@/components/parent/chat-panel';
import { CaseQueue } from '@/components/doctor/case-queue';
import { CaseDetail } from '@/components/doctor/case-detail';
import { DebugConsole } from '@/components/shared/debug-console';

export default function Home() {
  const { isConsented, showDebugConsole, toggleDebugConsole } = useAppStore((s) => ({
    isConsented: s.isConsented,
    showDebugConsole: s.showDebugConsole,
    toggleDebugConsole: s.toggleDebugConsole,
  }));

  // Keyboard shortcut: Ctrl+Shift+D
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        toggleDebugConsole();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggleDebugConsole]);

  return (
    <main
      className={`flex flex-col bg-gray-100 ${showDebugConsole ? 'pb-52' : ''}`}
      style={{ height: '100dvh' }}
    >
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏥</span>
          <span className="font-bold text-gray-800 text-sm">MediKid-AI</span>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
            MVP Demo
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 hidden sm:block">Ctrl+Shift+D = Debug</span>
          <button
            onClick={toggleDebugConsole}
            className={`text-xs px-2 py-1 rounded font-mono transition-colors ${
              showDebugConsole
                ? 'bg-gray-900 text-green-400'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            ⚡ Debug
          </button>
        </div>
      </header>

      {/* Column labels */}
      <div className="grid grid-cols-2 flex-shrink-0 border-b border-gray-300">
        <div className="bg-blue-600 text-white text-xs font-semibold px-4 py-1.5 text-center">
          📱 Phụ huynh (Mobile View)
        </div>
        <div className="bg-gray-700 text-white text-xs font-semibold px-4 py-1.5 text-center">
          🖥️ Bác sĩ (Desktop View)
        </div>
      </div>

      {/* Split screen */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left — Parent (mobile-width) */}
        <div className="w-full max-w-sm border-r border-gray-300 bg-gray-50 flex flex-col flex-shrink-0">
          <ChatPanel />
        </div>

        {/* Right — Doctor */}
        <div className="flex-1 flex overflow-hidden bg-white min-w-0">
          {/* Queue panel */}
          <div className="w-64 border-r border-gray-200 overflow-y-auto flex-shrink-0">
            <CaseQueue />
          </div>
          {/* Detail panel */}
          <div className="flex-1 overflow-hidden">
            <CaseDetail />
          </div>
        </div>
      </div>

      {/* Overlays */}
      {!isConsented && <ConsentModal />}
      <DebugConsole />
    </main>
  );
}
