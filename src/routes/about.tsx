import { createFileRoute, Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { Button } from "@/components/ui/button";
import { WhyChoose } from "@/components/home/WhyChoose";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "About Daksherb — Our Natural Skincare Story" },
      { name: "description", content: "Daksherb crafts natural, plant-powered skincare with rose, aloe vera and papaya for healthy, glowing skin." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
});

function About() {
  return (
    <>
      <section className="bg-[image:var(--gradient-hero)]">
        <div className="container-page grid items-center gap-10 py-16 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-brand-soft px-4 py-1.5 text-sm font-medium text-primary"><Leaf size={15} /> Our story</span>
            <h1 className="mt-5 font-display text-4xl font-semibold md:text-5xl">Nature-first skincare, made with love</h1>
            <p className="mt-5 text-lg text-muted-foreground">Daksherb was born from a simple belief: skincare should be pure, gentle and rooted in nature. We craft every product with plant-powered ingredients like rose, aloe vera and papaya — free from harsh chemicals.</p>
            <Button asChild className="mt-6"><Link to="/shop">Explore products</Link></Button>
          </div>
          <img src={heroImg} alt="Daksherb natural skincare" className="rounded-3xl border border-border object-cover shadow-[var(--shadow-card)]" />
        </div>
      </section>
      <WhyChoose />
      <section className="container-page py-16 text-center">
        <h2 className="font-display text-3xl font-semibold">Our mission</h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">To make effective, natural skincare accessible to everyone — while caring for our planet and never testing on animals. Healthy skin, the fresh and natural way.</p>
      </section>
    </>
  );
}
