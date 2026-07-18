import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/terms")({
  component: () => (
    <LegalPage title="Terms & Conditions" updated="July 2026" sections={[
      { h: "Acceptance of terms", p: "By accessing and using the Daksherb website, you agree to be bound by these terms and conditions and our privacy policy." },
      { h: "Products and pricing", p: "We strive to display accurate product information and pricing. Prices are in INR and inclusive of applicable taxes unless stated otherwise. We reserve the right to correct errors." },
      { h: "Orders", p: "All orders are subject to acceptance and availability. We may cancel any order due to stock issues or suspected fraud, with a full refund where payment was made." },
      { h: "Intellectual property", p: "All content on this site, including images, logos and text, is the property of Daksherb and may not be used without permission." },
      { h: "Limitation of liability", p: "Daksherb is not liable for any indirect or consequential damages arising from the use of our products or website, to the extent permitted by law." },
    ]} />
  ),
  head: () => ({ meta: [{ title: "Terms & Conditions — STfresh" }, { property: "og:url", content: "/terms" }], links: [{ rel: "canonical", href: "/terms" }] }),
});
