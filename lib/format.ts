export function formatPrice(cents: number, currency: string = "usd"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

export function generateOrderNumber(): string {
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `DS-${rand}`;
}
