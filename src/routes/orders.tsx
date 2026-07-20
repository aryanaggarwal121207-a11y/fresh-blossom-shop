import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { formatINR, formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Order } from "@/lib/types";

export const Route = createFileRoute("/orders")({
  component: () => <RequireAuth><Orders /></RequireAuth>,
  head: () => ({ meta: [{ title: "My Orders — STfresh" }, { name: "robots", content: "noindex" }] }),
});

function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function loadOrders() {
    setLoading(true);

    // Get orders
    const { data: ordersData, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (ordersError) {
      console.error(ordersError);
      setLoading(false);
      return;
    }

    // If no orders
    if (!ordersData || ordersData.length === 0) {
      setOrders([]);
      setLoading(false);
      return;
    }

    // Get order IDs
    const orderIds = ordersData.map((o) => o.id);

    // Fetch all items for those orders
    const { data: itemsData, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .in("order_id", orderIds);

    if (itemsError) {
      console.error(itemsError);
    }

    // Attach items to each order
    const merged = ordersData.map((order) => ({
      ...order,
      items: (itemsData ?? []).filter(
        (item) => item.order_id === order.id
      ),
    }));

    setOrders(merged);
    setLoading(false);
  }

  loadOrders();
}, []);

  if (!loading && orders.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-brand-soft text-primary"><Package size={32} /></div>
        <h1 className="font-display text-3xl font-semibold">No orders yet</h1>
        <Button asChild className="mt-6"><Link to="/shop">Start shopping</Link></Button>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <h1 className="mb-8 font-display text-3xl font-semibold md:text-4xl">My orders</h1>
      <div className="space-y-4">
        {orders.map((o) => (
          <div
  key={o.id}
  className="rounded-2xl border border-border bg-card p-5"
>
  <div className="flex flex-wrap items-center justify-between gap-4">
    <div>
      <p className="font-semibold">{o.order_number}</p>
      <p className="text-sm text-muted-foreground">
        {formatDate(o.created_at)} · {formatINR(Number(o.total))}
      </p>
    </div>

    <div className="flex items-center gap-3">
      <Badge variant="secondary" className="capitalize">
        {o.status}
      </Badge>

      {o.tracking_number && (
        <span className="text-xs text-muted-foreground">
          Tracking: {o.tracking_number}
        </span>
      )}
    </div>
  </div>

  <div className="mt-5 border-t pt-4 space-y-3">
    {o.items?.map((item: any) => (
      <div
        key={item.id}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          {item.image_url && (
            <img
              src={item.image_url}
              alt={item.product_name}
              className="h-14 w-14 rounded-lg object-cover border"
            />
          )}

          <div>
            <p className="font-medium">{item.product_name}</p>
            <p className="text-sm text-muted-foreground">
              Qty: {item.quantity}
            </p>
          </div>
        </div>

        <p className="font-medium">
          {formatINR(Number(item.unit_price))}
        </p>
      </div>
    ))}
  </div>
</div>
        ))}
      </div>
    </div>
  );
}
