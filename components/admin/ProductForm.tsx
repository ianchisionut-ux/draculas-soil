"use client";

import { useState } from "react";
import Image from "next/image";

type Props = {
  action: (formData: FormData) => Promise<void>;
  initial?: {
    name?: string;
    shortDesc?: string;
    description?: string;
    priceCents?: number;
    stock?: number;
    sku?: string;
    isActive?: boolean;
    imageUrl?: string;
  };
  submitLabel: string;
  onDelete?: () => Promise<void>;
};

export function ProductForm({ action, initial, submitLabel, onDelete }: Props) {
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl || "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");
      setImageUrl(data.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form
      action={action}
      onSubmit={() => setSubmitting(true)}
      className="mt-8 max-w-2xl space-y-6"
    >
      <div>
        <label className="block text-sm text-stone">Product name</label>
        <input
          name="name"
          required
          defaultValue={initial?.name}
          className="mt-1 w-full border border-line bg-ink px-3 py-2 text-bone outline-none focus:border-gold"
        />
      </div>

      <div>
        <label className="block text-sm text-stone">Short description (shown on cards and in listings)</label>
        <input
          name="shortDesc"
          defaultValue={initial?.shortDesc}
          className="mt-1 w-full border border-line bg-ink px-3 py-2 text-bone outline-none focus:border-gold"
        />
      </div>

      <div>
        <label className="block text-sm text-stone">Full description (product page, accepts simple HTML)</label>
        <textarea
          name="description"
          rows={6}
          defaultValue={initial?.description}
          className="mt-1 w-full border border-line bg-ink px-3 py-2 text-bone outline-none focus:border-gold"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-stone">Price (e.g. 49.99)</label>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={initial?.priceCents ? (initial.priceCents / 100).toFixed(2) : undefined}
            className="mt-1 w-full border border-line bg-ink px-3 py-2 text-bone outline-none focus:border-gold"
          />
        </div>
        <div>
          <label className="block text-sm text-stone">Stock available</label>
          <input
            name="stock"
            type="number"
            min="0"
            defaultValue={initial?.stock ?? 100}
            className="mt-1 w-full border border-line bg-ink px-3 py-2 text-bone outline-none focus:border-gold"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-stone">SKU (optional)</label>
        <input
          name="sku"
          defaultValue={initial?.sku}
          className="mt-1 w-full border border-line bg-ink px-3 py-2 text-bone outline-none focus:border-gold"
        />
      </div>

      <div>
        <label className="block text-sm text-stone">Product image</label>
        <input type="hidden" name="imageUrl" value={imageUrl} />
        <div className="mt-2 flex items-center gap-4">
          {imageUrl && (
            <div className="relative h-20 w-20 border border-line bg-void">
              <Image src={imageUrl} alt="Preview" fill sizes="80px" className="object-contain p-1" />
            </div>
          )}
          <div>
            <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm text-stone" />
            {uploading && <p className="mt-1 text-xs text-gold-bright">Uploading...</p>}
            {uploadError && <p className="mt-1 text-xs text-blood-bright">{uploadError}</p>}
          </div>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-stone">
        <input type="checkbox" name="isActive" defaultChecked={initial?.isActive ?? true} />
        Visible on the site
      </label>

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={submitting || uploading}
          className="bg-blood px-6 py-2.5 font-label text-xs tracking-[0.15em] text-bone hover:bg-blood-bright disabled:opacity-50"
        >
          {submitting ? "SAVING..." : submitLabel}
        </button>
        {onDelete && (
          <button
            type="button"
            onClick={() => {
              if (confirm("Delete this product permanently?")) onDelete();
            }}
            className="text-sm text-stone hover:text-blood-bright"
          >
            Delete product
          </button>
        )}
      </div>
    </form>
  );
}
