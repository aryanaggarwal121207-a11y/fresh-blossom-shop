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
    supabase.from("orders").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setOrders(data ?? []);
      setLoading(false);
    });
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
          <div key={o.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5">
            <div>
              <p className="font-semibold">{o.order_number}</p>
              <p className="text-sm text-muted-foreground">{formatDate(o.created_at)} · {formatINR(Number(o.total))}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="capitalize">{o.status}</Badge>
              {o.tracking_number && <span className="text-xs text-muted-foreground">Tracking: {o.tracking_number}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
