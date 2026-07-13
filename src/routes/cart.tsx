import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { finalPrice } from "@/lib/types";
import { formatINR } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/cart")({
  component: CartPage,
  head: () => ({ meta: [{ title: "Your Cart — STfresh" }, { name: "robots", content: "noindex" }] }),
});

function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const shipping = subtotal >= 499 || subtotal === 0 ? 0 : 49;

  if (items.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-brand-soft text-primary">
          <ShoppingBag size={32} />
        </div>
        <h1 className="font-display text-3xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Discover our natural skincare essentials.</p>
        <Button asChild className="mt-6"><Link to="/shop">Start shopping</Link></Button>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <h1 className="mb-8 font-display text-3xl font-semibold md:text-4xl">Shopping cart</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.map((item) => {
            const price = finalPrice(item.price, item.discountPercent);
            return (
              <div key={item.productId} className="flex gap-4 rounded-2xl border border-border bg-card p-4">
                <img src={item.image ?? undefined} alt={item.name} className="h-24 w-24 rounded-xl object-cover" />
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-2">
                    <Link to="/product/$slug" params={{ slug: item.slug }} className="font-medium hover:text-primary">{item.name}</Link>
                    <button onClick={() => removeItem(item.productId)} aria-label="Remove" className="text-muted-foreground hover:text-destructive"><Trash2 size={18} /></button>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{formatINR(price)} each</p>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-border">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.productId, item.quantity - 1)}><Minus size={14} /></Button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.productId, item.quantity + 1)}><Plus size={14} /></Button>
                    </div>
                    <span className="font-semibold">{formatINR(price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <h2 className="font-display text-xl font-semibold">Order summary</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatINR(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Free" : formatINR(shipping)}</span></div>
            {subtotal < 499 && <p className="text-xs text-primary">Add {formatINR(499 - subtotal)} more for free shipping!</p>}
            <Separator />
            <div className="flex justify-between text-base font-semibold"><span>Total</span><span>{formatINR(subtotal + shipping)}</span></div>
          </div>
          <Button asChild size="lg" className="mt-6 w-full"><Link to="/checkout">Checkout <ArrowRight size={16} /></Link></Button>
          <Button asChild variant="ghost" className="mt-2 w-full"><Link to="/shop">Continue shopping</Link></Button>
        </aside>
      </div>
    </div>
  );
}