import { Leaf, ShieldCheck, Truck, Sparkles } from "lucide-react";

const items = [
  { icon: Leaf, title: "100% Natural", desc: "Plant-powered formulas with no harsh chemicals or parabens." },
  { icon: ShieldCheck, title: "Dermatologically Safe", desc: "Gentle on all skin types, cruelty-free and tested." },
  { icon: Truck, title: "Fast Delivery", desc: "Free shipping over ₹499 with quick, tracked dispatch." },
  { icon: Sparkles, title: "Visible Results", desc: "Real ingredients that hydrate, brighten and nourish." },
];

export function WhyChoose() {
  return (
    <section className="bg-brand-soft/60 py-16">
      <div className="container-page">
        <div className="mb-10 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">Why Daksherb</span>
          <h2 className="mt-1 font-display text-3xl font-semibold md:text-4xl">Skincare you can trust</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div key={it.title} className="rounded-2xl border border-border bg-card p-6 text-center shadow-[var(--shadow-soft)]">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[image:var(--gradient-brand)] text-primary-foreground">
                <it.icon size={24} />
              </div>
              <h3 className="font-semibold">{it.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
