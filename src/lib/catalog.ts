import { supabase } from "@/integrations/supabase/client";
import type { Category, Product } from "@/lib/types";

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from("categories").select("*").order("name");
  return data ?? [];
}

export interface ProductFilters {
  categorySlug?: string;
  search?: string;
  minRating?: number;
  inStockOnly?: boolean;
  maxPrice?: number;
  sort?: "newest" | "price-asc" | "price-desc" | "rating" | "popular";
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
}

export async function fetchProducts(filters: ProductFilters = {}): Promise<Product[]> {
let query = supabase
  .from("products")
  .select(`
    *,
    product_images (
      image_url
    )
  `)
  .eq("is_active", true);
  if (filters.featured) query = query.eq("is_featured", true);
  if (filters.bestSeller) query = query.eq("is_best_seller", true);
  if (filters.newArrival) query = query.eq("is_new_arrival", true);
  if (filters.minRating) query = query.gte("rating", filters.minRating);
  if (filters.inStockOnly) query = query.gt("stock", 0);
  if (filters.maxPrice) query = query.lte("price", filters.maxPrice);
  if (filters.search) query = query.ilike("name", `%${filters.search}%`);

  switch (filters.sort) {
    case "price-asc":
      query = query.order("price", { ascending: true });
      break;
    case "price-desc":
      query = query.order("price", { ascending: false });
      break;
    case "rating":
      query = query.order("rating", { ascending: false });
      break;
    case "popular":
      query = query.order("review_count", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;

console.log("Products returned:", data);
console.log("Supabase error:", error);
  if (error) throw error;
  let rows = (data ?? []) as unknown as (Product & { categories?: { slug: string } })[];
  if (filters.categorySlug) rows = rows.filter((p) => p.categories?.slug === filters.categorySlug);
  return rows.map((product: any) => ({
  ...product,
  image_url: product.product_images?.[0]?.image_url ?? product.image_url,
}));
}

export async function fetchProductBySlug(slug: string): Promise<Product & { categories?: Category } | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data as unknown as (Product & { categories?: Category }) | null;
}

export async function fetchProductsByIds(ids: string[]): Promise<Product[]> {
  if (!ids.length) return [];
  const { data, error } = await supabase.from("products").select("*").in("id", ids);
  if (error) throw error;
  return data ?? [];
}
