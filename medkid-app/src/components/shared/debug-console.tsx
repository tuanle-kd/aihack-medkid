'use client';

import { useEffect, useState } from 'react';
import { useAppStore, clearDebugLogs } from '@/store/app-store';
import type { LogType } from '@/types';
import { 
  Sheet, 
  SheetContent, 
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet';
import { 
  Terminal, 
  Trash2, 
  Download, 
  Sliders, 
  MessageSquare, 
  BrainCircuit, 
  AlertCircle,
  FileCode,
  Settings,
  type LucideIcon
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

const LOG_METADATA: Record<LogType, { label: string; color: string; icon: LucideIcon; bg: string; border: string }> = {
  system: { 
    label: 'System', 
    color: 'text-gray-300', 
    bg: 'bg-gray-900/50', 
    border: 'border-gray-800',
    icon: Settings 
  },
  feedback: { 
    label: 'Doc Review', 
    color: 'text-emerald-400', 
    bg: 'bg-emerald-950/30', 
    border: 'border-emerald-900/50',
    icon: MessageSquare 
  },
  tuning: { 
    label: 'Fine-Tuning', 
    color: 'text-amber-400', 
    bg: 'bg-amber-950/30', 
    border: 'border-amber-900/50',
    icon: Sliders 
  },
  ml: { 
    label: 'AI & RAG', 
    color: 'text-cyan-400', 
    bg: 'bg-cyan-950/30', 
    border: 'border-cyan-900/50',
    icon: BrainCircuit 
  },
  error: { 
    label: 'Error', 
    color: 'text-rose-400', 
    bg: 'bg-rose-950/30', 
    border: 'border-rose-900/50',
    icon: AlertCircle 
  },
};

export function DebugConsole() {
  const showDebugConsole = useAppStore((s) => s.showDebugConsole);
  const debugLogs = useAppStore((s) => s.debugLogs);
  const toggleDebugConsole = useAppStore((s) => s.toggleDebugConsole);
  const refreshDebugLogs = useAppStore((s) => s.refreshDebugLogs);

  const [activeFilter, setActiveFilter] = useState<LogType | 'all'>('all');

  // Refresh logs periodically when console is open
  useEffect(() => {
    if (!showDebugConsole) return;
    refreshDebugLogs(); // Instant initial load
    const interval = setInterval(refreshDebugLogs, 1500);
    return () => clearInterval(interval);
  }, [showDebugConsole, refreshDebugLogs]);

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

  const filteredLogs = activeFilter === 'all' 
    ? debugLogs 
    : debugLogs.filter(l => l.type === activeFilter);

  return (
    <Sheet open={showDebugConsole} onOpenChange={(open) => { if (!open) toggleDebugConsole(); }}>
      <SheetContent 
        side="bottom" 
        className="h-[550px] p-0 bg-gray-950 border-t border-gray-800 flex flex-col focus:outline-hidden text-white"
      >
        {/* Header container */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 pt-5 pb-4 border-b border-gray-900 bg-gray-950/80 backdrop-blur-md">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-teal-950/50 border border-teal-900 rounded-lg text-teal-400">
                <Terminal className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <SheetTitle className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                  Technical Diagnostics & AI Pipeline Logs
                </SheetTitle>
                <SheetDescription className="text-xs text-gray-500 font-mono">
                  Real-time clinical RAG, reinforcement feedback, & mock telemetry
                </SheetDescription>
              </div>
            </div>
          </div>

          {/* Quick controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => { clearDebugLogs(); refreshDebugLogs(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-rose-400 border border-gray-900 hover:border-rose-950 hover:bg-rose-950/20 rounded-xl transition-all cursor-pointer font-mono font-medium"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear Console
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-cyan-400 border border-gray-900 hover:border-cyan-950 hover:bg-cyan-950/20 rounded-xl transition-all cursor-pointer font-mono font-medium"
            >
              <Download className="h-3.5 w-3.5" />
              Export .TXT
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="px-6 py-2 border-b border-gray-950 bg-gray-900/30 flex flex-wrap items-center gap-2">
          <span className="text-[10px] text-gray-600 font-mono font-bold uppercase tracking-wider mr-2">Filters:</span>
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 text-xs rounded-lg transition-all font-mono cursor-pointer border ${
              activeFilter === 'all' 
                ? 'bg-white/10 text-white border-gray-700' 
                : 'text-gray-400 border-transparent hover:text-white hover:bg-white/5'
            }`}
          >
            All Logs ({debugLogs.length})
          </button>
          {(Object.keys(LOG_METADATA) as LogType[]).map((type) => {
            const meta = LOG_METADATA[type];
            const count = debugLogs.filter(l => l.type === type).length;
            const Icon = meta.icon;
            const isSelected = activeFilter === type;

            return (
              <button
                key={type}
                onClick={() => setActiveFilter(type)}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg transition-all font-mono cursor-pointer border ${
                  isSelected 
                    ? `${meta.bg} ${meta.color} ${meta.border}` 
                    : 'text-gray-400 border-transparent hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {meta.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Console Logs Display Area */}
        <ScrollArea className="flex-1 px-6 py-4 bg-black/40">
          <div className="space-y-2.5 font-mono">
            {filteredLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
                <FileCode className="h-10 w-10 text-gray-800 stroke-[1.5]" />
                <p className="text-gray-600 text-xs max-w-md">
                  {activeFilter === 'all' 
                    ? 'No diagnostic telemetry has been captured yet.' 
                    : `No log entries found for Category: [${LOG_METADATA[activeFilter].label}]`}
                </p>
              </div>
            ) : (
              [...filteredLogs].reverse().map((log) => {
                const meta = LOG_METADATA[log.type];
                const Icon = meta.icon;
                
                return (
                  <div 
                    key={log.id} 
                    className={`group flex items-start gap-3 p-2.5 rounded-xl border transition-colors bg-gray-900/10 border-gray-950 hover:bg-gray-900/40`}
                  >
                    {/* Timestamp & Type Badge */}
                    <div className="flex flex-col gap-1 items-start min-w-[90px] flex-shrink-0">
                      <span className="text-[10px] text-gray-600 select-none">
                        {new Date(log.timestamp).toISOString().slice(11, 23)}
                      </span>
                      <div className={`flex items-center gap-1 text-[10px] font-bold ${meta.color}`}>
                        <Icon className="h-3 w-3" />
                        <span>{meta.label}</span>
                      </div>
                    </div>

                    {/* Latency if exists */}
                    {log.duration_ms !== undefined && (
                      <Badge className="bg-gray-900 border-gray-800 text-teal-400 font-mono text-[10px] py-0 px-1.5 flex-shrink-0 select-none">
                        {log.duration_ms}ms
                      </Badge>
                    )}

                    {/* Log Message */}
                    <div className="flex-1 text-xs leading-relaxed text-gray-300 select-all font-mono whitespace-pre-wrap break-all">
                      {log.message}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>

        {/* Footer info bar */}
        <div className="px-6 py-2 border-t border-gray-900 bg-gray-950 flex items-center justify-between text-[10px] text-gray-600 font-mono select-none">
          <div className="flex items-center gap-2">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Diagnostics Hub Active</span>
          </div>
          <div>
            <span>Radix Drawer v1.1 • Tailwind v4</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
