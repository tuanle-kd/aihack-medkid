'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/store/app-store';
import { MOCK_ASR_SAMPLES } from '@/mock/data';
import { formatTime } from '@/lib/utils';
import { EmergencyScreen } from '@/components/emergency/emergency-screen';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Mic, Camera, Send, X, ShieldCheck, HeartPulse, User } from 'lucide-react';

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
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* Header Mobile mockup styling */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-base">👶</span>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 leading-tight">Hồ sơ: Bé Gia Bảo</h3>
            <p className="text-[10px] text-slate-400 font-medium">Bảo hiểm KinderCare Active</p>
          </div>
        </div>
        <div className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full text-[10px] font-bold border border-teal-100/50">
          Phụ huynh View
        </div>
      </div>

      {/* Messages Scroll Area */}
      <ScrollArea className="flex-1 px-4 py-4">
        {chatMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-20 px-6">
            <div className="w-14 h-14 rounded-3xl bg-teal-50 flex items-center justify-center text-3xl mb-4 border border-teal-100/30 shadow-xs animate-bounce">
              👶
            </div>
            <h4 className="text-sm font-bold text-slate-700 mb-1">Bắt đầu chat tư vấn lâm sàng</h4>
            <p className="text-xs text-slate-500 max-w-[240px] leading-relaxed">
              Nhập các triệu chứng của bé như sốt, phát ban, ho hoặc nhấp vào giả lập để test nhanh.
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
                <div className="w-7 h-7 rounded-xl bg-teal-100 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                  👨‍⚕️
                </div>
              )}

              {msg.sender === 'system' ? (
                <div className="w-full text-center my-2">
                  <span className="inline-block bg-teal-50 text-teal-800 text-[10px] font-bold px-3 py-1 rounded-full border border-teal-100/30 shadow-xs">
                    ⚙️ {msg.content}
                  </span>
                </div>
              ) : (
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 shadow-xs transition-all duration-200 relative ${
                    msg.sender === 'parent'
                      ? 'bg-linear-to-tr from-teal-700 to-emerald-600 text-white rounded-tr-xs shadow-teal-700/10'
                      : 'bg-white text-slate-800 rounded-tl-xs border border-slate-200/50'
                  }`}
                >
                  {msg.sender === 'doctor' && (
                    <div className="flex items-center gap-1.5 text-[11px] text-teal-700 font-bold mb-1.5 pb-1.5 border-b border-slate-100">
                      <HeartPulse className="h-3 w-3 text-teal-600" />
                      Bác Sĩ Nhi Khoa KinderHealth
                    </div>
                  )}

                  {msg.images?.map((img, i) => (
                    <div key={i} className="mb-2 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center gap-2 px-2.5 py-1.5">
                      <Camera className="h-4 w-4 text-teal-600 flex-shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-[11px] font-bold text-slate-700 truncate">sample-rash.jpg</span>
                        <span className="text-[9px] text-slate-400">1.2 MB • Báo cáo phát ban da</span>
                      </div>
                    </div>
                  ))}

                  <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed font-medium">{msg.content}</p>

                  {msg.is_approved && (
                    <div className="flex items-center gap-1 text-[10px] text-emerald-600 mt-2 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100/30 w-fit">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                      Chữ ký số Bác sĩ lâm sàng
                    </div>
                  )}

                  {msg.disclaimer && (
                    <p className="text-[10px] text-slate-400 mt-2 border-t border-slate-100 pt-2 leading-relaxed italic font-normal">
                      ⚠️ {msg.disclaimer}
                    </p>
                  )}

                  <p className={`text-[9px] mt-1.5 text-right font-medium ${msg.sender === 'parent' ? 'text-teal-100' : 'text-slate-400'}`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              )}

              {msg.sender === 'parent' && (
                <div className="w-7 h-7 rounded-xl bg-slate-200 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                  <User className="h-4 w-4 text-slate-600" />
                </div>
              )}
            </div>
          ))}

          {/* Dynamic typing indicator with custom spring-bounce dot delay */}
          {isProcessing && (
            <div className="flex justify-start items-start gap-2">
              <div className="w-7 h-7 rounded-xl bg-teal-100 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                🤖
              </div>
              <div className="bg-white border border-slate-150 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs">
                <div className="flex gap-1.5 items-center h-2">
                  <div className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Voice ASR Waveform ripple simulator */}
      {isRecording && (
        <div className="bg-teal-50/80 backdrop-blur-xs border-t border-teal-100 px-4 py-4 flex flex-col items-center justify-center gap-2 animate-fade-in-up">
          <div className="flex items-center gap-1.5">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-xs font-bold text-teal-900 uppercase tracking-wider">Đang ghi âm tiếng Việt lâm sàng...</span>
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
        <div className="px-4 pb-2 pt-1 flex-shrink-0">
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2 animate-fade-in-up shadow-sm">
            <span className="text-lg">📷</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-emerald-800 truncate">sample-rash.jpg</p>
              <p className="text-[9px] text-emerald-500">Đã nạp vào EMR bệnh nhi</p>
            </div>
            <button
              onClick={() => setMockImage(null)}
              className="text-slate-400 hover:text-red-500 p-1 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Inputs Area */}
      <div className="border-t border-slate-200 bg-white px-4 py-3 flex-shrink-0">
        <div className="flex gap-2 mb-2">
          <button
            onClick={handleMockASR}
            disabled={isProcessing || isRecording}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Mic className="h-3.5 w-3.5 text-teal-600" />
            Giả lập Mic
          </button>
          <button
            onClick={handleMockCamera}
            disabled={isProcessing || !!mockImage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Camera className="h-3.5 w-3.5 text-teal-600" />
            Giả lập Camera
          </button>
        </div>

        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isProcessing || isRecording}
              placeholder="Mô tả triệu chứng của bé... (ví dụ: sốt cao, phát ban đỏ, ho nhiều)"
              className="w-full resize-none rounded-2xl border border-slate-250 bg-slate-50/50 px-3.5 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:bg-white focus:border-transparent transition-all disabled:opacity-50 max-h-24 leading-relaxed font-medium"
              rows={2}
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
            className="rounded-2xl h-10 w-10 bg-teal-700 hover:bg-teal-800 text-white flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
