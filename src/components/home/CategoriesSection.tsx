import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { fetchCategories } from "@/lib/catalog";
import { resolveImage } from "@/lib/product-images";
import { SectionHeader } from "@/components/SectionHeader";
import { Skeleton } from "@/components/ui/skeleton";

export function CategoriesSection() {
  const { data: categories = [], isLoading } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
  return (
    <section className="container-page py-16">
      <SectionHeader eyebrow="Shop by category" title="Find your natural glow" subtitle="Curated ranges powered by rose, aloe vera and papaya." linkTo="/shop" linkLabel="Shop all" />
      <div className="grid gap-5 md:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="aspect-[4/3] rounded-3xl" />)
          : categories.map((c) => (
              <Link
                key={c.id}
                to="/category/$slug"
                params={{ slug: c.slug }}
                className="card-hover group relative overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-soft)]"
              >
                <img src={resolveImage(c.image_url)} alt={c.name} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 text-primary-foreground">
                  <div>
                    <h3 className="font-display text-2xl font-semibold">{c.name}</h3>
                    <p className="mt-1 max-w-[16rem] text-sm text-primary-foreground/80">{c.description}</p>
                  </div>
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-card/90 text-foreground transition group-hover:bg-card">
                    <ArrowUpRight size={18} />
                  </span>
                </div>
              </Link>
            ))}
      </div>
    </section>
  );
}