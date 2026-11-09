import { describe, expect, it } from "vitest";
import { Cart } from "../src/cart";
import { checkout } from "../src/checkout";

const cartOf = (price: number, qty = 1) => {
  const c = new Cart();
  c.add({ sku: "x", name: "X", price, qty });
  return c;
};

describe("checkout", () => {
  it("charges shipping under $50", () => {
    expect(checkout(cartOf(20))).toEqual({ subtotal: 20, shipping: 4.99, tax: 1.6, total: 26.59 });
  });

  it("ships free from $50", () => {
    expect(checkout(cartOf(25, 2)).shipping).toBe(0);
  });

  it("an empty cart costs nothing", () => {
    expect(checkout(new Cart()).total).toBe(0);
  });

  it("rounds tax to cents", () => {
    expect(checkout(cartOf(9.99)).tax).toBe(0.8);
  });
});
