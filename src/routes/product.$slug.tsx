import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Heart, Minus, Plus, ShoppingBag, Truck, ShieldCheck, RefreshCcw } from "lucide-react";
import { fetchProductBySlug, fetchProducts } from "@/lib/catalog";
import { supabase } from "@/integrations/supabase/client";
import { finalPrice, type Review } from "@/lib/types";
import { formatINR, formatDate } from "@/lib/format";
import { resolveImage } from "@/lib/product-images";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StarRating } from "@/components/product/StarRating";
import { ProductGrid } from "@/components/ProductGrid";
import { SectionHeader } from "@/components/SectionHeader";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import { ReviewForm } from "@/components/product/ReviewForm";

export const Route = createFileRoute("/product/$slug")({
  component: ProductPage,
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — STfresh` },
      { property: "og:type", content: "product" },
      { property: "og:url", content: `/product/${params.slug}` },
    ],
    links: [{ rel: "canonical", href: `/product/${params.slug}` }],
  }),
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const { track } = useRecentlyViewed();
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProductBySlug(slug),
  });

  const { data: related = [] } = useQuery({
    queryKey: ["related", product?.category_id],
    queryFn: () => fetchProducts({}),
    enabled: !!product,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", product?.id],
    queryFn: async () => {
      const { data } = await supabase.from("reviews").select("*").eq("product_id", product!.id).order("created_at", { ascending: false });
      return (data ?? []) as Review[];
    },
    enabled: !!product,
  });

  useEffect(() => {
    if (product) track(product.id);
  }, [product, track]);

  if (isLoading) {
    return (
      <div className="container-page grid gap-10 py-10 md:grid-cols-2">
        <Skeleton className="aspect-square rounded-3xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="font-display text-3xl">Product not found</h1>
        <Button asChild className="mt-6"><Link to="/shop">Back to shop</Link></Button>
      </div>
    );
  }
  const images =
  product.product_images?.length
    ? product.product_images
    : [{ image_url: product.image_url }];

const currentImage = images[selectedImage];

  const price = finalPrice(Number(product.price), product.discount_percent);
  const outOfStock = product.stock <= 0;
  const relatedProducts = related.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="container-page py-10">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link> / <Link to="/shop" className="hover:text-primary">Shop</Link> / <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-4">
  <div className="relative overflow-hidden rounded-3xl border border-border bg-brand-soft shadow-[var(--shadow-soft)]">

    <img
      src={resolveImage(currentImage.image_url)}
      alt={product.name}
      className="aspect-square w-full object-cover"
    />

    {images.length > 1 && (
      <>
        <Button
          variant="secondary"
          size="icon"
          className="absolute left-3 top-1/2 -translate-y-1/2"
          onClick={() =>
            setSelectedImage(
              selectedImage === 0
                ? images.length - 1
                : selectedImage - 1
            )
          }
        >
          ◀
        </Button>

        <Button
          variant="secondary"
          size="icon"
          className="absolute right-3 top-1/2 -translate-y-1/2"
          onClick={() =>
            setSelectedImage(
              selectedImage === images.length - 1
                ? 0
                : selectedImage + 1
            )
          }
        >
          ▶
        </Button>
      </>
    )}
  </div>

  <div className="flex gap-2 overflow-x-auto">
    {images.map((image: any, index: number) => (
      <img
        key={index}
        src={resolveImage(image.image_url)}
        onClick={() => setSelectedImage(index)}
        className={`h-20 w-20 cursor-pointer rounded-lg border object-cover ${
          selectedImage === index
            ? "border-primary"
            : "border-border"
        }`}
      />
    ))}
  </div>
</div>

        <div>
          <div className="flex items-center gap-3">
            <StarRating value={Number(product.rating)} size={16} />
            <span className="text-sm text-muted-foreground">{Number(product.rating)} ({product.review_count} reviews)</span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-semibold md:text-4xl">{product.name}</h1>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-3xl font-semibold">{formatINR(price)}</span>
            {product.discount_percent > 0 && (
              <>
                <span className="text-lg text-muted-foreground line-through">{formatINR(Number(product.price))}</span>
                <Badge className="bg-destructive text-destructive-foreground">Save {product.discount_percent}%</Badge>
              </>
            )}
          </div>
          <p className="mt-5 text-muted-foreground">{product.description}</p>

          <div className="mt-4">
            <span className={cn("text-sm font-medium", outOfStock ? "text-destructive" : "text-success")}>
              {outOfStock ? "Out of stock" : `In stock (${product.stock} available)`}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-border">
              <Button variant="ghost" size="icon" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease"><Minus size={16} /></Button>
              <span className="w-10 text-center font-medium">{qty}</span>
              <Button variant="ghost" size="icon" onClick={() => setQty((q) => Math.min(product.stock, q + 1))} aria-label="Increase"><Plus size={16} /></Button>
            </div>
            <Button size="lg" className="flex-1 min-w-[180px]" disabled={outOfStock} onClick={() => addItem(product, qty)}>
              <ShoppingBag size={18} /> Add to cart
            </Button>
            <Button size="lg" variant="outline" aria-label="Wishlist" onClick={() => toggle(product.id)}>
              <Heart size={18} className={cn(has(product.id) && "fill-destructive text-destructive")} />
            </Button>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Truck, t: "Free shipping", d: "Over ₹499" },
              { icon: ShieldCheck, t: "100% Natural", d: "No parabens" },
              { icon: RefreshCcw, t: "Easy returns", d: "Within 7 days" },
            ].map((f) => (
              <div key={f.t} className="flex items-center gap-2 rounded-xl border border-border bg-card p-3">
                <f.icon size={20} className="text-primary" />
                <div><p className="text-sm font-medium">{f.t}</p><p className="text-xs text-muted-foreground">{f.d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Tabs defaultValue="description" className="mt-14">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="max-w-3xl pt-6 text-muted-foreground leading-relaxed">
          <p>{product.description}</p>
          <p className="mt-4">Made with carefully sourced natural ingredients, this STfresh product is designed to nourish and protect your skin with everyday use. Free from parabens, sulphates and harsh chemicals.</p>
        </TabsContent>
        <TabsContent value="reviews" className="max-w-3xl pt-6">
          <div className="space-y-5">
            {reviews.length === 0 && <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>}
            {reviews.map((r) => (
              <div key={r.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{r.author_name ?? "Customer"}</p>
                  <span className="text-xs text-muted-foreground">{formatDate(r.created_at)}</span>
                </div>
                <StarRating value={r.rating} className="mt-1" />
                {r.comment && <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>}
              </div>
            ))}
          </div>
          <ReviewForm productId={product.id} />
        </TabsContent>
        <TabsContent value="shipping" className="max-w-3xl pt-6 text-muted-foreground leading-relaxed">
          <p>Standard delivery in 4–6 business days. Express delivery available in 1–2 business days. Free shipping on orders above ₹499. See our <Link to="/shipping-policy" className="text-primary underline">Shipping Policy</Link> for details.</p>
        </TabsContent>
      </Tabs>

      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <SectionHeader eyebrow="You may also like" title="Related products" />
          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </div>
  );
}
