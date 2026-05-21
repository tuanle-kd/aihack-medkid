import { EMERGENCY_KEYWORDS } from '@/mock/data';

/**
 * Chuẩn hóa chuỗi: lowercase, bỏ dấu tiếng Việt
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
}

/**
 * Levenshtein distance (dùng cho fuzzy match từ dài > 5 ký tự)
 */
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

/**
 * Kiểm tra văn bản có chứa từ khóa khẩn cấp không.
 * Trả về { triggered: boolean, matched: string[] }
 */
export function checkEmergency(text: string): { triggered: boolean; matched: string[] } {
  const normalized = normalize(text);
  const matched: string[] = [];

  for (const kw of EMERGENCY_KEYWORDS) {
    const normalizedKw = normalize(kw);

    // Exact match
    if (normalized.includes(normalizedKw)) {
      matched.push(kw);
      continue;
    }

    // Fuzzy match cho từ > 5 ký tự
    if (normalizedKw.length > 5) {
      const words = normalized.split(/\s+/);
      for (const word of words) {
        if (Math.abs(word.length - normalizedKw.length) <= 2) {
          if (levenshtein(word, normalizedKw) <= 1) {
            matched.push(kw);
            break;
          }
        }
      }
    }
  }

  return { triggered: matched.length > 0, matched };
}

export const EMERGENCY_HOTLINE = '1900 599 927';
export const OFFICE_HOURS = { open: 8, close: 20 }; // 08:00–20:00

export function isOfficeHours(): boolean {
  const now = new Date();
  // Timezone: Asia/Ho_Chi_Minh
  const vnTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
  const h = vnTime.getHours();
  return h >= OFFICE_HOURS.open && h < OFFICE_HOURS.close;
}
