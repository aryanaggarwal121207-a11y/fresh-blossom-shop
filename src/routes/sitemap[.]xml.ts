import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticPaths = ["/", "/shop", "/about", "/contact", "/faq", "/privacy", "/terms", "/shipping-policy", "/return-policy"];
        const [{ data: products }, { data: categories }] = await Promise.all([
          supabase.from("products").select("slug").eq("is_active", true),
          supabase.from("categories").select("slug"),
        ]);
        const paths = [
          ...staticPaths,
          ...(categories ?? []).map((c) => `/category/${c.slug}`),
          ...(products ?? []).map((p) => `/product/${p.slug}`),
        ];
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...paths.map((p) => `  <url><loc>${BASE_URL}${p}</loc></url>`),
          `</urlset>`,
        ].join("\n");
        return new Response(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});