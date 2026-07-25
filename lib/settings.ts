import { cache } from "react";
import { prisma } from "./db";
import { encrypt, decrypt } from "./crypto";

// Keys whose values are encrypted at rest because they are live credentials.
const ENCRYPTED_KEYS = new Set([
  "stripe_secret_key",
  "stripe_webhook_secret",
]);

// All settings the admin dashboard can read/write, with sane fallbacks so
// the site works before the admin has configured anything.
export const SETTING_DEFAULTS = {
  site_name: "Dracula's Soil",
  site_tagline: "Authentic soil from Transylvania",
  contact_email: "",
  support_phone: "",
  currency: "usd",
  shipping_flat_cents: "1500",
  free_shipping_threshold_cents: "10000",
  stripe_publishable_key: "",
  stripe_secret_key: "",
  stripe_webhook_secret: "",
  seo_default_title: "Dracula's Soil | Authentic Soil from Transylvania",
  seo_default_description:
    "Authentic soil collected near Bran Castle, Transylvania, Romania. Certificate of authenticity included. Free worldwide shipping.",
  og_image_url: "",
  google_site_verification: "",
  story_title: "The legend of the world's most famous vampire",
  story_text:
    "At the foot of the Carpathians, where fog gathers over centuries-old walls, lies the soil that inspired the legend of Dracula. Every jar is hand-collected near Bran Castle and carefully packaged for collectors, folklore enthusiasts, and lovers of Transylvanian mystery alike.",
} as const;

export type SettingKey = keyof typeof SETTING_DEFAULTS;

// Fetches every raw setting row once per request. React's cache() dedupes
// this across every call within the same render (root layout, site layout,
// page, etc. all previously triggered separate DB round-trips).
const getRawSettingsMap = cache(async (): Promise<Map<string, string>> => {
  const rows = await prisma.setting.findMany();
  return new Map(rows.map((r) => [r.key, r.value]));
});

function decryptIfNeeded(key: string, raw: string): string {
  if (!ENCRYPTED_KEYS.has(key) || !raw) return raw;
  try {
    return decrypt(raw);
  } catch {
    return "";
  }
}

export async function getSetting(key: SettingKey): Promise<string> {
  const map = await getRawSettingsMap();
  const raw = map.get(key);
  if (raw === undefined) return SETTING_DEFAULTS[key];
  return decryptIfNeeded(key, raw);
}

export async function getSettings(keys: SettingKey[]): Promise<Record<string, string>> {
  const map = await getRawSettingsMap();
  const result: Record<string, string> = {};
  for (const key of keys) {
    const raw = map.get(key);
    result[key] = raw === undefined ? SETTING_DEFAULTS[key] : decryptIfNeeded(key, raw);
  }
  return result;
}

export async function getAllSettings(): Promise<Record<string, string>> {
  return getSettings(Object.keys(SETTING_DEFAULTS) as SettingKey[]);
}

export async function setSetting(key: SettingKey, value: string): Promise<void> {
  const storedValue = ENCRYPTED_KEYS.has(key) && value ? encrypt(value) : value;
  await prisma.setting.upsert({
    where: { key },
    create: { key, value: storedValue },
    update: { value: storedValue },
  });
}

export async function setSettings(values: Partial<Record<SettingKey, string>>): Promise<void> {
  await Promise.all(
    Object.entries(values).map(([key, value]) => setSetting(key as SettingKey, value ?? ""))
  );
}

// Convenience: is Stripe configured enough to accept live payments?
export async function isStripeConfigured(): Promise<boolean> {
  const { stripe_secret_key, stripe_publishable_key } = await getSettings([
    "stripe_secret_key",
    "stripe_publishable_key",
  ]);
  return Boolean(stripe_secret_key && stripe_publishable_key);
}
