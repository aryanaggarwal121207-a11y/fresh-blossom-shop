import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ShopView } from "@/components/shop/ShopView";

const searchSchema = z.object({ q: z.string().optional().default("") });

export const Route = createFileRoute("/search")({
  validateSearch: searchSchema,
  component: SearchPage,
  head: () => ({
    meta: [
      { title: "Search — STfresh" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function SearchPage() {
  const { q } = Route.useSearch();
  return <ShopView search={q} title={q ? `Results for “${q}”` : "Search"} />;
}