import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('[SEED] Starting database seed...');

  // ─── Admin User ─────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('admin123!', 12);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@unb.co.za' },
    update: {},
    create: {
      name: 'UNB Admin',
      email: 'admin@unb.co.za',
      passwordHash,
      role: 'ADMIN',
    },
  });
  console.log('[SEED] Admin user:', adminUser.email);

  // ─── Editor User ────────────────────────────────────────────────────────────
  const editorPasswordHash = await bcrypt.hash('editor123!', 12);
  const editorUser = await prisma.user.upsert({
    where: { email: 'editor@unb.co.za' },
    update: {},
    create: {
      name: 'UNB Editor',
      email: 'editor@unb.co.za',
      passwordHash: editorPasswordHash,
      role: 'EDITOR',
    },
  });
  console.log('[SEED] Editor user:', editorUser.email);

  // ─── Product Categories ──────────────────────────────────────────────────────
  const sorghumCat = await prisma.category.upsert({
    where: { slug: 'sorghum-beverages' },
    update: {},
    create: {
      name: 'Sorghum Beverages',
      slug: 'sorghum-beverages',
      description: '[CLIENT TO PROVIDE]',
      displayOrder: 1,
    },
  });

  const maltCat = await prisma.category.upsert({
    where: { slug: 'malt-beverages' },
    update: {},
    create: {
      name: 'Malt Beverages',
      slug: 'malt-beverages',
      description: '[CLIENT TO PROVIDE]',
      displayOrder: 2,
    },
  });

  const softDrinksCat = await prisma.category.upsert({
    where: { slug: 'soft-drinks' },
    update: {},
    create: {
      name: 'Soft Drinks',
      slug: 'soft-drinks',
      description: '[CLIENT TO PROVIDE]',
      displayOrder: 3,
    },
  });
  console.log('[SEED] Categories created');

  // ─── Sample Products ──────────────────────────────────────────────────────────
  await prisma.product.upsert({
    where: { slug: 'chibuku-super' },
    update: {},
    create: {
      name: 'Chibuku Super',
      slug: 'chibuku-super',
      categoryId: sorghumCat.id,
      shortDescription: '[CLIENT TO PROVIDE]',
      description: '[CLIENT TO PROVIDE]',
      isFeatured: true,
      status: 'PUBLISHED',
      displayOrder: 1,
    },
  });

  await prisma.product.upsert({
    where: { slug: 'lion-lager' },
    update: {},
    create: {
      name: 'Lion Lager',
      slug: 'lion-lager',
      categoryId: maltCat.id,
      shortDescription: '[CLIENT TO PROVIDE]',
      description: '[CLIENT TO PROVIDE]',
      isFeatured: true,
      status: 'PUBLISHED',
      displayOrder: 1,
    },
  });

  await prisma.product.upsert({
    where: { slug: 'sparkling-water' },
    update: {},
    create: {
      name: 'Sparkling Water',
      slug: 'sparkling-water',
      categoryId: softDrinksCat.id,
      shortDescription: '[CLIENT TO PROVIDE]',
      description: '[CLIENT TO PROVIDE]',
      isFeatured: false,
      status: 'PUBLISHED',
      displayOrder: 1,
    },
  });
  console.log('[SEED] Sample products created');

  // ─── Sample Job ───────────────────────────────────────────────────────────────
  await prisma.job.upsert({
    where: { slug: 'sample-position' },
    update: {},
    create: {
      title: 'Sample Position — [CLIENT TO PROVIDE]',
      slug: 'sample-position',
      location: 'Pretoria, South Africa',
      employmentType: 'Full-time',
      description: '[CLIENT TO PROVIDE — full job description]',
      requirements: '[CLIENT TO PROVIDE]',
      responsibilities: '[CLIENT TO PROVIDE]',
      status: 'DRAFT',
    },
  });
  console.log('[SEED] Sample job created (DRAFT)');

  console.log('[SEED] Seed complete.');
  console.log('[SEED] ⚠️  Default admin password is "admin123!" — change immediately in production!');
}

main()
  .catch((e) => {
    console.error('[SEED ERROR]', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
