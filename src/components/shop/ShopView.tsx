import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontal } from "lucide-react";
import { fetchProducts, fetchCategories, type ProductFilters } from "@/lib/catalog";
import { finalPrice } from "@/lib/types";
import { formatINR } from "@/lib/format";
import { ProductGrid } from "@/components/ProductGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { StarRating } from "@/components/product/StarRating";

const MAX_PRICE = 600;

function Filters({
  categorySlug,
  setCategorySlug,
  lockedCategory,
  price,
  setPrice,
  minRating,
  setMinRating,
  inStockOnly,
  setInStockOnly,
}: {
  categorySlug: string;
  setCategorySlug: (s: string) => void;
  lockedCategory: boolean;
  price: number;
  setPrice: (n: number) => void;
  minRating: number;
  setMinRating: (n: number) => void;
  inStockOnly: boolean;
  setInStockOnly: (b: boolean) => void;
}) {
  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
  return (
    <div className="space-y-7">
      {!lockedCategory && (
        <div>
          <h3 className="mb-3 font-semibold">Category</h3>
          <div className="space-y-2">
            {[{ slug: "", name: "All products" }, ...categories].map((c) => (
              <label key={c.slug || "all"} className="flex cursor-pointer items-center gap-2 text-sm">
                <input type="radio" name="cat" checked={categorySlug === c.slug} onChange={() => setCategorySlug(c.slug)} className="accent-primary" />
                {c.name}
              </label>
            ))}
          </div>
        </div>
      )}
      <div>
        <h3 className="mb-3 font-semibold">Max price</h3>
        <Slider value={[price]} max={MAX_PRICE} step={10} onValueChange={(v) => setPrice(v[0])} />
        <p className="mt-2 text-sm text-muted-foreground">Up to {formatINR(price)}</p>
      </div>
      <div>
        <h3 className="mb-3 font-semibold">Rating</h3>
        <div className="space-y-2">
          {[4, 3, 0].map((r) => (
            <label key={r} className="flex cursor-pointer items-center gap-2 text-sm">
              <input type="radio" name="rating" checked={minRating === r} onChange={() => setMinRating(r)} className="accent-primary" />
              {r === 0 ? "All ratings" : <span className="flex items-center gap-1"><StarRating value={r} /> & up</span>}
            </label>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="instock" checked={inStockOnly} onCheckedChange={(v) => setInStockOnly(!!v)} />
        <Label htmlFor="instock" className="cursor-pointer">In stock only</Label>
      </div>
    </div>
  );
}

export function ShopView({
  initialCategory = "",
  search,
  title,
}: {
  initialCategory?: string;
  search?: string;
  title: string;
}) {
  const [categorySlug, setCategorySlug] = useState(initialCategory);
  const [price, setPrice] = useState(MAX_PRICE);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<ProductFilters["sort"]>("newest");

  const lockedCategory = !!initialCategory;
  const activeCategory = lockedCategory ? initialCategory : categorySlug;

  const filters: ProductFilters = useMemo(
    () => ({
      categorySlug: activeCategory || undefined,
      search,
      maxPrice: price < MAX_PRICE ? price : undefined,
      minRating: minRating || undefined,
      inStockOnly,
      sort,
    }),
    [activeCategory, search, price, minRating, inStockOnly, sort],
  );

  const { data, isLoading } = useQuery({ queryKey: ["products", filters], queryFn: () => fetchProducts(filters) });

  const filterProps = {
    categorySlug,
    setCategorySlug,
    lockedCategory,
    price,
    setPrice,
    minRating,
    setMinRating,
    inStockOnly,
    setInStockOnly,
  };

  return (
    <div className="container-page py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold md:text-4xl">{title}</h1>
          <p className="mt-1 text-muted-foreground">{isLoading ? "Loading…" : `${data?.length ?? 0} products`}</p>
        </div>
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden"><SlidersHorizontal size={16} /> Filters</Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
              <div className="mt-6"><Filters {...filterProps} /></div>
            </SheetContent>
          </Sheet>
          <Select value={sort} onValueChange={(v) => setSort(v as ProductFilters["sort"])}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="popular">Most popular</SelectItem>
              <SelectItem value="rating">Top rated</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-28 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
            <Filters {...filterProps} />
          </div>
        </aside>
        <div>
          {isLoading ? (
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />)}
            </div>
          ) : (
            <ProductGrid products={data ?? []} />
          )}
        </div>
      </div>
    </div>
  );
}

export { finalPrice };