"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { setSettings } from "@/lib/settings";

export type ActionState = { error?: string; success?: string } | null;

async function requireAdminSession() {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");
  return session.user.email as string;
}

export async function updateSiteSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireAdminSession();

    await setSettings({
      site_name: String(formData.get("site_name") || ""),
      site_tagline: String(formData.get("site_tagline") || ""),
      contact_email: String(formData.get("contact_email") || ""),
      support_phone: String(formData.get("support_phone") || ""),
      currency: String(formData.get("currency") || "usd"),
      shipping_flat_cents: String(
        Math.round(parseFloat(String(formData.get("shipping_flat") || "0")) * 100)
      ),
      free_shipping_threshold_cents: String(
        Math.round(parseFloat(String(formData.get("free_shipping_threshold") || "0")) * 100)
      ),
      seo_default_title: String(formData.get("seo_default_title") || ""),
      seo_default_description: String(formData.get("seo_default_description") || ""),
      og_image_url: String(formData.get("og_image_url") || ""),
      google_site_verification: String(formData.get("google_site_verification") || ""),
      story_title: String(formData.get("story_title") || ""),
      story_text: String(formData.get("story_text") || ""),
    });

    revalidatePath("/admin/settings");
    revalidatePath("/");
    return { success: "Settings saved." };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Something went wrong." };
  }
}

export async function updateStripeSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireAdminSession();

    const publishable = String(formData.get("stripe_publishable_key") || "").trim();
    const secret = String(formData.get("stripe_secret_key") || "").trim();
    const webhookSecret = String(formData.get("stripe_webhook_secret") || "").trim();

    const values: Record<string, string> = { stripe_publishable_key: publishable };
    // Only overwrite secret fields if the admin actually typed something new,
    // so re-saving the form doesn't blank out a key left masked/untouched.
    if (secret) values.stripe_secret_key = secret;
    if (webhookSecret) values.stripe_webhook_secret = webhookSecret;

    await setSettings(values);
    revalidatePath("/admin/settings/stripe");
    revalidatePath("/admin");
    return { success: "Stripe settings saved." };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Something went wrong." };
  }
}

export async function updateEmailSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireAdminSession();

    const apiKey = String(formData.get("resend_api_key") || "").trim();
    const emailFrom = String(formData.get("email_from") || "").trim();
    const enabled = formData.get("order_emails_enabled") === "on";

    const values: Record<string, string> = {
      email_from: emailFrom,
      order_emails_enabled: enabled ? "true" : "false",
    };
    // Only overwrite the API key if the admin actually typed a new one.
    if (apiKey) values.resend_api_key = apiKey;

    await setSettings(values);
    revalidatePath("/admin/settings/email");
    return { success: "Email settings saved." };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Something went wrong." };
  }
}

export async function changeAdminPassword(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const email = await requireAdminSession();

    const currentPassword = String(formData.get("currentPassword") || "");
    const newPassword = String(formData.get("newPassword") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (newPassword.length < 8) {
      return { error: "New password must be at least 8 characters." };
    }
    if (newPassword !== confirmPassword) {
      return { error: "New passwords do not match." };
    }

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) return { error: "Account not found." };

    const valid = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!valid) return { error: "Current password is incorrect." };

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.admin.update({ where: { id: admin.id }, data: { passwordHash } });

    return { success: "Password changed successfully." };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Something went wrong." };
  }
}
