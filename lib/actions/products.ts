"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
}

export async function createProduct(formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") || "").trim();
  const shortDesc = String(formData.get("shortDesc") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const priceCents = Math.round(parseFloat(String(formData.get("price") || "0")) * 100);
  const stock = parseInt(String(formData.get("stock") || "0"), 10);
  const sku = String(formData.get("sku") || "").trim() || undefined;
  const isActive = formData.get("isActive") === "on";
  const imageUrl = String(formData.get("imageUrl") || "").trim();

  if (!name || priceCents <= 0) {
    throw new Error("A valid name and price are required.");
  }

  let slug = slugify(name);
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  const product = await prisma.product.create({
    data: {
      slug,
      name,
      shortDesc,
      description,
      priceCents,
      stock,
      sku,
      isActive,
      images: imageUrl ? { create: [{ url: imageUrl, alt: name, position: 0 }] } : undefined,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
  redirect(`/admin/products/${product.id}`);
}

export async function updateProduct(productId: string, formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") || "").trim();
  const shortDesc = String(formData.get("shortDesc") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const priceCents = Math.round(parseFloat(String(formData.get("price") || "0")) * 100);
  const stock = parseInt(String(formData.get("stock") || "0"), 10);
  const sku = String(formData.get("sku") || "").trim() || undefined;
  const isActive = formData.get("isActive") === "on";
  const imageUrl = String(formData.get("imageUrl") || "").trim();

  if (!name || priceCents <= 0) {
    throw new Error("A valid name and price are required.");
  }

  await prisma.product.update({
    where: { id: productId },
    data: { name, shortDesc, description, priceCents, stock, sku, isActive },
  });

  if (imageUrl) {
    const existingImage = await prisma.productImage.findFirst({
      where: { productId },
      orderBy: { position: "asc" },
    });
    if (existingImage) {
      await prisma.productImage.update({ where: { id: existingImage.id }, data: { url: imageUrl, alt: name } });
    } else {
      await prisma.productImage.create({ data: { productId, url: imageUrl, alt: name, position: 0 } });
    }
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/");
}

export async function deleteProduct(productId: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id: productId } });
  revalidatePath("/admin/products");
  revalidatePath("/");
}
