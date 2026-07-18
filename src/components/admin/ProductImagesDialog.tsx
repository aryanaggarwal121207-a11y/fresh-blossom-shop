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
import { useState } from "react";

type ProductImagesDialogProps = {
  product: Product;
};

type ProductImage = {
  id: string;
  image_url: string;
};
export function ProductImagesDialog({
  product,
}: ProductImagesDialogProps) {
  const [open, setOpen] = useState(false);
const [images, setImages] = useState<ProductImage[]>([]);
const [loading, setLoading] = useState(false);
  const uploadImages = async (files: File[]) => {
    for (const file of files) {
      const fileName = `${Date.now()}-${Math.random()}-${file.name}`;

      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, file);

      if (uploadError) {
        console.error(uploadError);
        toast.error(uploadError.message);
        continue;
      }

      // Get public URL
      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      // Save image URL in database
      const { error: dbError } = await supabase
        .from("product_images")
        .insert({
          product_id: product.id,
          image_url: data.publicUrl,
        });

      if (dbError) {
        console.error(dbError);
        toast.error(dbError.message);
        continue;
      }
    }

    await fetchImages();
    toast.success("Images uploaded successfully");
  };
const fetchImages = async () => {
  setLoading(true);

  const { data, error } = await supabase
    .from("product_images")
    .select("id, image_url")
    .eq("product_id", product.id)
    .order("created_at", { ascending: true });

  if (error) {
    toast.error(error.message);
  } else {
    setImages(data ?? []);
  }

  setLoading(false);
};
const deleteImage = async (image: ProductImage) => {
  if (!confirm("Delete this image?")) return;

  try {
    // Remove database record
    const { error: dbError } = await supabase
      .from("product_images")
      .delete()
      .eq("id", image.id);

    if (dbError) throw dbError;

    // Remove file from Storage (best effort)
    const path = image.image_url.split("/product-images/")[1];

    if (path) {
      await supabase.storage
        .from("product-images")
        .remove([decodeURIComponent(path)]);
    }

    toast.success("Image deleted");

    fetchImages();
  } catch (err: any) {
    toast.error(err.message);
  }
};
  
 return (
  <Dialog
    open={open}
    onOpenChange={(value) => {
      setOpen(value);

      if (value) {
        fetchImages();
      }
    }}
  >
    <DialogTrigger asChild>
      <Button size="sm" variant="secondary">
        Images
      </Button>
    </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Images - {product.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const files = e.target.files;
                if (!files) return;

                uploadImages(Array.from(files));
              }}
            />
          </div>

         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
  {loading && <p>Loading...</p>}

  {!loading && images.length === 0 && (
    <div className="col-span-full rounded-lg border p-8 text-center text-muted-foreground">
      No images uploaded yet.
    </div>
  )}

  {images.map((image) => (
    <div
  key={image.id}
  className="relative overflow-hidden rounded-lg border"
>
  <img
    src={image.image_url}
    alt="Product"
    className="w-full h-40 object-cover"
  />

  <Button
    size="sm"
    variant="destructive"
    className="absolute right-2 top-2"
    onClick={() => deleteImage(image)}
  >
    Delete
  </Button>
</div>
  ))}
</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
