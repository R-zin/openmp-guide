'use client';

const STORAGE_KEY = 'parallel_prog_completed_topics';

export function getCompletedSlugs(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isPageCompleted(slug: string): boolean {
  const completed = getCompletedSlugs();
  return completed.includes(slug);
}

export function togglePageCompleted(slug: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const completed = getCompletedSlugs();
    let updated: string[];
    let isNowCompleted = false;
    if (completed.includes(slug)) {
      updated = completed.filter((s) => s !== slug);
      isNowCompleted = false;
    } else {
      updated = [...completed, slug];
      isNowCompleted = true;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('study-progress-updated', { detail: { slug, completed: isNowCompleted, all: updated } }));
    return isNowCompleted;
  } catch {
    return false;
  }
}
