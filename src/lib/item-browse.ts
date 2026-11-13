import { itemCategories } from "./item-form";

export type BrowseCategory = (typeof browseFilterCategories)[number];

/**
 * Filter chips shown on the Browse page: "All" plus the item categories the
 * chips were requested for. Kept here so the page and its tests agree.
 */
export const browseFilterCategories = [
  "all",
  "furniture",
  "clothes",
  "electronics",
  "books",
  "toys",
] as const;

export function browseCategoryLabel(value: BrowseCategory) {
  if (value === "all") return "All";
  return itemCategories.find((c) => c.value === value)?.label ?? value;
}

export interface FilterableItem {
  name: string;
  description: string;
  location: string;
  category: string;
}

/** Case-insensitive text match across name, description and location. */
export function matchesQuery(item: FilterableItem, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [item.name, item.description, item.location].some((field) =>
    field.toLowerCase().includes(q),
  );
}

export function filterItems<T extends FilterableItem>(
  items: T[],
  { query, category }: { query: string; category: BrowseCategory },
): T[] {
  return items.filter(
    (item) =>
      (category === "all" || item.category === category) && matchesQuery(item, query),
  );
}

export type CardAction = "mine" | "requested" | "request";

/** Which action a card's button shows: your own item, one you already asked for, or requestable. */
export function cardAction({
  isMine,
  isRequested,
}: {
  isMine: boolean;
  isRequested: boolean;
}): CardAction {
  if (isMine) return "mine";
  if (isRequested) return "requested";
  return "request";
}
