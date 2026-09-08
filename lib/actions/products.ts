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

function getImageUrls(formData: FormData): string[] {
  const imageUrls = formData
    .getAll("imageUrls")
    .map((value) => String(value).trim())
    .filter(Boolean);

  if (imageUrls.length > 5) {
    throw new Error("A product can have at most 5 images.");
  }

  return [...new Set(imageUrls)];
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
  const imageUrls = getImageUrls(formData);

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
      images: imageUrls.length
        ? {
            create: imageUrls.map((url, position) => ({ url, alt: name, position })),
          }
        : undefined,
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
  const imageUrls = getImageUrls(formData);

  if (!name || priceCents <= 0) {
    throw new Error("A valid name and price are required.");
  }

  await prisma.product.update({
    where: { id: productId },
    data: {
      name,
      shortDesc,
      description,
      priceCents,
      stock,
      sku,
      isActive,
      images: {
        deleteMany: {},
        create: imageUrls.map((url, position) => ({ url, alt: name, position })),
      },
    },
  });

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
