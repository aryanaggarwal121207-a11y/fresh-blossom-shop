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
import { useEffect, useState } from "react";

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

    toast.success("Images uploaded successfully");
  };

  return (
    <Dialog>
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

          <div className="rounded-lg border p-8 text-center text-muted-foreground">
            Images will appear here after we add the gallery.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
