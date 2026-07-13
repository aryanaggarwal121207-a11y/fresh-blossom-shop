import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

export function ReviewForm({ productId }: { productId: string }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <p className="mt-8 rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
        Please <Link to="/login" className="text-primary underline">log in</Link> to write a review.
      </p>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("reviews").insert({
      product_id: productId,
      user_id: user.id,
      author_name: user.user_metadata?.full_name ?? user.email?.split("@")[0],
      rating,
      comment: comment.trim() || null,
    });
    setLoading(false);
    if (error) {
      toast.error("Could not submit review");
      return;
    }
    toast.success("Thanks for your review!");
    setComment("");
    qc.invalidateQueries({ queryKey: ["reviews", productId] });
  };

  return (
    <form onSubmit={submit} className="mt-8 rounded-2xl border border-border bg-card p-5">
      <h4 className="font-semibold">Write a review</h4>
      <div className="mt-3 flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <button type="button" key={i} onClick={() => setRating(i)} aria-label={`${i} stars`}>
            <Star size={22} className={cn(i <= rating ? "fill-gold text-gold" : "fill-muted text-muted")} />
          </button>
        ))}
      </div>
      <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience…" maxLength={1000} className="mt-3" />
      <Button type="submit" disabled={loading} className="mt-3">{loading ? "Submitting…" : "Submit review"}</Button>
    </form>
  );
}