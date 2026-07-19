import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Leaf } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/SectionHeader";
import { QueryProductGrid } from "@/components/ProductGrid";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { WhyChoose } from "@/components/home/WhyChoose";
import { Reviews } from "@/components/home/Reviews";
import { FaqAccordion } from "@/components/FaqAccordion";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Store",
          name: "Daksherb",
          description: "Natural skincare — rose face wash, aloe vera gel and papaya gel.",
        }),
      },
    ],
  }),
});

function Index() {
  return (
    <>
      {/* Hero */}
     <section
  className="relative overflow-hidden"
  style={{
    background:
      "linear-gradient(180deg,#FAF7F2 0%,#F5EFE6 45%,#FAF7F2 100%)",
  }}
>
        <div className="container-page grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-brand-soft px-4 py-1.5 text-sm font-medium text-primary">
              <Leaf size={15} /> Natural · Cruelty-free · Fresh
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] md:text-6xl">
              Glowing skin, <span className="text-gradient-brand">naturally</span> nourished.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              Plant-powered skincare crafted with rose, aloe vera and papaya. Gentle, effective and made for radiant, healthy skin.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/shop">Shop the collection <ArrowRight size={18} /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/about">Our story</Link>
              </Button>
            </div>
            <div className="mt-10 flex gap-8">
              //{[
                //{ n: "50k+", l: "Happy customers" },
                //{ n: "4.8★", l: "Average rating" },
                //{ n: "100%", l: "Natural" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="font-display text-2xl font-semibold text-primary">{s.n}</p>
                  <p className="text-sm text-muted-foreground">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
           <div className="animate-float overflow-hidden rounded-[40px] shadow-2xl">
             <img
    src={heroImg}
    className="h-full w-full object-cover transition duration-700 hover:scale-105"
/>
            </div>
          </div>
        </div>
      </section>

      <CategoriesSection />

      <section className="container-page pb-16">
        <SectionHeader eyebrow="Featured" title="Featured products" subtitle="Our most-loved skincare essentials." linkTo="/shop" />
        <QueryProductGrid filters={{ featured: true }} limit={4} />
      </section>

      <WhyChoose />

      <section className="container-page py-16">
        <SectionHeader eyebrow="Trending" title="Best sellers" subtitle="Tried, tested and adored by our community." linkTo="/shop" />
        <QueryProductGrid filters={{ bestSeller: true }} limit={4} />
      </section>

      <section className="container-page pb-16">
        <SectionHeader eyebrow="Just in" title="New arrivals" subtitle="Fresh additions to the STfresh range." linkTo="/shop" />
        <QueryProductGrid filters={{ newArrival: true }} limit={4} />
      </section>

      <Reviews />

      <section className="bg-brand-soft/60 py-16">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">Help center</span>
            <h2 className="mt-1 font-display text-3xl font-semibold md:text-4xl">Frequently asked questions</h2>
            <p className="mt-3 text-muted-foreground">Everything you need to know about Daksherb products, shipping and returns.</p>
            <Button
  asChild
  className="mt-6 rounded-full bg-[#2E5D50] px-8 py-6 text-white hover:bg-[#23463d]"
>
  <Link to="/faq">Learn more</Link>
</Button>
          </div>
          <FaqAccordion items={undefined} />
        </div>
      </section>
    </>
  );
}
