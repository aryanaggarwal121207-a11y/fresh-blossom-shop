import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/catalog";
import { resolveImage } from "@/lib/product-images";
import { finalPrice } from "@/lib/types";
import { formatINR } from "@/lib/format";
import { Input } from "@/components/ui/input";

export function SearchBar({ onNavigate }: { onNavigate?: () => void }) {
  const [term, setTerm] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(term.trim()), 250);
    return () => clearTimeout(t);
  }, [term]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const { data, isFetching } = useQuery({
    queryKey: ["search", debounced],
    queryFn: () => fetchProducts({ search: debounced }),
    enabled: debounced.length > 1,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!term.trim()) return;
    navigate({ to: "/search", search: { q: term.trim() } });
    setOpen(false);
    onNavigate?.();
  };

  const results = (data ?? []).slice(0, 6);

  return (
    <div ref={ref} className="relative w-full">
      <form onSubmit={submit}>
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={term}
          onChange={(e) => {
            setTerm(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search rose, aloe, papaya…"
          className="rounded-full bg-secondary/60 pl-9"
          aria-label="Search products"
        />
        {isFetching && <Loader2 size={15} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-muted-foreground" />}
      </form>
      {open && debounced.length > 1 && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-border bg-popover shadow-[var(--shadow-card)]">
          {results.length === 0 && !isFetching ? (
            <p className="p-4 text-sm text-muted-foreground">No products found for “{debounced}”.</p>
          ) : (
            results.map((p) => (
              <Link
                key={p.id}
                to="/product/$slug"
                params={{ slug: p.slug }}
                onClick={() => {
                  setOpen(false);
                  onNavigate?.();
                }}
                className="flex items-center gap-3 px-3 py-2.5 hover:bg-accent"
              >
                <img src={resolveImage(p.image_url)} alt="" className="h-11 w-11 rounded-md object-cover" />
                <span className="line-clamp-1 flex-1 text-sm">{p.name}</span>
                <span className="text-sm font-medium">{formatINR(finalPrice(Number(p.price), p.discount_percent))}</span>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}