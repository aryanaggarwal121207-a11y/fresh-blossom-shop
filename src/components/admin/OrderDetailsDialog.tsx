import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Order } from "@/lib/types";

export function OrderDetailsDialog({ order }: { order: Order }) {
  const [items, setItems] = useState<any[]>([]);
  const address =
  typeof order.shipping_address === "string"
    ? JSON.parse(order.shipping_address)
    : order.shipping_address;

  useEffect(() => {
    supabase
      .from("order_items")
      .select("*")
      .eq("order_id", order.id)
      .then(({ data }) => {
        setItems(data ?? []);
      });
  }, [order.id]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View Details
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{order.order_number}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
  {items.map((item) => (
    <div
      key={item.id}
      className="flex items-center justify-between border rounded-lg p-3"
    >
      <div className="flex items-center gap-3">
        <img
          src={item.image_url}
          alt={item.product_name}
          className="w-16 h-16 rounded-lg object-cover"
        />

        <div>
          <p className="font-medium">{item.product_name}</p>
          <p className="text-sm text-muted-foreground">
            Qty: {item.quantity}
          </p>
        </div>
      </div>

      <div className="text-right">
        <p>{formatINR(Number(item.unit_price))}</p>
      </div>
    </div>
  ))}
</div>
      </DialogContent>
    </Dialog>
  );
}
