export const SHIPPING_COUNTRIES = [
  "US", "CA", "MX", "GB", "IE", "RO", "DE", "FR", "IT", "ES", "PT",
  "NL", "BE", "LU", "AT", "CH", "SE", "NO", "DK", "FI", "IS",
  "PL", "CZ", "SK", "HU", "SI", "HR", "BG", "GR", "EE", "LV", "LT",
  "AU", "NZ", "JP", "KR", "SG", "HK", "TW", "MY", "TH", "PH", "ID", "VN", "IN",
  "AE", "SA", "IL", "TR", "ZA", "BR", "AR", "CL", "CO", "PE", "UY", "CR", "PA",
  "MT", "CY", "LI", "MC", "AD", "SM",
] as const;

export type ShippingCountry = (typeof SHIPPING_COUNTRIES)[number];

export function shippingZone(country: ShippingCountry): "us" | "world" {
  return country === "US" ? "us" : "world";
}

export function shippingCost(
  country: ShippingCountry,
  subtotalCents: number,
  settings: {
    shipping_flat_cents: string;
    free_shipping_threshold_cents: string;
    shipping_world_cents: string;
  }
): number | null {
  const zone = shippingZone(country);
  if (zone === "world") {
    const value = Number(settings.shipping_world_cents);
    return Number.isSafeInteger(value) && value > 0 ? value : null;
  }

  const flat = Number(settings.shipping_flat_cents);
  const threshold = Number(settings.free_shipping_threshold_cents);
  if (!Number.isSafeInteger(flat) || flat < 0 || !Number.isSafeInteger(threshold) || threshold < 0) return null;
  if (threshold > 0 && subtotalCents >= threshold) return 0;
  return flat > 0 ? flat : null;
}
