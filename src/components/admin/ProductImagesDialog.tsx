import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Product } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function ProductImagesDialog({
  product,
}: {
  product: Product;
}) {

  const uploadImages = async (files: File[]) => {
  for (const file of files) {
    const fileName = `${Date.now()}-${Math.random()}-${file.name}`;

    // Upload image to Storage
    const { error } = await supabase.storage
      .from("product-images")
      .upload(fileName, file);

    if (error) {
      toast.error(error.message);
      continue;
    }

    // Get public URL
    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    // Save URL in database
    const { error: dbError } = await supabase
      .from("product_images")
      .insert({
        product_id: product.id,
        image_url: data.publicUrl,
      });

    if (dbError) {
      toast.error(dbError.message);
      continue;
    }
  }

  toast.success("Images uploaded successfully");
};

  return (
    <Dialog>
      ...
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">
          Images
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
  TEST 123 - {product.name}
</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-3">
<div className="space-y-3">
  <label
    style={{
      display: "inline-block",
      padding: "10px 20px",
      background: "#2563eb",
      color: "white",
      borderRadius: "8px",
      cursor: "pointer",
    }}
  >
    Choose Images
<input
  type="file"
  multiple
  accept="image/*"
  style={{ border: "1px solid black", padding: "10px" }}
  onChange={(e) => {
    const files = e.target.files;
    if (!files) return;

    alert(`Selected ${files.length} files`);

    uploadImages(Array.from(files));
  }}
/>
  

    console.log(files.length);

    Array.from(files).forEach((file) => {
      console.log(file.name);
    });
  }}
/>
  </label>
</div>
</div>
          <div className="rounded-lg border p-8 text-center text-muted-foreground">
            No images uploaded yet.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
