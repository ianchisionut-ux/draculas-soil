import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import sharp from "sharp";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file was sent." }, { status: 400 });
  }

  let optimized: Buffer;
  try {
    const arrayBuffer = await file.arrayBuffer();
    optimized = await sharp(Buffer.from(arrayBuffer))
      .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();
  } catch (err) {
    console.error("Image processing failed:", err);
    return NextResponse.json(
      { error: "Couldn't process that image. Try a different file (JPG, PNG, or WebP)." },
      { status: 400 }
    );
  }

  const filename = `${Date.now()}-${Math.round(Math.random() * 1e6)}.webp`;

  // Production (or whenever a Blob store is attached): upload to Vercel Blob.
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blob = await put(`products/${filename}`, optimized, {
        access: "public",
        contentType: "image/webp",
      });
      return NextResponse.json({ url: blob.url });
    } catch (err) {
      console.error("Vercel Blob upload failed:", err);
      return NextResponse.json(
        { error: "Upload to Vercel Blob failed. Check BLOB_READ_WRITE_TOKEN is valid." },
        { status: 500 }
      );
    }
  }

  // Local dev fallback: no Blob token configured, so write straight to
  // /public/uploads instead. This only makes sense on a local filesystem —
  // Vercel's production servers are read-only, which is exactly why the
  // Blob branch above exists for real deployments.
  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });
    await writeFile(path.join(uploadsDir, filename), optimized);
    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (err) {
    console.error("Local upload fallback failed:", err);
    return NextResponse.json(
      { error: "Couldn't save the image locally either. Check the server terminal for details." },
      { status: 500 }
    );
  }
}
