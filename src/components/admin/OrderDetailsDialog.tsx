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

        <p>Products: {items.length}</p>
      </DialogContent>
    </Dialog>
  );
}
