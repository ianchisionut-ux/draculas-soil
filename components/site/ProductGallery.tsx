"use client";

import Image from "next/image";
import { useState } from "react";

type ProductImage = {
  url: string;
  alt: string;
};

export function ProductGallery({ images, productName }: { images: ProductImage[]; productName: string }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images[selectedIndex];

  return (
    <div>
      <div className="relative flex h-96 items-center justify-center border border-line bg-ink">
        {selectedImage ? (
          <Image
            src={selectedImage.url}
            alt={selectedImage.alt || productName}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-8"
            priority
          />
        ) : (
          <span className="font-label text-sm tracking-[0.2em] text-stone">
            {productName.toUpperCase()}
          </span>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2" aria-label="Product image gallery">
          {images.map((image, index) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square border bg-ink transition-colors ${
                selectedIndex === index ? "border-gold" : "border-line hover:border-gold/60"
              }`}
              aria-label={`Show product image ${index + 1}`}
              aria-pressed={selectedIndex === index}
            >
              <Image
                src={image.url}
                alt=""
                fill
                sizes="120px"
                className="object-contain p-2"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
