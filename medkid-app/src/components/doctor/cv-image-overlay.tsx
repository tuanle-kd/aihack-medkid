'use client';

import type { CVAnalysis } from '@/types';
import { Scan } from 'lucide-react';

// Mock image dimensions used when calculating bounding box percentages
const IMG_W = 640;
const IMG_H = 480;

const COLOR_LABELS: Record<NonNullable<CVAnalysis['dominant_color']>, string> = {
  red: 'Đỏ',
  pink: 'Hồng',
  brown: 'Nâu',
  yellow: 'Vàng',
  unknown: 'N/A',
};

const MORPHOLOGY_LABELS: Record<NonNullable<CVAnalysis['morphology']>, string> = {
  papule: 'Sẩn',
  plaque: 'Mảng',
  lesion: 'Tổn thương',
  blister: 'Bọng nước',
  unknown: 'N/A',
};

export function CVImageOverlay({ cv }: { cv: CVAnalysis }) {
  const bb = cv.bounding_box;

  // Convert pixel coords → percentages relative to the display container
  const boxStyle = bb
    ? {
        left: `${(bb.x / IMG_W) * 100}%`,
        top: `${(bb.y / IMG_H) * 100}%`,
        width: `${(bb.w / IMG_W) * 100}%`,
        height: `${(bb.h / IMG_H) * 100}%`,
      }
    : null;

  return (
    <div className="border border-teal-100 bg-teal-50/20 rounded-2xl p-4 space-y-3">
      <h4 className="text-xs font-bold text-teal-950 uppercase tracking-wider flex items-center gap-1.5">
        <Scan className="h-4 w-4 text-teal-600" />
        CV Overlay — Phân Tích Thị Giác Máy Tính
      </h4>

      {/* Image container with bounding box SVG overlay */}
      <div
        className="relative w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
        style={{ aspectRatio: `${IMG_W}/${IMG_H}` }}
      >
        {/* Placeholder medical image */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
          <div className="text-center text-slate-400">
            <div className="text-4xl mb-1">🩺</div>
            <p className="text-[10px] font-bold uppercase tracking-wider">sample-rash.jpg</p>
          </div>
        </div>

        {/* SVG bounding box overlay */}
        {boxStyle && (
          <>
            <div
              className="absolute border-2 border-red-500 rounded-sm"
              style={boxStyle}
            >
              {/* Corner markers */}
              <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-red-500 rounded-tl-sm" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-red-500 rounded-tr-sm" />
              <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-red-500 rounded-bl-sm" />
              <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-red-500 rounded-br-sm" />

              {/* Label badge */}
              <span className="absolute -top-5 left-0 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded whitespace-nowrap">
                {cv.morphology ? MORPHOLOGY_LABELS[cv.morphology] : 'Tổn thương'}
                {cv.area_cm2 ? ` · ${cv.area_cm2} cm²` : ''}
              </span>
            </div>

            {/* Confidence pulse dot */}
            <span
              className="absolute w-2 h-2 rounded-full bg-red-500 shadow-lg"
              style={{
                left: `calc(${boxStyle.left} + ${boxStyle.width} / 2 - 4px)`,
                top: `calc(${boxStyle.top} + ${boxStyle.height} / 2 - 4px)`,
                animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }}
            />
          </>
        )}

        {/* Scan lines overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,150,136,0.04) 3px, rgba(0,150,136,0.04) 4px)',
          }}
        />
      </div>

      {/* CV metadata chips */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <MetaChip label="Màu sắc" value={cv.dominant_color ? COLOR_LABELS[cv.dominant_color] : 'N/A'} />
        <MetaChip label="Hình thái" value={cv.morphology ? MORPHOLOGY_LABELS[cv.morphology] : 'N/A'} />
        <MetaChip label="Diện tích" value={cv.area_cm2 ? `${cv.area_cm2} cm²` : 'N/A'} />
      </div>

      {bb && (
        <p className="text-[10px] text-slate-400 font-mono">
          Bbox: x={bb.x} y={bb.y} w={bb.w} h={bb.h} px
        </p>
      )}
    </div>
  );
}

function MetaChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-2 text-center">
      <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">{label}</span>
      <strong className="block text-slate-800 mt-0.5">{value}</strong>
    </div>
  );
}
