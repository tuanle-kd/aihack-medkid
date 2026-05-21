'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/app-store';

export function ConsentModal() {
  const [checked, setChecked] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const grantConsent = useAppStore((s) => s.grantConsent);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏥</span>
            <div>
              <h2 className="text-white text-lg font-bold">MediKid-AI</h2>
              <p className="text-blue-100 text-sm">Tư vấn nhi khoa từ xa</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <h3 className="text-gray-900 font-semibold text-base mb-2">
            Đồng thuận xử lý dữ liệu cá nhân
          </h3>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            Theo{' '}
            <strong>Nghị định 13/2023/NĐ-CP</strong> về bảo vệ dữ liệu cá nhân,
            chúng tôi cần sự đồng thuận của bạn trước khi xử lý thông tin sức khỏe
            của trẻ em.
          </p>

          {/* Accordion detail */}
          <div className="border border-gray-200 rounded-lg mb-4">
            <button
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setShowDetail((v) => !v)}
            >
              <span>Xem chi tiết điều khoản</span>
              <span className="text-gray-400">{showDetail ? '▲' : '▼'}</span>
            </button>

            {showDetail && (
              <div className="px-4 pb-4 max-h-48 overflow-y-auto border-t border-gray-100">
                <div className="text-sm text-gray-600 space-y-3 pt-3">
                  <div>
                    <p className="font-medium text-gray-800">Mục đích xử lý</p>
                    <p>Cung cấp dịch vụ tư vấn sức khỏe nhi khoa, hỗ trợ bác sĩ đưa ra khuyến nghị.</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Loại dữ liệu</p>
                    <p>Thông tin nhận dạng (họ tên, SĐT), hồ sơ sức khỏe trẻ em, ảnh tổn thương, nội dung hội thoại.</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Thời gian lưu trữ</p>
                    <p>Dữ liệu được lưu tối đa 5 năm hoặc đến khi bạn yêu cầu xóa.</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Quyền của bạn</p>
                    <p>Quyền truy cập, chỉnh sửa, xóa dữ liệu theo Điều 9, 11 Nghị định 13/2023/NĐ-CP.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer mb-5">
            <div className="mt-0.5">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-blue-600"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
              />
            </div>
            <span className="text-sm text-gray-700">
              Tôi đã đọc và đồng ý cho phép xử lý dữ liệu sức khỏe của con theo
              Nghị định 13/2023/NĐ-CP
            </span>
          </label>

          {/* CTA */}
          <button
            disabled={!checked}
            onClick={grantConsent}
            className="w-full py-3 rounded-xl font-semibold text-base transition-all duration-200
              disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed
              enabled:bg-blue-600 enabled:text-white enabled:hover:bg-blue-700 enabled:active:scale-95"
          >
            Bắt đầu tư vấn
          </button>
        </div>
      </div>
    </div>
  );
}
