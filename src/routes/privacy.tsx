import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/privacy")({
  component: () => (
    <LegalPage title="Privacy Policy" updated="July 2026" sections={[
      { h: "Information we collect", p: "We collect information you provide when creating an account, placing an order or contacting us — including your name, email, phone number and shipping address." },
      { h: "How we use your information", p: "Your information is used to process orders, provide customer support, improve our products and, with your consent, send you marketing communications." },
      { h: "Data security", p: "We use industry-standard security measures and encrypted storage to protect your personal data. Payment details are handled by secure, PCI-compliant gateways." },
      { h: "Your rights", p: "You may access, update or delete your personal data at any time from your account, or by contacting us at hello@stfresh.com." },
      { h: "Cookies", p: "We use cookies to keep you signed in, remember your cart and understand how our site is used. You can control cookies through your browser settings." },
    ]} />
  ),
  head: () => ({ meta: [{ title: "Privacy Policy — STfresh" }, { property: "og:url", content: "/privacy" }], links: [{ rel: "canonical", href: "/privacy" }] }),
});