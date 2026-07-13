import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/return-policy")({
  component: () => (
    <LegalPage title="Return Policy" updated="July 2026" sections={[
      { h: "Returns window", p: "You can return unopened and unused products within 7 days of delivery for a full refund or replacement." },
      { h: "How to return", p: "Contact us at hello@stfresh.com with your order number to initiate a return. Our team will guide you through the pickup process." },
      { h: "Refunds", p: "Once your return is received and inspected, refunds are processed to your original payment method within 5–7 business days." },
      { h: "Non-returnable items", p: "For hygiene reasons, opened or used skincare products cannot be returned unless they arrived damaged or defective." },
    ]} />
  ),
  head: () => ({ meta: [{ title: "Return Policy — STfresh" }, { property: "og:url", content: "/return-policy" }], links: [{ rel: "canonical", href: "/return-policy" }] }),
});