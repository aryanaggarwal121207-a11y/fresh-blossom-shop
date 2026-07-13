import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Leaf, ShoppingBag, Heart, User, Menu, LogOut, Package, LayoutDashboard } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SearchBar } from "@/components/layout/SearchBar";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useAuth } from "@/hooks/use-auth";
import { fetchCategories } from "@/lib/catalog";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "FAQ", to: "/faq" },
] as const;

export function Header() {
  const { count } = useCart();
  const { count: wishCount } = useWishlist();
  const { user, isAdmin, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-lg">
      <div className="bg-[image:var(--gradient-brand)] py-2 text-center text-xs font-medium text-primary-foreground">
        Free shipping on orders above ₹499 · Natural skincare, delivered fresh 🌿
      </div>
      <div className="container-page flex h-16 items-center gap-4">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2 font-display text-xl">
                <Leaf className="text-primary" /> STfresh
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-6 flex flex-col gap-1">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 font-medium hover:bg-accent"
                >
                  {n.label}
                </Link>
              ))}
              <p className="px-3 pt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Categories</p>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm hover:bg-accent"
                >
                  {c.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <Link to="/" className="flex items-center gap-2 font-display text-2xl font-semibold">
          <Leaf className="text-primary" /> STfresh
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          <Link to="/" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent">Home</Link>
          <Link to="/shop" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent">Shop</Link>
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-lg px-3 py-2 text-sm font-medium outline-none hover:bg-accent">
              Categories
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {categories.map((c) => (
                <DropdownMenuItem key={c.id} asChild>
                  <Link to="/category/$slug" params={{ slug: c.slug }}>{c.name}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link to="/about" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent">About</Link>
          <Link to="/contact" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent">Contact</Link>
        </nav>

        <div className="ml-auto hidden max-w-sm flex-1 md:block">
          <SearchBar />
        </div>

        <div className="ml-auto flex items-center gap-0.5 md:ml-0">
          <Button asChild variant="ghost" size="icon" aria-label="Wishlist" className="relative">
            <Link to="/wishlist">
              <Heart />
              {wishCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                  {wishCount}
                </span>
              )}
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" aria-label="Cart" className="relative">
            <Link to="/cart">
              <ShoppingBag />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                  {count}
                </span>
              )}
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Account">
                <User />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {user ? (
                <>
                  <DropdownMenuItem asChild><Link to="/account"><User size={15} /> My Account</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/orders"><Package size={15} /> My Orders</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/wishlist"><Heart size={15} /> Wishlist</Link></DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild><Link to="/admin"><LayoutDashboard size={15} /> Admin Dashboard</Link></DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}><LogOut size={15} /> Sign out</DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild><Link to="/login">Login</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/signup">Create account</Link></DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="container-page pb-3 md:hidden">
        <SearchBar />
      </div>
    </header>
  );
}