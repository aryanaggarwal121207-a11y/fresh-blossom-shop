import type { Tables } from "@/integrations/supabase/types";

export type Product = Tables<"products">;
export type Category = Tables<"categories">;
export type Order = Tables<"orders">;
export type OrderItem = Tables<"order_items">;
export type Address = Tables<"addresses">;
export type Coupon = Tables<"coupons">;
export type Review = Tables<"reviews">;
export type Profile = Tables<"profiles">;

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  short_description: string | null;
  discountPercent: number;
  image: string | null;
  quantity: number;
  badge: string | null;
}

export function finalPrice(price: number, discountPercent: number): number {
  return Math.round((price - (price * discountPercent) / 100) * 100) / 100;
}
