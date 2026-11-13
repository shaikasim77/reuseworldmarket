import { describe, expect, it } from "vitest";
import {
  browseFilterCategories,
  cardAction,
  filterItems,
  matchesQuery,
} from "../lib/item-browse";

const items = [
  { name: "Wooden Chair", description: "Solid teak", location: "Tirupathi", category: "furniture" },
  { name: "Hand bag", description: "Gently used", location: "Tirupathi", category: "clothes" },
  { name: "Old Radio", description: "Needs repair", location: "VIZAG", category: "electronics" },
  { name: "Tamil Story Book", description: "Hardcover", location: "Vizag", category: "books" },
  { name: "Cycle", description: "Works well", location: "Hyderabad", category: "toys" },
  { name: "Sofa set", description: "Needs repair", location: "Chennai", category: "furniture" },
];

describe("browse filters", () => {
  it("offers exactly All plus the five requested category chips", () => {
    expect([...browseFilterCategories]).toEqual([
      "all",
      "furniture",
      "clothes",
      "electronics",
      "books",
      "toys",
    ]);
  });

  it("keeps only the selected category", () => {
    expect(
      filterItems(items, { query: "", category: "furniture" }).map((i) => i.name),
    ).toEqual(["Wooden Chair", "Sofa set"]);
  });

  it("searches name, description and location, ignoring case", () => {
    expect(filterItems(items, { query: "chair", category: "all" })).toHaveLength(1);
    expect(filterItems(items, { query: "needs repair", category: "all" })).toHaveLength(2);
    expect(filterItems(items, { query: "vizag", category: "all" })).toHaveLength(2);
    expect(
      matchesQuery(
        { name: "Wooden Chair", description: "Solid teak", location: "Tirupathi", category: "furniture" },
        "  TEAK  ",
      ),
    ).toBe(true);
  });

  it("combines the search box with the category chip", () => {
    expect(
      filterItems(items, { query: "repair", category: "furniture" }).map((i) => i.name),
    ).toEqual(["Sofa set"]);
    expect(filterItems(items, { query: "repair", category: "books" })).toHaveLength(0);
  });

  it("returns everything for an empty search on All", () => {
    expect(filterItems(items, { query: "   ", category: "all" })).toHaveLength(items.length);
  });

  it("shows your own item first, then a request you already sent, then the request button", () => {
    expect(cardAction({ isMine: true, isRequested: false })).toBe("mine");
    expect(cardAction({ isMine: true, isRequested: true })).toBe("mine");
    expect(cardAction({ isMine: false, isRequested: true })).toBe("requested");
    expect(cardAction({ isMine: false, isRequested: false })).toBe("request");
  });
});
