/** URL is the sole archive state; no cross-tab or cross-visit storage. */
export function parsePage(value: string | null): number {
  if (!value || !/^[1-9]\d*$/.test(value)) return 1;
  return Math.min(Number(value), Number.MAX_SAFE_INTEGER);
}

export function clampPage(page: number, total: number): number {
  return Math.max(1, Math.min(total, page));
}

export function parseCategory<T extends string>(value: string | null, categories: readonly T[]): T | 'all' {
  return categories.find((category) => category === value) ?? 'all';
}

export function listHref(page: number, category: string): string {
  const params = new URLSearchParams();
  if (page > 1) params.set('page', String(page));
  if (category !== 'all') params.set('category', category);
  return `/articles${params.size ? `?${params}` : ''}`;
}

export function safeReturnHref(value: string | null, categories: readonly string[]): string {
  if (!value || !/^\/articles(?:\?|$)/.test(value) || /[\\\u0000-\u001f]/.test(value)) return '/articles';
  const url = new URL(value, 'https://archive.invalid');
  if (url.pathname !== '/articles') return '/articles';
  return listHref(parsePage(url.searchParams.get('page')), parseCategory(url.searchParams.get('category'), categories));
}

export function pageWindow(page: number, total: number): (number | 'ellipsis-left' | 'ellipsis-right')[] {
  if (total <= 0) return [];
  const current = clampPage(page, total);
  const pages = [...new Set([1, current - 1, current, current + 1, total])]
    .filter((value) => value >= 1 && value <= total).sort((a, b) => a - b);
  const result: ReturnType<typeof pageWindow> = [];
  pages.forEach((value, index) => {
    if (index && value - pages[index - 1] > 1) result.push(value <= current ? 'ellipsis-left' : 'ellipsis-right');
    result.push(value);
  });
  return result;
}
