import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import type { Product } from "@/lib/types";
import { finalPrice } from "@/lib/types";
import { formatINR } from "@/lib/format";
import { resolveImage } from "@/lib/product-images";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/product/StarRating";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { QuickViewDialog } from "@/components/product/QuickViewDialog";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const [quickOpen, setQuickOpen] = useState(false);
  const price = finalPrice(Number(product.price), product.discount_percent);
  const inWishlist = has(product.id);
  const outOfStock = product.stock <= 0;

  return (
    <>
      <div className="group card-hover relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
        <div className="relative aspect-square overflow-hidden bg-brand-soft">
          <Link to="/product/$slug" params={{ slug: product.slug }}>
            <img
              src={resolveImage(product.image_url)}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.discount_percent > 0 && (
              <Badge className="bg-destructive text-destructive-foreground">-{product.discount_percent}%</Badge>
            )}
           {product.badge && (
  <Badge
    className={
      product.badge === "Bestseller"
        ? "bg-yellow-500 text-white"
        : product.badge === "New"
        ? "bg-green-600 text-white"
        : product.badge === "Trending"
        ? "bg-purple-600 text-white"
        : product.badge === "Sale"
        ? "bg-red-600 text-white"
        : product.badge === "Limited Stock"
        ? "bg-orange-600 text-white"
        : product.badge === "Organic"
        ? "bg-emerald-600 text-white"
        : ""
    }
  >
    {product.badge}
  </Badge>
)}
          </div>
          <button
            aria-label="Add to wishlist"
            onClick={() => toggle(product.id)}
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-card/90 text-foreground shadow-sm backdrop-blur transition hover:bg-card"
          >
            <Heart size={17} className={cn(inWishlist && "fill-destructive text-destructive")} />
          </button>
          <div className="absolute inset-x-3 bottom-3 flex translate-y-3 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <Button
              size="sm"
              className="flex-1"
              disabled={outOfStock}
              onClick={() => addItem(product)}
            >
              <ShoppingBag size={15} /> Add
            </Button>
            <Button size="sm" variant="secondary" aria-label="Quick view" onClick={() => setQuickOpen(true)}>
              <Eye size={15} />
            </Button>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-1.5 p-4">
          <div className="flex items-center justify-between gap-2">
            <StarRating value={Number(product.rating)} />
            <span className="text-xs text-muted-foreground">({product.review_count})</span>
          </div>
          <Link
  to="/product/$slug"
  params={{ slug: product.slug }}
  className="line-clamp-2 font-medium leading-snug hover:text-primary"
>
  {product.name}
</Link>

{product.short_description && (
  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground leading-5">
    {product.short_description}
  </p>
)}

          <div className="mt-auto flex items-center gap-2 pt-1">
            <span className="text-lg font-semibold text-foreground">{formatINR(price)}</span>
            {product.discount_percent > 0 && (
              <span className="text-sm text-muted-foreground line-through">
                {formatINR(Number(product.price))}
              </span>
            )}
          </div>
          <span
            className={cn(
              "text-xs font-medium",
              outOfStock ? "text-destructive" : "text-success",
            )}
          >
            {outOfStock ? "Out of stock" : "In stock"}
          </span>
        </div>
      </div>
      <QuickViewDialog product={product} open={quickOpen} onOpenChange={setQuickOpen} />
    </>
  );
}
