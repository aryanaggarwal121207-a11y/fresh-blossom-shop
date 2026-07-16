import { ShoppingCart, Package, Tag, Users } from "lucide-react";
import { formatINR } from "@/lib/format";
import type { Order, Product } from "@/lib/types";

interface DashboardCardsProps {
  products: Product[];
  orders: Order[];
}

export function DashboardCards({
  products,
  orders,
}: DashboardCardsProps) {
  const revenue = orders.reduce((sum, order) => sum + Number(order.total), 0);

  const cards = [
    {
      icon: ShoppingCart,
      label: "Orders",
      value: orders.length,
    },
    {
      icon: Package,
      label: "Products",
      value: products.length,
    },
    {
      icon: Tag,
      label: "Revenue",
      value: formatINR(revenue),
    },
    {
      icon: Users,
      label: "Pending Orders",
      value: orders.filter((o) => o.status === "pending").length,
    },
  ];

  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-border bg-card p-5"
        >
          <card.icon className="text-primary" />
          <p className="mt-3 text-2xl font-semibold">{card.value}</p>
          <p className="text-sm text-muted-foreground">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
