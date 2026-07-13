import rose from "@/assets/rose-face-wash.jpg";
import aloe from "@/assets/aloe-vera-gel.jpg";
import papaya from "@/assets/papaya-gel.jpg";

const MAP: Record<string, string> = {
  "rose-face-wash": rose,
  "aloe-vera-gel": aloe,
  "papaya-gel": papaya,
};

/**
 * Resolves a product/category image reference to a usable URL.
 * Seed data uses short keys mapped to bundled assets; admin uploads
 * store full URLs (Supabase Storage signed/public URLs) which pass through.
 */
export function resolveImage(key?: string | null): string {
  if (!key) return rose;
  if (key.startsWith("http") || key.startsWith("/") || key.startsWith("data:")) return key;
  return MAP[key] ?? rose;
}