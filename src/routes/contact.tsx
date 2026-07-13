import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";
import { Mail, Phone, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  email: z.string().trim().email("Invalid email").max(255),
  subject: z.string().trim().max(120).optional(),
  message: z.string().trim().min(5, "Message too short").max(1000),
});

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Contact Us — STfresh" },
      { name: "description", content: "Get in touch with the STfresh team. We're here to help with orders, products and skincare advice." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert(parsed.data);
    setLoading(false);
    if (error) { toast.error("Could not send message"); return; }
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_1.2fr]">
      <div>
        <h1 className="font-display text-4xl font-semibold">Get in touch</h1>
        <p className="mt-3 text-muted-foreground">Questions, feedback or skincare advice — we'd love to hear from you.</p>
        <div className="mt-8 space-y-5">
          {[
            { icon: Mail, t: "Email", d: "hello@stfresh.com" },
            { icon: Phone, t: "Phone", d: "+91 98765 43210" },
            { icon: MapPin, t: "Address", d: "Bengaluru, Karnataka, India" },
          ].map((c) => (
            <div key={c.t} className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-primary"><c.icon size={20} /></span>
              <div><p className="text-sm font-medium">{c.t}</p><p className="text-sm text-muted-foreground">{c.d}</p></div>
            </div>
          ))}
        </div>
      </div>
      <form onSubmit={submit} className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5"><Label htmlFor="name">Name</Label><Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
          <div className="space-y-1.5"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
        </div>
        <div className="space-y-1.5"><Label htmlFor="subject">Subject</Label><Input id="subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></div>
        <div className="space-y-1.5"><Label htmlFor="message">Message</Label><Textarea id="message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required /></div>
        <Button type="submit" className="w-full" disabled={loading}>{loading ? "Sending…" : "Send message"}</Button>
      </form>
    </div>
  );
}