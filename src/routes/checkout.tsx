import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { finalPrice } from "@/lib/types";
import { formatINR } from "@/lib/format";
import { PAYMENT_METHODS, getPaymentProvider, type PaymentMethod } from "@/lib/payments";
import { DELIVERY_OPTIONS, type DeliveryOption } from "@/lib/shipping";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const Route = createFileRoute("/checkout")({
  component: () => <RequireAuth><Checkout /></RequireAuth>,
  head: () => ({ meta: [{ title: "Checkout — Daksherb" }, { name: "robots", content: "noindex" }] }),
});

function Checkout() {
  const { user } = useAuth();
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [addr, setAddr] = useState({ full_name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" });
  const [delivery, setDelivery] = useState<DeliveryOption>("standard");
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [placing, setPlacing] = useState(false);
  const fetchPincodeDetails = async (pincode: string) => {
  if (pincode.length !== 6) return;

  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const data = await res.json();

    if (
      data[0].Status === "Success" &&
      data[0].PostOffice &&
      data[0].PostOffice.length > 0
    ) {
      setAddr((prev) => ({
        ...prev,
        city: data[0].PostOffice[0].District,
        state: data[0].PostOffice[0].State,
      }));
    } else {
      toast.error("Invalid pincode");
      setAddr((prev) => ({
        ...prev,
        city: "",
        state: "",
      }));
    }
  } catch {
    toast.error("Unable to fetch pincode details");
  }
};

  const deliveryFee = DELIVERY_OPTIONS.find((d) => d.value === delivery)?.fee ?? 0;
  const baseShipping = subtotal >= 499 ? 0 : 100;
  const shipping = baseShipping + deliveryFee;
  const total = Math.max(0, subtotal - discount) + shipping;

  const applyCoupon = async () => {
    const { data } = await supabase.from("coupons").select("*").eq("code", coupon.trim().toUpperCase()).eq("active", true).maybeSingle();
    if (!data) { toast.error("Invalid coupon"); return; }
    if (subtotal < Number(data.min_order)) { toast.error(`Minimum order ${formatINR(Number(data.min_order))}`); return; }
    let d = (subtotal * data.discount_percent) / 100;
    if (data.max_discount) d = Math.min(d, Number(data.max_discount));
    setDiscount(Math.round(d));
    toast.success(`Coupon applied — ${formatINR(Math.round(d))} off`);
  };

  const placeOrder = async () => {
    if (!addr.full_name || !addr.phone || !addr.line1 || !addr.city || !addr.state || !addr.pincode) {
      toast.error("Please complete your shipping address");
      return;
    }
    setPlacing(true);
    const { data: order, error } = await supabase
  .from("orders")
  .insert({
    user_id: user!.id,
    customer_name: addr.full_name,
    subtotal,
    discount,
    shipping_fee: shipping,
    total,
    coupon_code: coupon || null,
    payment_method: payment,
    delivery_option: delivery,
    shipping_address: addr,
  })
  .select()
  .single();
    if (error || !order) { setPlacing(false); toast.error("Could not place order"); return; }
    await supabase.from("order_items").insert(items.map((i) => ({
      order_id: order.id,
      product_id: i.productId,
      product_name: i.name,
      image_url: i.image,
      unit_price: finalPrice(i.price, i.discountPercent),
      quantity: i.quantity,
    })));
    const paymentResult = await getPaymentProvider(payment).pay({
  orderId: order.id,
  amount: total,
  method: payment,
});
if (!paymentResult.success) {
  const { error: deleteError } = await supabase
    .from("orders")
    .delete()
    .eq("id", order.id);

  console.log("Delete error:", deleteError);;

  setPlacing(false);
  toast.error("Payment cancelled");
  return;
}
    setPlacing(false);
    clear();
    toast.success("Order placed successfully!");
    navigate({ to: "/orders" });
  };

  if (items.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="font-display text-3xl">Your cart is empty</h1>
        <Button className="mt-6" onClick={() => navigate({ to: "/shop" })}>Go to shop</Button>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <h1 className="mb-8 font-display text-3xl font-semibold md:text-4xl">Checkout</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-xl font-semibold">Shipping address</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5"><Label>Full name</Label><Input
  required
  value={addr.full_name}
  onChange={(e) => setAddr({ ...addr, full_name: e.target.value })}
/></div>
              <div className="space-y-1.5"><Label>Phone</Label><Input
  required
  value={addr.phone}
  onChange={(e) => setAddr({ ...addr, phone: e.target.value })}
/>
 </div>
                <div className="space-y-1.5 sm:col-span-2">
  <Label>Address line 1</Label>
  <Input
    required
    value={addr.line1}
    onChange={(e) => setAddr({ ...addr, line1: e.target.value })}
  />
</div>
              <div className="space-y-1.5 sm:col-span-2"><Label>Address line 2</Label><Input
  required
  value={addr.line2}
  onChange={(e) => setAddr({ ...addr, line2: e.target.value })}
/></div>
              <div className="space-y-1.5">
  <Label>Pincode</Label>
  <Input
    required
    value={addr.pincode}
    onChange={(e) => {
      const pincode = e.target.value.replace(/\D/g, "").slice(0, 6);

      setAddr((prev) => ({
        ...prev,
        pincode,
      }));

      if (pincode.length === 6) {
        fetchPincodeDetails(pincode);
      }
    }}
  />
</div>

<div className="space-y-1.5">
  <Label>City</Label>
  <Input
    value={addr.city}
    readOnly
  />
</div>

<div className="space-y-1.5">
  <Label>State</Label>
  <Input
    value={addr.state}
    readOnly
  />
</div>
 
</div> 
            
         
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-xl font-semibold">Delivery option</h2>
            <RadioGroup value={delivery} onValueChange={(v) => setDelivery(v as DeliveryOption)} className="mt-4 space-y-3">
              {DELIVERY_OPTIONS.map((o) => (
                <label key={o.value} className="flex cursor-pointer items-center justify-between rounded-xl border border-border p-3">
                  <span className="flex items-center gap-3"><RadioGroupItem value={o.value} /><span><span className="font-medium">{o.label}</span><span className="block text-xs text-muted-foreground">{o.eta}</span></span></span>
                  <span className="text-sm">{o.fee === 0 ? "Free" : formatINR(o.fee)}</span>
                </label>
              ))}
            </RadioGroup>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-xl font-semibold">Payment method</h2>
            <RadioGroup value={payment} onValueChange={(v) => setPayment(v as PaymentMethod)} className="mt-4 space-y-3">
              {PAYMENT_METHODS.map((m) => (
                <label key={m.value} className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-3">
                  <RadioGroupItem value={m.value} /><span><span className="font-medium">{m.label}</span><span className="block text-xs text-muted-foreground">{m.description}</span></span>
                </label>
              ))}
            </RadioGroup>
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <h2 className="font-display text-xl font-semibold">Order summary</h2>
          <div className="mt-4 space-y-3 text-sm">
            {items.map((i) => (
              <div key={i.productId} className="flex justify-between gap-2">
                <span className="text-muted-foreground">{i.name} × {i.quantity}</span>
                <span>{formatINR(finalPrice(i.price, i.discountPercent) * i.quantity)}</span>
              </div>
            ))}
            <Separator />
            <div className="flex gap-2">
              <Input placeholder="Coupon code" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
              <Button variant="outline" onClick={applyCoupon}>Apply</Button>
            </div>
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatINR(subtotal)}</span></div>
            {discount > 0 && <div className="flex justify-between text-primary"><span>Discount</span><span>-{formatINR(discount)}</span></div>}
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Free" : formatINR(shipping)}</span></div>
            <Separator />
            <div className="flex justify-between text-base font-semibold"><span>Total</span><span>{formatINR(total)}</span></div>
          </div>
          <Button size="lg" className="mt-6 w-full" disabled={placing} onClick={placeOrder}>
            <CheckCircle2 size={18} /> {placing ? "Placing order…" : "Place order"}
          </Button>
        </aside>
      </div>
    </div>
  );
}
