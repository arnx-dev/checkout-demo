export interface Item {
  sku: string;
  name: string;
  price: number; // dollars
  qty: number;
}

export class Cart {
  readonly items: Item[] = [];

  add(item: Item): void {
    if (item.qty <= 0) throw new Error("quantity must be positive");
    const existing = this.items.find((i) => i.sku === item.sku);
    if (existing) existing.qty += item.qty;
    else this.items.push({ ...item });
  }

  remove(sku: string): void {
    const at = this.items.findIndex((i) => i.sku === sku);
    if (at >= 0) this.items.splice(at, 1);
  }

  subtotal(): number {
    return this.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  }
}
