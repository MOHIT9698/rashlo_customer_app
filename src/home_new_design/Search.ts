// import { categories, Category, CategoryItem } from '../data/rashanCategories';

import { categories, Category, CategoryItem } from "./Rashancategories";

export interface SearchResult {
  item: CategoryItem;
  category: Category;
}

// Lowercase, strip punctuation, collapse spaces — so "Oil & Ghee", "oil ghee"
// and "OIL  GHEE" all behave the same. Devanagari characters are kept.
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\u0900-\u097f\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function searchCatalog(query: string): SearchResult[] {
  const q = normalize(query);
  if (!q) return [];
  const tokens = q.split(' ');

  const scored: { result: SearchResult; score: number }[] = [];

  for (const category of categories) {
    const categoryName = normalize(category.name);
    for (const item of category.items) {
      const name = normalize(item.name);
      const hindi = normalize(item.hindiName ?? '');
      const brands = normalize((item.commonBrands ?? []).join(' '));
      const haystack = `${name} ${hindi} ${brands} ${categoryName}`;

      // Every typed word must appear somewhere ("mustard oil fortune" narrows down)
      if (!tokens.every((t) => haystack.includes(t))) continue;

      // Lower score = better match
      let score = 3;
      if (name.startsWith(q)) score = 0;
      else if (name.includes(q)) score = 1;
      else if (hindi.includes(q)) score = 2;

      scored.push({ result: { item, category }, score });
    }
  }

  return scored
    .sort((a, b) => a.score - b.score || a.result.item.name.localeCompare(b.result.item.name))
    .map((s) => s.result);
}

export function searchCategories(query: string): Category[] {
  const q = normalize(query);
  if (!q) return [];
  return categories.filter((c) => normalize(c.name).includes(q));
}

export function getPopularItems(limit = 10): SearchResult[] {
  const popular: SearchResult[] = [];
  for (const category of categories) {
    for (const item of category.items) {
      if (item.popular) popular.push({ item, category });
    }
  }
  return popular.slice(0, limit);
}