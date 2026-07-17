import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Product } from "@/lib/types";

export function ProductImagesDialog({
  product,
}: {
  product: Product;
}) {

  const uploadImages = async (files: File[]) => {
    for (const file of files) {
      console.log(file.name);
    }
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
      style={{ display: "none" }}
      onChange={() => alert("Files selected")}
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
