import { z } from "zod";

export const itemCategories = [
  { value: "furniture", label: "Furniture" },
  { value: "clothes", label: "Clothes" },
  { value: "electronics", label: "Electronics" },
  { value: "books", label: "Books" },
  { value: "toys", label: "Toys" },
  { value: "other", label: "Other" },
] as const;

export const itemConditions = [
  { value: "new", label: "New" },
  { value: "like_new", label: "Like New" },
  { value: "used", label: "Used" },
  { value: "needs_repair", label: "Needs Repair" },
] as const;

export const itemFormSchema = z.object({
  name: z.string().trim().min(1, "Item name is required").max(100),
  category: z.enum(["furniture", "clothes", "electronics", "books", "toys", "other"], { message: "Pick a category" }),
  condition: z.enum(["new", "like_new", "used", "needs_repair"], { message: "Pick an item condition" }),
  description: z.string().trim().max(1000),
  location: z.string().trim().min(1, "Location is required").max(100),
});