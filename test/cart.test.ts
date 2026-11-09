import { describe, expect, it } from "vitest";
import { Cart } from "../src/cart";

describe("Cart", () => {
  it("adds items and sums the subtotal", () => {
    const c = new Cart();
    c.add({ sku: "mug", name: "Mug", price: 12, qty: 2 });
    c.add({ sku: "tee", name: "T-shirt", price: 20, qty: 1 });
    expect(c.subtotal()).toBe(44);
  });

  it("merges the same sku", () => {
    const c = new Cart();
    c.add({ sku: "mug", name: "Mug", price: 12, qty: 1 });
    c.add({ sku: "mug", name: "Mug", price: 12, qty: 2 });
    expect(c.items).toHaveLength(1);
    expect(c.items[0]!.qty).toBe(3);
  });

  it("refuses a non-positive quantity", () => {
    expect(() => new Cart().add({ sku: "mug", name: "Mug", price: 12, qty: 0 })).toThrow();
  });

  it("removes an item", () => {
    const c = new Cart();
    c.add({ sku: "mug", name: "Mug", price: 12, qty: 1 });
    c.remove("mug");
    expect(c.subtotal()).toBe(0);
  });
});
