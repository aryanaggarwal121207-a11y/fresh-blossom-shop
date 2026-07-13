import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/lib/catalog";
import { ShopView } from "@/components/shop/ShopView";

export const Route = createFileRoute("/category/$slug")({
  component: CategoryPage,
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — STfresh` },
      { name: "description", content: `Shop STfresh ${params.slug.replace(/-/g, " ")} — natural, plant-powered skincare.` },
      { property: "og:url", content: `/category/${params.slug}` },
    ],
    links: [{ rel: "canonical", href: `/category/${params.slug}` }],
  }),
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
  const category = categories.find((c) => c.slug === slug);
  return <ShopView initialCategory={slug} title={category?.name ?? "Category"} />;
}