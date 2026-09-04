import { Resend } from "resend";
import { getSettings } from "./settings";
import { formatPrice } from "./format";
import type { Order, OrderItem } from "@/lib/generated/prisma";

type OrderWithItems = Order & { items: OrderItem[] };

async function getResendClient(): Promise<{ client: Resend; from: string } | null> {
  const settings = await getSettings(["resend_api_key", "email_from", "order_emails_enabled"]);

  if (settings.order_emails_enabled === "false") return null;
  if (!settings.resend_api_key) return null;

  return { client: new Resend(settings.resend_api_key), from: settings.email_from };
}

function itemsToHtml(items: OrderItem[], currency: string): string {
  return items
    .map(
      (i) =>
        `<tr>
          <td style="padding:6px 0;">${i.nameSnapshot} × ${i.quantity}</td>
          <td style="padding:6px 0;text-align:right;">${formatPrice(i.priceCents * i.quantity, currency)}</td>
        </tr>`
    )
    .join("");
}

/**
 * Sends the order confirmation to the customer. Failures are logged but
 * never thrown — a broken email setting should never block checkout or
 * webhook processing, which is why callers just fire-and-forget this.
 */
export async function sendOrderConfirmationEmail(order: OrderWithItems): Promise<void> {
  try {
    const resend = await getResendClient();
    if (!resend || !order.email) return;

    await resend.client.emails.send({
      from: resend.from,
      to: order.email,
      subject: `Order confirmed — ${order.orderNumber}`,
      html: `
        <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;color:#1a1a1a;">
          <h1 style="font-size:22px;">Thank you for your order</h1>
          <p>Your order <strong>${order.orderNumber}</strong> has been confirmed.</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0;">
            ${itemsToHtml(order.items, order.currency)}
            <tr><td style="padding-top:10px;border-top:1px solid #ddd;">Shipping</td>
              <td style="padding-top:10px;border-top:1px solid #ddd;text-align:right;">${formatPrice(order.shippingCents, order.currency)}</td></tr>
            <tr><td style="padding-top:6px;font-weight:bold;">Total</td>
              <td style="padding-top:6px;text-align:right;font-weight:bold;">${formatPrice(order.totalCents, order.currency)}</td></tr>
          </table>
          <p><strong>Shipping to:</strong><br/>
          ${order.customerName || ""}<br/>
          ${order.shippingAddress1}${order.shippingAddress2 ? `, ${order.shippingAddress2}` : ""}<br/>
          ${order.shippingCity}${order.shippingState ? `, ${order.shippingState}` : ""} ${order.shippingPostalCode}<br/>
          ${order.shippingCountry}</p>
          <p style="color:#666;font-size:13px;margin-top:24px;">
            Questions about your order? Just reply to this email.
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send order confirmation email:", err);
  }
}

/**
 * Notifies the shop owner that a new paid order came in.
 */
export async function sendAdminOrderNotification(order: OrderWithItems): Promise<void> {
  try {
    const resend = await getResendClient();
    if (!resend) return;

    const { contact_email } = await getSettings(["contact_email"]);
    if (!contact_email) return;

    await resend.client.emails.send({
      from: resend.from,
      to: contact_email,
      subject: `New order — ${order.orderNumber} (${formatPrice(order.totalCents, order.currency)})`,
      html: `
        <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;color:#1a1a1a;">
          <h1 style="font-size:22px;">New paid order</h1>
          <p><strong>${order.orderNumber}</strong> — ${formatPrice(order.totalCents, order.currency)}</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0;">
            ${itemsToHtml(order.items, order.currency)}
          </table>
          <p><strong>Customer:</strong> ${order.customerName || "—"} (${order.email || "—"})</p>
          <p><strong>Ship to:</strong><br/>
          ${order.shippingAddress1}${order.shippingAddress2 ? `, ${order.shippingAddress2}` : ""}<br/>
          ${order.shippingCity}${order.shippingState ? `, ${order.shippingState}` : ""} ${order.shippingPostalCode}<br/>
          ${order.shippingCountry}</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send admin order notification email:", err);
  }
}
