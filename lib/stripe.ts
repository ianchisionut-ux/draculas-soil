import Stripe from "stripe";
import { getSetting } from "./settings";

/**
 * Returns a Stripe client built from the secret key currently stored in the
 * admin settings (Settings > Payments in /admin). Throws a clear error if
 * the admin hasn't configured Stripe yet, so checkout fails loudly instead
 * of silently.
 */
export async function getStripeClient(): Promise<Stripe> {
  const secretKey = await getSetting("stripe_secret_key");
  if (!secretKey) {
    throw new Error(
      "Stripe is not configured. Add the secret key in /admin/settings/stripe."
    );
  }
  return new Stripe(secretKey);
}
