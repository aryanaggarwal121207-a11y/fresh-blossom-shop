import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export function RequireAuth({ children, admin = false }: { children: ReactNode; admin?: boolean }) {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  if (loading || !user) {
    return <div className="grid min-h-[60vh] place-items-center"><Loader2 className="animate-spin text-primary" /></div>;
  }
  if (admin && !isAdmin) {
    return <div className="grid min-h-[60vh] place-items-center text-center"><div><h1 className="font-display text-2xl">Access denied</h1><p className="mt-2 text-muted-foreground">You need admin access to view this page.</p></div></div>;
  }
  return <>{children}</>;
}