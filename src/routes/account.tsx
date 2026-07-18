import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Address } from "@/lib/types";

export const Route = createFileRoute("/account")({
  component: () => <RequireAuth><Account /></RequireAuth>,
  head: () => ({ meta: [{ title: "My Account — Daksherb" }, { name: "robots", content: "noindex" }] }),
});

function Account() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState({ full_name: "", phone: "" });
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [newAddr, setNewAddr] = useState({ full_name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" });

  useEffect(() => {
    supabase.from("profiles").select("full_name, phone").eq("id", user!.id).maybeSingle().then(({ data }) => {
      if (data) setProfile({ full_name: data.full_name ?? "", phone: data.phone ?? "" });
    });
    loadAddresses();
  }, [user]);

  const loadAddresses = () => {
    supabase.from("addresses").select("*").order("created_at", { ascending: false }).then(({ data }) => setAddresses(data ?? []));
  };

  const saveProfile = async () => {
    const { error } = await supabase.from("profiles").update(profile).eq("id", user!.id);
    toast[error ? "error" : "success"](error ? "Could not save" : "Profile updated");
  };

  const addAddress = async () => {
    if (!newAddr.full_name || !newAddr.line1 || !newAddr.city || !newAddr.pincode) { toast.error("Complete the address"); return; }
    const { error } = await supabase.from("addresses").insert({ ...newAddr, user_id: user!.id });
    if (error) { toast.error("Could not add address"); return; }
    toast.success("Address added");
    setNewAddr({ full_name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" });
    loadAddresses();
  };

  const removeAddress = async (id: string) => {
    await supabase.from("addresses").delete().eq("id", id);
    loadAddresses();
  };

  return (
    <div className="container-page py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold md:text-4xl">My account</h1>
        <Button variant="outline" onClick={() => signOut()}>Sign out</Button>
      </div>
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="addresses">Address book</TabsTrigger>
          <TabsTrigger value="orders" asChild><Link to="/orders">Orders</Link></TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="max-w-lg pt-6">
          <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
            <div className="space-y-1.5"><Label>Email</Label><Input value={user!.email ?? ""} disabled /></div>
            <div className="space-y-1.5"><Label>Full name</Label><Input value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Phone</Label><Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></div>
            <Button onClick={saveProfile}>Save changes</Button>
          </div>
        </TabsContent>
        <TabsContent value="addresses" className="pt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              {addresses.length === 0 && <p className="text-muted-foreground">No saved addresses yet.</p>}
              {addresses.map((a) => (
                <div key={a.id} className="rounded-2xl border border-border bg-card p-4">
                  <p className="font-medium">{a.full_name} · {a.phone}</p>
                  <p className="text-sm text-muted-foreground">{a.line1}{a.line2 ? `, ${a.line2}` : ""}, {a.city}, {a.state} - {a.pincode}</p>
                  <Button variant="ghost" size="sm" className="mt-2 text-destructive" onClick={() => removeAddress(a.id)}>Remove</Button>
                </div>
              ))}
            </div>
            <div className="space-y-3 rounded-2xl border border-border bg-card p-5">
              <h3 className="font-semibold">Add new address</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input placeholder="Full name" value={newAddr.full_name} onChange={(e) => setNewAddr({ ...newAddr, full_name: e.target.value })} />
                <Input placeholder="Phone" value={newAddr.phone} onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })} />
                <Input placeholder="Address line 1" className="sm:col-span-2" value={newAddr.line1} onChange={(e) => setNewAddr({ ...newAddr, line1: e.target.value })} />
                <Input placeholder="Address line 2" className="sm:col-span-2" value={newAddr.line2} onChange={(e) => setNewAddr({ ...newAddr, line2: e.target.value })} />
                <Input placeholder="City" value={newAddr.city} onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })} />
                <Input placeholder="State" value={newAddr.state} onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })} />
                <Input placeholder="Pincode" value={newAddr.pincode} onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })} />
              </div>
              <Button onClick={addAddress}>Add address</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
