import type { Cart } from "./cart";

export const TAX_RATE = 0.08;
export const FREE_SHIPPING_FROM = 50;
export const SHIPPING = 4.99;

export interface Receipt {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

const round = (n: number) => Math.round(n * 100) / 100;

export function checkout(cart: Cart): Receipt {
  const subtotal = round(cart.subtotal());
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING;
  const tax = round(subtotal * TAX_RATE);
  return { subtotal, shipping, tax, total: round(subtotal + shipping + tax) };
}
