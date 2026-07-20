import { Link } from "@tanstack/react-router";
import { Leaf, Instagram, Facebook, Twitter, Mail } from "lucide-react";
import { NewsletterForm } from "@/components/layout/NewsletterForm";

const shop = [
  { label: "All Products", to: "/shop" as const },
  { label: "Rose Face Wash", to: "/category/$slug" as const, params: { slug: "rose-face-wash" } },
  { label: "Aloe Vera Gel", to: "/category/$slug" as const, params: { slug: "aloe-vera-gel" } },
  { label: "Papaya Gel", to: "/category/$slug" as const, params: { slug: "papaya-gel" } },
];

const company = [
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "FAQ", to: "/faq" },
];

const policies = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms & Conditions", to: "/terms" },
  { label: "Shipping Policy", to: "/shipping-policy" },
  { label: "Return Policy", to: "/return-policy" },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-sidebar text-sidebar-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-2 font-display text-2xl font-semibold text-sidebar-foreground">
            <Leaf className="text-sidebar-primary" /> Daksherb
          </Link>
          <p className="mt-4 max-w-xs text-sm text-sidebar-foreground/70">
            Natural, plant-powered skincare crafted with rose, aloe vera and papaya — for healthy, glowing skin.
          </p>
          <div className="mt-5 flex gap-2">
            {[Instagram, Facebook, Twitter, Mail].map((Icon, i) => (
              <a key={i} href="#" aria-label="social" className="grid h-9 w-9 place-items-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground transition hover:bg-sidebar-primary hover:text-sidebar-primary-foreground">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-sidebar-foreground/60">Shop</h4>
          <ul className="space-y-2.5 text-sm">
            {shop.map((l) => (
              <li key={l.label}>
                <Link to={l.to} params={(l as { params?: Record<string, string> }).params} className="text-sidebar-foreground/80 hover:text-sidebar-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-sidebar-foreground/60">Company</h4>
          <ul className="space-y-2.5 text-sm">
            {company.map((l) => (
              <li key={l.label}><Link to={l.to} className="text-sidebar-foreground/80 hover:text-sidebar-primary">{l.label}</Link></li>
            ))}
          </ul>
          <h4 className="mb-4 mt-6 text-sm font-semibold uppercase tracking-wide text-sidebar-foreground/60">Legal</h4>
          <ul className="space-y-2.5 text-sm">
            {policies.map((l) => (
              <li key={l.label}><Link to={l.to} className="text-sidebar-foreground/80 hover:text-sidebar-primary">{l.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-sidebar-foreground/60">Newsletter</h4>
          <p className="mb-3 text-sm text-sidebar-foreground/70">Get skincare tips & exclusive offers.</p>
          <NewsletterForm />
        </div>
      </div>
      <div className="border-t border-sidebar-border">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-sidebar-foreground/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Daksherb. All rights reserved.</p>
          <p>Made with 🌿 for healthy skin.</p>
        </div>
      </div>
    </footer>
  );
}
