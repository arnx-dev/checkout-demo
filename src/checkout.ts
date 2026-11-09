import type { Cart } from "./cart";

export const TAX_RATE = 0.08;
export const FREE_SHIPPING_FROM = 50;
export const SHIPPING = 4.99;

type Discount = { percent: number } | { amount: number };

export const DISCOUNT_CODES: Record<string, Discount> = {
  SAVE10: { percent: 10 },
  FLAT5: { amount: 5 },
  VIP80: { percent: 80 },
};

export interface Receipt {
  subtotal: number;
  codes: string[];
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

const round = (n: number) => Math.round(n * 100) / 100;

// A code counts once. Codes are matched without regard to case or spaces.
function normalizeCodes(codes: string[]): string[] {
  const applied: string[] = [];
  for (const raw of new Set(codes)) {
    const code = raw.trim().toUpperCase();
    if (!(code in DISCOUNT_CODES)) throw new Error(`unknown discount code: ${raw}`);
    applied.push(code);
  }
  return applied;
}

export function checkout(cart: Cart, codes: string[] = []): Receipt {
  const subtotal = round(cart.subtotal());
  const applied = normalizeCodes(codes);
  // Each code is computed against the original subtotal, in integer cents;
  // the total discount can never exceed the subtotal.
  const subtotalCents = Math.round(subtotal * 100);
  const rawCents = applied.reduce((sum, code) => {
    const d = DISCOUNT_CODES[code];
    return sum + ("percent" in d ? (subtotalCents * d.percent) / 100 : Math.round(d.amount * 100));
  }, 0);
  const discount = Math.round(Math.min(rawCents, subtotalCents)) / 100;
  const discounted = round(subtotal - discount);
  const shipping = subtotal === 0 || discounted >= FREE_SHIPPING_FROM ? 0 : SHIPPING;
  const tax = round(discounted * TAX_RATE);
  return {
    subtotal,
    codes: applied,
    discount,
    shipping,
    tax,
    total: round(discounted + shipping + tax),
  };
}
