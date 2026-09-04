import Stripe from "stripe";
import { getSetting } from "./settings";

// Returns a Stripe client built from the secret key currently stored in the
// admin settings (Settings > Payments in /admin). Throws a clear error if
// the admin hasn't configured Stripe yet, so checkout fails loudly instead
// of silently.
export async function getStripeClient(): Promise<Stripe> {
  const secretKey = await getSetting("stripe_secret_key");
  if (!secretKey) {
    throw new Error(
      "Stripe is not configured. Add the secret key in /admin/settings/stripe."
    );
  }
  // Stripe's SDK defaults to an HTTP client built on node:https, which
  // doesn't exist on Cloudflare Workers -- every call (checkout.sessions.create
  // included) just hangs forever instead of erroring, which is exactly the
  // "Buy now" freeze this fixes. createFetchHttpClient() makes it use the
  // Fetch API instead, which Workers supports natively. This is OpenNext's
  // own documented fix for Stripe on Cloudflare Workers.
  return new Stripe(secretKey, { httpClient: Stripe.createFetchHttpClient() });
}
