import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { useWishlist } from "@/hooks/use-wishlist";
import { fetchProductsByIds } from "@/lib/catalog";
import { ProductGrid } from "@/components/ProductGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/wishlist")({
  component: WishlistPage,
  head: () => ({ meta: [{ title: "Your Wishlist — STfresh" }, { name: "robots", content: "noindex" }] }),
});

function WishlistPage() {
  const { ids } = useWishlist();
  const { data = [], isLoading } = useQuery({
    queryKey: ["wishlist-products", ids],
    queryFn: () => fetchProductsByIds(ids),
  });

  return (
    <div className="container-page py-10">
      <h1 className="mb-8 font-display text-3xl font-semibold md:text-4xl">My wishlist</h1>
      {isLoading ? (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />)}</div>
      ) : ids.length === 0 ? (
        <div className="py-20 text-center">
          <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-brand-soft text-primary"><Heart size={32} /></div>
          <h2 className="font-display text-2xl font-semibold">Your wishlist is empty</h2>
          <p className="mt-2 text-muted-foreground">Save your favourite products to find them here.</p>
          <Button asChild className="mt-6"><Link to="/shop">Browse products</Link></Button>
        </div>
      ) : (
        <ProductGrid products={data} />
      )}
    </div>
  );
}