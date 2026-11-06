export const SHIPPING_COUNTRIES = [
  "US", "CA", "MX", "GB", "IE", "RO", "DE", "FR", "IT", "ES", "PT",
  "NL", "BE", "LU", "AT", "CH", "SE", "NO", "DK", "FI", "IS",
  "PL", "CZ", "SK", "HU", "SI", "HR", "BG", "GR", "EE", "LV", "LT",
  "AU", "NZ", "JP", "KR", "SG", "HK", "TW", "MY", "TH", "PH", "ID", "VN", "IN",
  "AE", "SA", "IL", "TR", "ZA", "BR", "AR", "CL", "CO", "PE", "UY", "CR", "PA",
  "MT", "CY", "LI", "MC", "AD", "SM",
] as const;

export type ShippingCountry = (typeof SHIPPING_COUNTRIES)[number];

const EUROPE = new Set<string>([
  "GB", "IE", "RO", "DE", "FR", "IT", "ES", "PT", "NL", "BE", "LU", "AT",
  "CH", "SE", "NO", "DK", "FI", "IS", "PL", "CZ", "SK", "HU", "SI", "HR",
  "BG", "GR", "EE", "LV", "LT", "MT", "CY", "LI", "MC", "AD", "SM",
]);

export function shippingZone(country: ShippingCountry): "europe" | "australia" | "world" {
  if (country === "AU") return "australia";
  return EUROPE.has(country) ? "europe" : "world";
}

export function shippingCost(
  country: ShippingCountry,
  subtotalCents: number,
  settings: {
    shipping_flat_cents: string;
    free_shipping_threshold_cents: string;
    shipping_world_cents: string;
    shipping_australia_cents: string;
  }
): number | null {
  const zone = shippingZone(country);
  if (zone !== "europe") {
    const value = Number(zone === "australia" ? settings.shipping_australia_cents : settings.shipping_world_cents);
    return Number.isSafeInteger(value) && value > 0 ? value : null;
  }
  const flat = Number(settings.shipping_flat_cents);
  const threshold = Number(settings.free_shipping_threshold_cents);
  if (!Number.isSafeInteger(flat) || flat < 0 || !Number.isSafeInteger(threshold) || threshold < 0) return null;
  return threshold > 0 && subtotalCents >= threshold ? 0 : flat;
}
