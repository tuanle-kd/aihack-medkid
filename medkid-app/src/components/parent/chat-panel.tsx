'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/store/app-store';
import { MOCK_ASR_SAMPLES } from '@/mock/data';
import { formatTime } from '@/lib/utils';
import { EmergencyScreen } from '@/components/emergency/emergency-screen';

export function ChatPanel() {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mockImage, setMockImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { chatMessages, isProcessing, isEmergency, sendMessage } = useAppStore((s) => ({
    chatMessages: s.chatMessages,
    isProcessing: s.isProcessing,
    isEmergency: s.isEmergency,
    sendMessage: s.sendMessage,
  }));

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
    // Mock image as a colored placeholder
    setMockImage('/mock/sample-rash.jpg');
  };

  if (isEmergency) {
    return <EmergencyScreen />;
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
        {chatMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <span className="text-4xl mb-3">👶</span>
            <p className="text-gray-500 text-sm">
              Mô tả triệu chứng của bé để được bác sĩ tư vấn
            </p>
          </div>
        )}

        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'parent' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'system' ? (
              <div className="w-full text-center">
                <span className="inline-block bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                  {msg.content}
                </span>
              </div>
            ) : (
              <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 shadow-sm ${
                  msg.sender === 'parent'
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-white text-gray-800 rounded-bl-sm border border-gray-100'
                }`}
              >
                {msg.sender === 'doctor' && (
                  <p className="text-xs text-blue-600 font-medium mb-1">
                    👨‍⚕️ Bác sĩ KinderHealth
                  </p>
                )}
                {msg.images?.map((img, i) => (
                  <div key={i} className="mb-2 rounded-lg overflow-hidden bg-gray-100 flex items-center gap-2 px-2 py-1">
                    <span>📷</span>
                    <span className="text-xs text-gray-500">sample-rash.jpg • 1.2 MB</span>
                  </div>
                ))}
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                {msg.is_approved && (
                  <p className="text-xs text-green-600 mt-1 font-medium">✅ Được Bác sĩ kiểm duyệt</p>
                )}
                {msg.disclaimer && (
                  <p className="text-xs text-gray-400 mt-2 border-t border-gray-200 pt-2 leading-relaxed">
                    {msg.disclaimer}
                  </p>
                )}
                <p className={`text-xs mt-1 ${msg.sender === 'parent' ? 'text-blue-200' : 'text-gray-400'}`}>
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Image preview */}
      {mockImage && (
        <div className="px-3 pb-2">
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
            <span>📷</span>
            <span className="text-sm text-blue-700 flex-1">sample-rash.jpg</span>
            <button
              onClick={() => setMockImage(null)}
              className="text-gray-400 hover:text-gray-600 text-lg leading-none"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-gray-200 bg-white px-3 py-3">
        <div className="flex gap-2 mb-2">
          <button
            onClick={handleMockASR}
            disabled={isProcessing || isRecording}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {isRecording ? (
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse inline-block" />
            ) : (
              '🎤'
            )}
            {isRecording ? 'Đang ghi...' : 'Giả lập Mic'}
          </button>
          <button
            onClick={handleMockCamera}
            disabled={isProcessing || !!mockImage}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            📷 Giả lập Camera
          </button>
        </div>

        <div className="flex gap-2">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isProcessing}
              placeholder="Mô tả triệu chứng của con... (ví dụ: sốt, ho, phát ban)"
              className="w-full resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         disabled:bg-gray-50 disabled:text-gray-400 max-h-32"
              rows={2}
            />
            {input.length > 500 && (
              <span className="absolute bottom-1 right-2 text-xs text-gray-400">
                {input.length}/1000
              </span>
            )}
          </div>
          <button
            onClick={handleSend}
            disabled={input.trim().length < 5 || isProcessing}
            className="self-end px-4 py-2 rounded-xl bg-blue-600 text-white font-medium text-sm
                       disabled:bg-gray-300 disabled:cursor-not-allowed
                       enabled:hover:bg-blue-700 enabled:active:scale-95 transition-all"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
}
