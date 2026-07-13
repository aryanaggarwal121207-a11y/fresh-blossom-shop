/**
 * Transactional email templates (provider-agnostic).
 * Return { subject, html } — plug into any mailer / edge function later.
 */
const brandWrap = (title: string, body: string) => `
<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;background:#ffffff;border:1px solid #e6efe8;border-radius:16px;overflow:hidden">
  <div style="background:#2f7d4f;padding:24px 32px;color:#fff">
    <h1 style="margin:0;font-size:22px">STfresh</h1>
  </div>
  <div style="padding:32px">
    <h2 style="color:#20402e;margin-top:0">${title}</h2>
    ${body}
  </div>
  <div style="padding:20px 32px;background:#f3faf5;color:#5a6b5f;font-size:12px">
    © ${new Date().getFullYear()} STfresh · Natural skincare, delivered fresh.
  </div>
</div>`;

export function welcomeEmail(name: string) {
  return {
    subject: "Welcome to STfresh 🌿",
    html: brandWrap(
      `Welcome, ${name || "friend"}!`,
      `<p style="color:#42524a;line-height:1.6">Your STfresh account is ready. Discover natural skincare crafted with rose, aloe vera and papaya — for skin that glows.</p>
       <p><a href="#" style="background:#2f7d4f;color:#fff;padding:12px 22px;border-radius:10px;text-decoration:none">Start shopping</a></p>`,
    ),
  };
}

export function orderConfirmationEmail(orderNumber: string, total: string) {
  return {
    subject: `Order confirmed · ${orderNumber}`,
    html: brandWrap(
      "Thank you for your order!",
      `<p style="color:#42524a;line-height:1.6">We've received your order <strong>${orderNumber}</strong> for <strong>${total}</strong>. We'll notify you when it ships.</p>`,
    ),
  };
}

export function passwordResetEmail(link: string) {
  return {
    subject: "Reset your STfresh password",
    html: brandWrap(
      "Password reset",
      `<p style="color:#42524a;line-height:1.6">Click below to set a new password. If you didn't request this, you can ignore this email.</p>
       <p><a href="${link}" style="background:#2f7d4f;color:#fff;padding:12px 22px;border-radius:10px;text-decoration:none">Reset password</a></p>`,
    ),
  };
}

export function shipmentConfirmationEmail(orderNumber: string, tracking: string) {
  return {
    subject: `Your order ${orderNumber} has shipped 🚚`,
    html: brandWrap(
      "On its way!",
      `<p style="color:#42524a;line-height:1.6">Great news — order <strong>${orderNumber}</strong> is on the way. Tracking number: <strong>${tracking}</strong>.</p>`,
    ),
  };
}