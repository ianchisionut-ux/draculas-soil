import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { auth } from "@/auth";

// Note: on Cloudflare Workers, image resizing goes through the Images
// binding (wrangler.jsonc -> "images") instead of `sharp`, which needs
// native bindings the Workers runtime doesn't support. Storage goes
// through the PRODUCT_IMAGES R2 bucket instead of Vercel Blob.
//
// getCloudflareContext() is dynamically imported so this route still works
// in plain `next build`/local tooling that doesn't have the Cloudflare
// adapter wired in (e.g. a one-off script), falling back to the local
// filesystem the same way the original Vercel version did.

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

  const arrayBuffer = await file.arrayBuffer();
  const filename = `${Date.now()}-${Math.round(Math.random() * 1e6)}.webp`;

  const cf = await getCloudflareEnv();

  // Production path: Cloudflare Images (resize + webp) -> R2 (storage).
  if (cf?.env.IMAGES && cf?.env.PRODUCT_IMAGES) {
    let optimized: ArrayBuffer;
    try {
      // The Images binding wants a ReadableStream, not a raw ArrayBuffer.
      const inputStream = new Response(arrayBuffer).body as ReadableStream<Uint8Array>;
      const transformed = await cf.env.IMAGES.input(inputStream)
        .transform({ width: 1600, height: 1600, fit: "scale-down" })
        .output({ format: "image/webp", quality: 85 });
      optimized = await transformed.response().arrayBuffer();
    } catch (err) {
      console.error("Image processing failed:", err);
      return NextResponse.json(
        { error: "Couldn't process that image. Try a different file (JPG, PNG, or WebP)." },
        { status: 400 }
      );
    }

    try {
      await cf.env.PRODUCT_IMAGES.put(`products/${filename}`, optimized, {
        httpMetadata: { contentType: "image/webp" },
      });
      const publicBase =
        process.env.NEXT_PUBLIC_R2_CUSTOM_DOMAIN
          ? `https://${process.env.NEXT_PUBLIC_R2_CUSTOM_DOMAIN}`
          : process.env.NEXT_PUBLIC_R2_DEV_URL; // e.g. https://pub-xxxx.r2.dev
      if (!publicBase) {
        throw new Error(
          "Set NEXT_PUBLIC_R2_CUSTOM_DOMAIN or NEXT_PUBLIC_R2_DEV_URL so uploaded images have a public URL."
        );
      }
      return NextResponse.json({ url: `${publicBase}/products/${filename}` });
    } catch (err) {
      console.error("R2 upload failed:", err);
      return NextResponse.json(
        { error: "Upload to storage failed. Check the R2 bucket binding is configured." },
        { status: 500 }
      );
    }
  }

  // Local dev fallback (no Cloudflare bindings available, e.g. plain
  // `next build`/`next start` without `wrangler`/opennext dev): write
  // straight to /public/uploads, same as the original Vercel version did.
  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });
    await writeFile(path.join(uploadsDir, filename), Buffer.from(arrayBuffer));
    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (err) {
    console.error("Local upload fallback failed:", err);
    return NextResponse.json(
      { error: "Couldn't save the image locally either. Check the server terminal for details." },
      { status: 500 }
    );
  }
}

async function getCloudflareEnv() {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    return getCloudflareContext();
  } catch {
    return null;
  }
}
