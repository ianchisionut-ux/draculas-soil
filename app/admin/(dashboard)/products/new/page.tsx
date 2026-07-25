import { createProduct } from "@/lib/actions/products";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-display text-4xl">New product</h1>
      <ProductForm action={createProduct} submitLabel="CREATE PRODUCT" />
    </div>
  );
}
