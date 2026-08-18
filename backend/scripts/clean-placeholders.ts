import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanPlaceholders() {
  const newsWithPlaceholders = await prisma.news.findMany({
    where: {
      featuredImage: { contains: 'PLACEHOLDER' },
    },
  });

  console.log(`Found ${newsWithPlaceholders.length} articles with placeholder strings.`);

  for (const n of newsWithPlaceholders) {
    await prisma.news.update({
      where: { id: n.id },
      data: { featuredImage: null },
    });
  }

  const productsWithPlaceholders = await prisma.product.findMany({
    where: {
      imageUrl: { contains: 'PLACEHOLDER' },
    },
  });

  console.log(`Found ${productsWithPlaceholders.length} products with placeholder strings.`);

  for (const p of productsWithPlaceholders) {
    await prisma.product.update({
      where: { id: p.id },
      data: { imageUrl: null },
    });
  }

  await prisma.$disconnect();
  console.log('Cleanup completed.');
}

cleanPlaceholders().catch(console.error);
