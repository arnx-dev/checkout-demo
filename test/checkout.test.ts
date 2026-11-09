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
    expect(checkout(cartOf(20))).toEqual({
      subtotal: 20,
      codes: [],
      discount: 0,
      shipping: 4.99,
      tax: 1.6,
      total: 26.59,
    });
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

describe("discount codes", () => {
  it("SAVE10 takes 10% off the subtotal", () => {
    expect(checkout(cartOf(100), ["SAVE10"])).toEqual({
      subtotal: 100,
      codes: ["SAVE10"],
      discount: 10,
      shipping: 0,
      tax: 7.2,
      total: 97.2,
    });
  });

  it("FLAT5 takes $5 off", () => {
    const r = checkout(cartOf(20), ["FLAT5"]);
    expect(r.discount).toBe(5);
    expect(r.tax).toBe(1.2);
    expect(r.total).toBe(21.19);
  });

  it("VIP80 takes 80% off", () => {
    const r = checkout(cartOf(100), ["VIP80"]);
    expect(r.discount).toBe(80);
    expect(r.total).toBe(26.59);
  });

  it("stacks multiple codes", () => {
    const r = checkout(cartOf(100), ["SAVE10", "FLAT5"]);
    expect(r.codes).toEqual(["SAVE10", "FLAT5"]);
    expect(r.discount).toBe(15);
    expect(r.total).toBe(91.8);
  });

  it("is case-insensitive", () => {
    expect(checkout(cartOf(100), ["save10", " Flat5 "]).codes).toEqual(["SAVE10", "FLAT5"]);
  });

  it("applies the same code only once", () => {
    expect(checkout(cartOf(100), ["SAVE10", "SAVE10"]).discount).toBe(10);
  });

  it("never discounts more than the subtotal", () => {
    const r = checkout(cartOf(20), ["VIP80", "SAVE10", "FLAT5"]);
    expect(r.discount).toBe(20);
    expect(r.tax).toBe(0);
    expect(r.total).toBe(4.99);
  });

  it("free shipping is based on the discounted amount", () => {
    expect(checkout(cartOf(50), ["FLAT5"]).shipping).toBe(4.99);
  });

  it("rejects unknown codes", () => {
    expect(() => checkout(cartOf(20), ["BOGUS"])).toThrow(/unknown discount code/);
  });
});
