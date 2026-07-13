import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.string().trim().email("Enter a valid email").max(255);

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(email);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("newsletter").insert({ email: parsed.data });
    setLoading(false);
    if (error && !error.message.includes("duplicate")) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    toast.success("Subscribed! Welcome to STfresh 🌿");
    setEmail("");
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="bg-sidebar-accent text-sidebar-accent-foreground placeholder:text-sidebar-foreground/50"
        aria-label="Email address"
      />
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Subscribing…" : "Subscribe"}
      </Button>
    </form>
  );
}