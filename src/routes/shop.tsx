import { createFileRoute } from "@tanstack/react-router";
import { ShopView } from "@/components/shop/ShopView";

export const Route = createFileRoute("/shop")({
  component: Shop,
  head: () => ({
    meta: [
      { title: "Shop All Natural Skincare — STfresh" },
      { name: "description", content: "Browse the full STfresh range of natural rose, aloe vera and papaya skincare. Filter by price, rating and availability." },
      { property: "og:title", content: "Shop — STfresh" },
      { property: "og:url", content: "/shop" },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
  }),
});

function Shop() {
  return <ShopView title="Shop all products" />;
}