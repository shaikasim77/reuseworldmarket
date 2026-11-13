import { describe, expect, it } from "vitest";
import { itemFormSchema } from "../lib/item-form";

const item = { name: "Chair", category: "furniture", condition: "used", description: "", location: "Hyderabad" };

describe("item posting options", () => {
  it("accepts exactly the six requested categories", () => {
    for (const category of ["furniture", "clothes", "electronics", "books", "toys", "other"]) {
      expect(itemFormSchema.safeParse({ ...item, category }).success).toBe(true);
    }
    expect(itemFormSchema.safeParse({ ...item, category: "vehicles" }).success).toBe(false);
  });
  it("accepts exactly the four requested conditions", () => {
    for (const condition of ["new", "like_new", "used", "needs_repair"]) {
      expect(itemFormSchema.safeParse({ ...item, condition }).success).toBe(true);
    }
    expect(itemFormSchema.safeParse({ ...item, condition: "" }).success).toBe(false);
    expect(itemFormSchema.safeParse({ ...item, condition: "damaged" }).success).toBe(false);
  });
  it("rejects blank names and locations and oversized text", () => {
    expect(itemFormSchema.safeParse({ ...item, name: " " }).success).toBe(false);
    expect(itemFormSchema.safeParse({ ...item, location: " " }).success).toBe(false);
    expect(itemFormSchema.safeParse({ ...item, name: "x".repeat(101) }).success).toBe(false);
    expect(itemFormSchema.safeParse({ ...item, description: "x".repeat(1001) }).success).toBe(false);
  });
});