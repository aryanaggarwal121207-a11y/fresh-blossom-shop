import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { finalPrice } from "@/lib/types";
import { formatINR } from "@/lib/format";
import { resolveImage } from "@/lib/product-images";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/product/StarRating";
import { useCart } from "@/hooks/use-cart";

export function QuickViewDialog({
  product,
  open,
  onOpenChange,
}: {
  product: Product;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const { addItem } = useCart();
  const price = finalPrice(Number(product.price), product.discount_percent);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl overflow-hidden p-0">
        <div className="grid gap-0 sm:grid-cols-2">
          <img
            src={resolveImage(product.image_url)}
            alt={product.name}
            className="aspect-square w-full object-cover"
          />
          <div className="flex flex-col gap-3 p-6">
            <StarRating value={Number(product.rating)} />
            <h2 className="font-display text-2xl">{product.name}</h2>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-semibold">{formatINR(price)}</span>
              {product.discount_percent > 0 && (
                <span className="text-muted-foreground line-through">{formatINR(Number(product.price))}</span>
              )}
            </div>
            <p className="line-clamp-4 text-sm text-muted-foreground">{product.description}</p>
            <div className="mt-auto flex flex-col gap-2 pt-2">
              <Button disabled={product.stock <= 0} onClick={() => addItem(product)}>
                <ShoppingBag size={16} /> Add to cart
              </Button>
              <Button asChild variant="outline">
                <Link to="/product/$slug" params={{ slug: product.slug }}>
                  View full details
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}