import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { LayoutDashboard, Package, ShoppingCart, Users, Tag, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { formatINR, formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Order, Product } from "@/lib/types";

export const Route = createFileRoute("/admin")({
  component: () => <RequireAuth admin><Admin /></RequireAuth>,
  head: () => ({ meta: [{ title: "Admin — STfresh" }, { name: "robots", content: "noindex" }] }),
});

const ORDER_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "returned"];

function Admin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const loadProducts = () => supabase.from("products").select("*").order("created_at", { ascending: false }).then(({ data }) => setProducts(data ?? []));
  const loadOrders = () => supabase.from("orders").select("*").order("created_at", { ascending: false }).then(({ data }) => setOrders(data ?? []));

  useEffect(() => { loadProducts(); loadOrders(); }, []);

  const revenue = orders.reduce((s, o) => s + Number(o.total), 0);

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="border-b border-border bg-sidebar text-sidebar-foreground">
        <div className="container-page flex h-16 items-center justify-between">
          <span className="flex items-center gap-2 font-display text-xl font-semibold"><LayoutDashboard size={20} /> STfresh Admin</span>
          <Button asChild variant="secondary" size="sm"><Link to="/"><Home size={15} /> Store</Link></Button>
        </div>
      </header>
      <div className="container-page py-8">
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: ShoppingCart, l: "Orders", v: orders.length },
            { icon: Package, l: "Products", v: products.length },
            { icon: Tag, l: "Revenue", v: formatINR(revenue) },
            { icon: Users, l: "Pending", v: orders.filter((o) => o.status === "pending").length },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl border border-border bg-card p-5">
              <s.icon className="text-primary" />
              <p className="mt-3 text-2xl font-semibold">{s.v}</p>
              <p className="text-sm text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>

        <Tabs defaultValue="products">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="pt-6">
            <div className="mb-4 flex justify-end"><ProductDialog onSaved={loadProducts} /></div>
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              {products.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-4 border-b border-border px-4 py-3 last:border-0">
                  <div className="min-w-0"><p className="truncate font-medium">{p.name}</p><p className="text-sm text-muted-foreground">{formatINR(Number(p.price))} · Stock: {p.stock}</p></div>
                  <div className="flex items-center gap-2">
                    <ProductDialog product={p} onSaved={loadProducts} />
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={async () => { await supabase.from("products").delete().eq("id", p.id); toast.success("Deleted"); loadProducts(); }}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="pt-6">
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              {orders.length === 0 && <p className="p-6 text-muted-foreground">No orders yet.</p>}
              {orders.map((o) => (
                <div key={o.id} className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-4 py-3 last:border-0">
                  <div><p className="font-medium">{o.order_number}</p><p className="text-sm text-muted-foreground">{formatDate(o.created_at)} · {formatINR(Number(o.total))}</p></div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="capitalize">{o.payment_method}</Badge>
                    <Select value={o.status} onValueChange={async (v) => { await supabase.from("orders").update({ status: v as Order["status"] }).eq("id", o.id); toast.success("Status updated"); loadOrders(); }}>
                      <SelectTrigger className="w-36 capitalize"><SelectValue /></SelectTrigger>
                      <SelectContent>{ORDER_STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ProductDialog({ product, onSaved }: { product?: Product; onSaved: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    price: product?.price?.toString() ?? "",
    discount_percent: product?.discount_percent?.toString() ?? "0",
    stock: product?.stock?.toString() ?? "0",
    description: product?.description ?? "",
  });

  const save = async () => {
    const payload = {
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      price: Number(form.price),
      discount_percent: Number(form.discount_percent),
      stock: Number(form.stock),
      description: form.description,
    };
    const { error } = product
      ? await supabase.from("products").update(payload).eq("id", product.id)
      : await supabase.from("products").insert(payload);
    if (error) { toast.error(error.message); return; }
    toast.success(product ? "Product updated" : "Product added");
    setOpen(false);
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant={product ? "outline" : "default"}>{product ? "Edit" : "Add product"}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{product ? "Edit product" : "Add product"}</DialogTitle></DialogHeader>
        <div className="grid gap-3">
          <div className="space-y-1.5"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Slug (optional)</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5"><Label>Price</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Discount %</Label><Input type="number" value={form.discount_percent} onChange={(e) => setForm({ ...form, discount_percent: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Stock</Label><Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></div>
          </div>
          <div className="space-y-1.5"><Label>Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <Button onClick={save}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}