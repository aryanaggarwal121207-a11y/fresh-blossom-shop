import { createFileRoute } from "@tanstack/react-router";
import { FaqAccordion, FAQ_ITEMS } from "@/components/FaqAccordion";

export const Route = createFileRoute("/faq")({
  component: Faq,
  head: () => ({
    meta: [
      { title: "FAQ — Daksherb" },
      { name: "description", content: "Answers to common questions about Daksherb natural skincare, shipping, returns and payments." },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQ_ITEMS.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
      }),
    }],
  }),
});

function Faq() {
  return (
    <div className="container-page max-w-3xl py-12">
      <h1 className="font-display text-4xl font-semibold">Frequently asked questions</h1>
      <p className="mt-2 text-muted-foreground">Everything you need to know about Daksherb.</p>
      <div className="mt-8"><FaqAccordion /></div>
    </div>
  );
}
