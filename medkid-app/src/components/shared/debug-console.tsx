'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/app-store';
import { db } from '@/lib/mock-db';
import type { LogType } from '@/types';

const LOG_COLORS: Record<LogType, string> = {
  system: 'text-gray-200',
  feedback: 'text-green-400',
  tuning: 'text-yellow-400',
  ml: 'text-cyan-400',
  error: 'text-red-400',
};

export function DebugConsole() {
  const { showDebugConsole, debugLogs, toggleDebugConsole, refreshDebugLogs } = useAppStore((s) => ({
    showDebugConsole: s.showDebugConsole,
    debugLogs: s.debugLogs,
    toggleDebugConsole: s.toggleDebugConsole,
    refreshDebugLogs: s.refreshDebugLogs,
  }));

  // Refresh logs periodically when console is open
  useEffect(() => {
    if (!showDebugConsole) return;
    const interval = setInterval(refreshDebugLogs, 1000);
    return () => clearInterval(interval);
  }, [showDebugConsole, refreshDebugLogs]);

  if (!showDebugConsole) return null;

  const handleExport = () => {
    const text = debugLogs
      .map((l) => `[${l.timestamp}] [${l.type.toUpperCase()}] ${l.message}`)
      .join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medkid-debug-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 h-52 bg-gray-950 border-t-2 border-gray-700 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-gray-700 bg-gray-900">
        <div className="flex items-center gap-3">
          <span className="text-gray-300 text-xs font-mono font-bold">⚡ Debug Console</span>
          <span className="flex gap-2 text-xs">
            <span className="text-gray-200">■ system</span>
            <span className="text-green-400">■ feedback</span>
            <span className="text-yellow-400">■ tuning</span>
            <span className="text-cyan-400">■ ml</span>
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { db.debug.clear(); refreshDebugLogs(); }}
            className="text-xs text-gray-400 hover:text-gray-200 font-mono"
          >
            [Clear]
          </button>
          <button
            onClick={handleExport}
            className="text-xs text-gray-400 hover:text-gray-200 font-mono"
          >
            [Export TXT]
          </button>
          <button
            onClick={toggleDebugConsole}
            className="text-xs text-gray-400 hover:text-gray-200 font-mono"
          >
            [×]
          </button>
        </div>
      </div>

      {/* Logs */}
      <div className="flex-1 overflow-y-auto px-3 py-2 font-mono">
        {debugLogs.length === 0 && (
          <p className="text-gray-600 text-xs">Chưa có log nào...</p>
        )}
        {[...debugLogs].reverse().map((log) => (
          <div key={log.id} className="flex gap-2 text-xs leading-5">
            <span className="text-gray-600 flex-shrink-0">
              {new Date(log.timestamp).toISOString().slice(11, 23)}
            </span>
            {log.duration_ms !== undefined && (
              <span className="text-gray-500 flex-shrink-0">{log.duration_ms}ms</span>
            )}
            <span className={LOG_COLORS[log.type]}>{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
