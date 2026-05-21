'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/store/app-store';
import { MOCK_ASR_SAMPLES } from '@/mock/data';
import { formatTime } from '@/lib/utils';
import { EmergencyScreen } from '@/components/emergency/emergency-screen';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Baby, Bot, Camera, FileImage, HeartPulse, Mic, Send, ShieldCheck, Stethoscope, User, X } from 'lucide-react';

export function ChatPanel() {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mockImage, setMockImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatMessages = useAppStore((s) => s.chatMessages);
  const isProcessing = useAppStore((s) => s.isProcessing);
  const isEmergency = useAppStore((s) => s.isEmergency);
  const sendMessage = useAppStore((s) => s.sendMessage);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;
    const text = input.trim();
    const images = mockImage ? [mockImage] : undefined;
    setInput('');
    setMockImage(null);
    await sendMessage(text, images);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMockASR = () => {
    setIsRecording(true);
    setTimeout(() => {
      const sample = MOCK_ASR_SAMPLES[Math.floor(Math.random() * MOCK_ASR_SAMPLES.length)];
      setInput(sample);
      setIsRecording(false);
    }, 1500);
  };

  const handleMockCamera = () => {
    setMockImage('/mock/sample-rash.jpg');
  };

  if (isEmergency) {
    return <EmergencyScreen />;
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-slate-50/70">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="relative">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
              <Baby className="h-4 w-4" />
            </span>
            <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold leading-tight text-slate-800">Nguyễn Bảo Anh</h3>
            <p className="truncate text-[11px] font-medium text-slate-500">38 tháng · VC-2024-0815 · KinderCare Active</p>
          </div>
        </div>
        <div className="hidden shrink-0 rounded-full border border-teal-100 bg-teal-50 px-2.5 py-1 text-[10px] font-bold text-teal-700 sm:block">
          Đang được bảo vệ dữ liệu
        </div>
      </div>

      {/* Messages Scroll Area */}
      <ScrollArea className="flex-1 px-4 py-4">
        {chatMessages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center px-6 py-20 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-teal-100 bg-white text-teal-700 shadow-sm">
              <Stethoscope className="h-6 w-6" />
            </div>
            <h4 className="mb-1 text-sm font-bold text-slate-800">Bắt đầu phiên sàng lọc</h4>
            <p className="max-w-sm text-xs leading-relaxed text-slate-500">
              Mô tả triệu chứng, thời điểm khởi phát, nhiệt độ và ảnh liên quan nếu có.
              Ca cần bác sĩ xem sẽ được chuyển sang hàng đợi duyệt.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2 ${msg.sender === 'parent' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender !== 'parent' && msg.sender !== 'system' && (
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                  <Stethoscope className="h-3.5 w-3.5" />
                </div>
              )}

              {msg.sender === 'system' ? (
                <div className="my-2 w-full text-center">
                  <span className="inline-block rounded-full border border-teal-100/30 bg-teal-50 px-3 py-1 text-[10px] font-bold text-teal-800 shadow-xs">
                    {msg.content}
                  </span>
                </div>
              ) : (
                <div
                  className={`relative max-w-[88%] rounded-2xl px-3.5 py-2.5 shadow-xs transition-all duration-200 sm:max-w-[82%] ${
                    msg.sender === 'parent'
                      ? 'rounded-tr-sm bg-linear-to-tr from-teal-700 to-emerald-600 text-white shadow-teal-700/10'
                      : 'rounded-tl-sm border border-slate-200/50 bg-white text-slate-800'
                  }`}
                >
                  {msg.sender === 'doctor' && (
                    <div className="mb-1.5 flex items-center gap-1.5 border-b border-slate-100 pb-1.5 text-[11px] font-bold text-teal-700">
                      <HeartPulse className="h-3 w-3 text-teal-600" />
                      Bác Sĩ Nhi Khoa KinderHealth
                    </div>
                  )}

                  {msg.images?.map((img, i) => (
                    <div key={i} className="mb-2 flex min-h-11 items-center gap-2 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 px-2.5 py-1.5">
                      <Camera className="h-4 w-4 flex-shrink-0 text-teal-600" />
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate text-[11px] font-bold text-slate-700">sample-rash.jpg</span>
                        <span className="text-[9px] text-slate-400">1.2 MB • Báo cáo phát ban da</span>
                      </div>
                    </div>
                  ))}

                  <p className="whitespace-pre-wrap text-sm font-medium leading-relaxed">{msg.content}</p>

                  {msg.is_approved && (
                    <div className="mt-2 flex w-fit items-center gap-1 rounded-md border border-emerald-100/30 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                      Chữ ký số Bác sĩ lâm sàng
                    </div>
                  )}

                  {msg.disclaimer && (
                    <p className="mt-2 border-t border-slate-100 pt-2 text-[10px] font-normal italic leading-relaxed text-slate-400">
                      {msg.disclaimer}
                    </p>
                  )}

                  <p className={`mt-1.5 text-right text-[9px] font-medium ${msg.sender === 'parent' ? 'text-teal-100' : 'text-slate-400'}`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              )}

              {msg.sender === 'parent' && (
                <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl bg-slate-200 text-xs">
                  <User className="h-4 w-4 text-slate-600" />
                </div>
              )}
            </div>
          ))}

          {/* Dynamic typing indicator with custom spring-bounce dot delay */}
          {isProcessing && (
            <div className="flex items-start justify-start gap-2">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                <Bot className="h-3.5 w-3.5" />
              </div>
              <div className="rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-4 py-3 shadow-xs">
                <div className="flex h-2 items-center gap-1.5">
                  <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-600" style={{ animationDelay: '0ms' }} />
                  <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-600" style={{ animationDelay: '150ms' }} />
                  <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-600" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Voice ASR Waveform ripple simulator */}
      {isRecording && (
        <div className="flex animate-fade-in-up flex-col items-center justify-center gap-2 border-t border-teal-100 bg-teal-50/80 px-4 py-4 backdrop-blur-xs">
          <div className="flex items-center gap-1.5">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-900">Đang ghi nhận mô tả triệu chứng...</span>
          </div>
          <div className="flex items-center gap-1 h-8">
            <div className="w-1 bg-teal-500 rounded-full h-3 animate-pulse" />
            <div className="w-1 bg-teal-600 rounded-full h-6 animate-pulse" style={{ animationDelay: '100ms' }} />
            <div className="w-1 bg-teal-700 rounded-full h-4 animate-pulse" style={{ animationDelay: '200ms' }} />
            <div className="w-1 bg-teal-800 rounded-full h-8 animate-pulse" style={{ animationDelay: '300ms' }} />
            <div className="w-1 bg-teal-700 rounded-full h-5 animate-pulse" style={{ animationDelay: '400ms' }} />
            <div className="w-1 bg-teal-600 rounded-full h-7 animate-pulse" style={{ animationDelay: '500ms' }} />
            <div className="w-1 bg-teal-500 rounded-full h-3 animate-pulse" style={{ animationDelay: '600ms' }} />
          </div>
        </div>
      )}

      {/* Image Upload Thumbnail Preview */}
      {mockImage && (
        <div className="flex-shrink-0 px-4 pb-2 pt-1">
          <div className="flex min-h-11 animate-fade-in-up items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 shadow-sm">
            <FileImage className="h-4 w-4 shrink-0 text-emerald-700" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-emerald-800">sample-rash.jpg</p>
              <p className="text-[9px] text-emerald-600">Đã đính kèm vào phiên tư vấn</p>
            </div>
            <button
              onClick={() => setMockImage(null)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-red-500"
              aria-label="Gỡ ảnh đính kèm"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Inputs Area */}
      <div className="flex-shrink-0 border-t border-slate-200 bg-white px-4 py-3">
        <div className="mb-2 flex flex-wrap gap-2">
          <button
            onClick={handleMockASR}
            disabled={isProcessing || isRecording}
            className="flex min-h-11 items-center gap-1.5 rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 transition-all hover:bg-slate-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Mic className="h-3.5 w-3.5 text-teal-600" />
            Nhập bằng giọng nói
          </button>
          <button
            onClick={handleMockCamera}
            disabled={isProcessing || !!mockImage}
            className="flex min-h-11 items-center gap-1.5 rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 transition-all hover:bg-slate-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Camera className="h-3.5 w-3.5 text-teal-600" />
            Đính kèm ảnh
          </button>
        </div>

        <div className="flex items-end gap-2">
          <div className="relative flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isProcessing || isRecording}
              placeholder="Mô tả triệu chứng của bé... (ví dụ: sốt cao, phát ban đỏ, ho nhiều)"
              className="max-h-24 min-h-12 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/50 px-3.5 py-3 text-base font-medium leading-relaxed transition-all focus:border-transparent focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-600 disabled:opacity-50 sm:text-sm"
              rows={2}
              aria-label="Mô tả triệu chứng của bé"
            />
            {input.length > 500 && (
              <span className="absolute bottom-2 right-3 text-[10px] font-bold text-slate-400">
                {input.length}/1000
              </span>
            )}
          </div>
          <Button
            onClick={handleSend}
            disabled={input.trim().length < 5 || isProcessing || isRecording}
            variant="default"
            size="icon"
            className="h-12 w-12 flex-shrink-0 rounded-2xl bg-teal-700 text-white hover:bg-teal-800"
            aria-label="Gửi mô tả triệu chứng"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
