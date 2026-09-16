import type { Metadata } from "next";
import Image from "next/image";

const certificatePath = "/images/certificate-of-authenticity.webp";

export const metadata: Metadata = {
  title: "Certificate of Authenticity",
  description:
    "View the certificate of authenticity included with every Dracula's Soil souvenir.",
};

export default function CertificatePage() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="fog-layer absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-eyebrow text-gold">DRACULA&apos;S SOIL</p>
          <h1 className="mt-3 font-display text-4xl tracking-wide sm:text-5xl">
            Certificate of Authenticity
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-stone">
            Every souvenir includes this certificate, confirming the origin and authenticity
            of the soil collected near Bran Castle in Transylvania, Romania.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-6xl rounded-sm border border-gold/30 bg-ink p-2 shadow-2xl shadow-black/50 sm:p-4">
          <a
            href={certificatePath}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Open the certificate of authenticity at full size"
            className="block overflow-hidden rounded-sm bg-black"
          >
            <Image
              src={certificatePath}
              alt="Dracula's Soil certificate of authenticity featuring Bran Castle, a red wax seal, and the product authenticity statement"
              width={1122}
              height={768}
              priority
              unoptimized
              sizes="(max-width: 1280px) 100vw, 1122px"
              className="h-auto w-full"
            />
          </a>
        </div>

        <div className="mt-6 text-center">
          <a
            href={certificatePath}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex border border-gold/40 px-5 py-3 font-label text-xs tracking-[0.15em] text-gold-bright transition-colors hover:border-gold hover:text-bone"
          >
            VIEW FULL SIZE
          </a>
        </div>
      </div>
    </section>
  );
}
