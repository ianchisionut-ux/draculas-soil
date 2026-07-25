import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import sharp from "sharp";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Image storage (Vercel Blob) is not configured. Add BLOB_READ_WRITE_TOKEN to your environment variables." },
      { status: 400 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file was sent." }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const optimized = await sharp(Buffer.from(arrayBuffer))
    .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();

  const filename = `products/${Date.now()}-${Math.round(Math.random() * 1e6)}.webp`;
  const blob = await put(filename, optimized, {
    access: "public",
    contentType: "image/webp",
  });

  return NextResponse.json({ url: blob.url });
}
