import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { updateProduct, deleteProduct } from "@/lib/actions/products";
import { EditProductClient } from "@/components/admin/EditProductClient";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { position: "asc" }, take: 1 } },
  });
  if (!product) notFound();

  const boundUpdate = updateProduct.bind(null, product.id);
  const boundDelete = deleteProduct.bind(null, product.id);

  return (
    <div>
      <h1 className="font-display text-4xl">Edit product</h1>
      <EditProductClient
        action={boundUpdate}
        deleteAction={boundDelete}
        initial={{
          name: product.name,
          shortDesc: product.shortDesc,
          description: product.description,
          priceCents: product.priceCents,
          stock: product.stock,
          sku: product.sku ?? undefined,
          isActive: product.isActive,
          imageUrl: product.images[0]?.url,
        }}
      />
    </div>
  );
}
