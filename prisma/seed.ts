import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      "Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env before running the seed script."
    );
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, passwordHash },
  });
  console.log(`✔ Admin ready: ${admin.email}`);

  const existingProduct = await prisma.product.findUnique({
    where: { slug: "dracula-s-soil-original" },
  });

  if (!existingProduct) {
    await prisma.product.create({
      data: {
        slug: "dracula-s-soil-original",
        name: "Dracula's Soil — Original",
        shortDesc: "Authentic soil collected near Bran Castle, Transylvania.",
        description:
          "<p>Each jar contains authentic soil, hand-collected near Bran Castle, in the heart of Transylvania. Carefully packaged and accompanied by a signed certificate of authenticity.</p>",
        priceCents: 4900,
        stock: 100,
        isActive: true,
        isFeatured: true,
        metaTitle: "Dracula's Soil — Authentic Soil from Transylvania",
        metaDesc: "Authentic soil collected near Bran Castle, with certificate of authenticity included. Worldwide shipping.",
        images: {
          create: [
            { url: "/images/product-bottle-rock.jpg", alt: "Dracula's Soil bottle", position: 0 },
          ],
        },
      },
    });
    console.log("✔ Example product created: Dracula's Soil — Original");
  } else {
    console.log("• Example product already exists, skipped.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
