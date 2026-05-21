import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(isoString: string): string {
  const diff = (Date.now() - new Date(isoString).getTime()) / 1000;
  if (diff < 60) return 'vừa xong';
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return `${Math.floor(diff / 86400)} ngày trước`;
}

export function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ageLabel(months: number): string {
  if (months < 24) return `${months} tháng tuổi`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  return rem > 0 ? `${years} tuổi ${rem} tháng` : `${years} tuổi`;
}
