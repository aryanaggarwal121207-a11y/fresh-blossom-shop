import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refreshRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const loadRole = async (uid: string | undefined) => {
    if (!uid) {
      setIsAdmin(false);
      return;
    }
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", uid)
      .eq("role", "admin")
      .maybeSingle();
    setIsAdmin(!!data);
  };


     useEffect(() => {
  const { data: sub } = supabase.auth.onAuthStateChange(async (_event, s) => {
    setSession(s);
    setUser(s?.user ?? null);
    setLoading(false);

    // Save customer details
    if (s?.user) {
      await supabase.from("customers").upsert({
        id: s.user.id,
        email: s.user.email,
        phone: s.user.phone ?? null,
        full_name:
          s.user.user_metadata?.full_name ||
          s.user.user_metadata?.name ||
          null,
        provider: s.user.app_metadata?.provider ?? "email",
      });
    }

    setTimeout(() => {
      loadRole(s?.user?.id);
    }, 0);
  });
       supabase.auth.getSession().then(async ({ data }) => {
  setSession(data.session);
  setUser(data.session?.user ?? null);

  if (data.session?.user) {
    await supabase.from("customers").upsert({
      id: data.session.user.id,
      email: data.session.user.email,
      phone: data.session.user.phone ?? null,
      full_name:
        data.session.user.user_metadata?.full_name ||
        data.session.user.user_metadata?.name ||
        null,
      provider: data.session.user.app_metadata?.provider ?? "email",
    });
  }

  loadRole(data.session?.user?.id);
  setLoading(false);
});

  return () => sub.subscription.unsubscribe();
}, []);


  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  };

  const refreshRole = async () => loadRole(user?.id);

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, signOut, refreshRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
