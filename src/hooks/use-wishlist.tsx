import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

const STORAGE_KEY = "stfresh_wishlist";

interface WishlistContextValue {
  ids: string[];
  has: (productId: string) => boolean;
  toggle: (productId: string) => void;
  count: number;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

function load(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => setIds(load()), []);
  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, [ids]);

  // Sync from DB when logged in.
  useEffect(() => {
    if (!user) return;
    supabase
      .from("wishlist")
      .select("product_id")
      .then(({ data }) => {
        if (data) setIds((prev) => Array.from(new Set([...prev, ...data.map((d) => d.product_id)])));
      });
  }, [user]);

  const has = (productId: string) => ids.includes(productId);

  const toggle = (productId: string) => {
    const isIn = ids.includes(productId);
    setIds((prev) => (isIn ? prev.filter((id) => id !== productId) : [...prev, productId]));
    toast.success(isIn ? "Removed from wishlist" : "Added to wishlist");
    if (user) {
      if (isIn) {
        supabase.from("wishlist").delete().eq("product_id", productId);
      } else {
        supabase.from("wishlist").insert({ user_id: user.id, product_id: productId });
      }
    }
  };

  return (
    <WishlistContext.Provider value={{ ids, has, toggle, count: ids.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}