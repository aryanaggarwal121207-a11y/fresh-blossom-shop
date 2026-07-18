import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/shipping-policy")({
  component: () => (
    <LegalPage title="Shipping Policy" updated="July 2026" sections={[
      { h: "Delivery time", p: "Standard delivery takes 4–6 business days. Orders are processed within 24 hours on business days." },
      { h: "Shipping charges", p: "Enjoy free standard shipping on all orders above ₹499. Orders below ₹499 carry a flat ₹49 shipping fee. Express delivery is available for an additional ₹79." },
      { h: "Order tracking", p: "Once your order ships, you'll receive a tracking number by email. You can also track your order anytime from the My Orders page in your account." },
      { h: "Serviceable areas", p: "We currently ship across India. Delivery to remote locations may take slightly longer." },
    ]} />
  ),
  head: () => ({ meta: [{ title: "Shipping Policy — STfresh" }, { property: "og:url", content: "/shipping-policy" }], links: [{ rel: "canonical", href: "/shipping-policy" }] }),
});
