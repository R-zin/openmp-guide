export interface SearchItem {
  id: string;
  title: string;
  category: string;
  path: string;
  keywords: string;
  snippet: string;
}

export function searchIndex(items: SearchItem[], query: string): SearchItem[] {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return [];

  const tokens = cleanQuery.split(/\s+/).filter(Boolean);

  const scored = items.map((item) => {
    const titleLower = item.title.toLowerCase();
    const keywordsLower = item.keywords.toLowerCase();
    const snippetLower = item.snippet.toLowerCase();
    const categoryLower = item.category.toLowerCase();

    let score = 0;

    for (const token of tokens) {
      if (titleLower === token) {
        score += 100;
      } else if (titleLower.startsWith(token)) {
        score += 60;
      } else if (titleLower.includes(token)) {
        score += 40;
      } else if (keywordsLower.includes(token)) {
        score += 25;
      } else if (categoryLower.includes(token)) {
        score += 15;
      } else if (snippetLower.includes(token)) {
        score += 10;
      } else {
        // Token not matched anywhere
        return { item, score: 0 };
      }
    }

    return { item, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.item);
}
