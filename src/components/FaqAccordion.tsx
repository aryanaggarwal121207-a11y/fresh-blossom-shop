import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const FAQ_ITEMS = [
  { q: "Are Daksherb products natural?", a: "Yes. Every Daksherb product is crafted with plant-based, natural ingredients like rose, aloe vera and papaya, free from parabens and harsh chemicals." },
  { q: "Are your products suitable for sensitive skin?", a: "Absolutely. Our gentle formulas are dermatologically friendly and designed for all skin types, including sensitive skin." },
  { q: "How long does delivery take?", a: "Standard delivery takes 4–6 business days, while express delivery arrives in 1–2 business days. Free shipping on orders above ₹499." },
  { q: "What is your return policy?", a: "Unfortunately there is no return policy for now. See our Return Policy page for details." },
  { q: "Which payment methods do you accept?", a: "We accept UPI, credit/debit cards, net banking, wallets and Cash on Delivery." },
  { q: "Are Daksherb products cruelty-free?", a: "Yes — we never test on animals and are proudly cruelty-free." },
];

export function FaqAccordion({ items = FAQ_ITEMS }: { items?: { q: string; a: string }[] }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((item, i) => (
        <AccordionItem key={i} value={`item-${i}`}>
          <AccordionTrigger className="text-left text-base font-medium">{item.q}</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
