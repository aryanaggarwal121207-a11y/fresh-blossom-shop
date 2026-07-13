import { StarRating } from "@/components/product/StarRating";

const reviews = [
  { name: "Ananya S.", text: "The rose face wash left my skin so soft and fresh. It's now part of my daily routine!", rating: 5 },
  { name: "Rahul M.", text: "Aloe vera gel is 100% pure and super soothing after sun exposure. Highly recommend.", rating: 5 },
  { name: "Priya K.", text: "Papaya gel gave my skin a natural glow within two weeks. Love the fresh feel.", rating: 4 },
];

export function Reviews() {
  return (
    <section className="container-page py-16">
      <div className="mb-10 text-center">
        <span className="text-sm font-semibold uppercase tracking-wider text-primary">Loved by customers</span>
        <h2 className="mt-1 font-display text-3xl font-semibold md:text-4xl">What our community says</h2>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {reviews.map((r) => (
          <figure key={r.name} className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <StarRating value={r.rating} size={16} />
            <blockquote className="mt-3 text-sm leading-relaxed text-foreground/90">“{r.text}”</blockquote>
            <figcaption className="mt-4 text-sm font-semibold">{r.name}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}