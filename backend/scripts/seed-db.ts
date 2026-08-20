import { Client } from 'pg';
import bcrypt from 'bcryptjs';

async function seed() {
  const client = new Client({
    user: 'postgres.iudcuyidfvnirultvsxy',
    host: 'aws-0-eu-west-2.pooler.supabase.com',
    database: 'postgres',
    password: 'Akshay@551120',
    port: 6543,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('Seeding initial data into Supabase...');

  // 1. Admin User
  const passwordHash = await bcrypt.hash('admin123!', 12);
  await client.query(`
    INSERT INTO "users" ("id", "name", "email", "password_hash", "role", "updated_at")
    VALUES ('admin-01', 'UNB Admin', 'admin@unb.co.za', $1, 'ADMIN', NOW())
    ON CONFLICT ("email") DO NOTHING;
  `, [passwordHash]);

  // 2. Editor User
  const editorPasswordHash = await bcrypt.hash('editor123!', 12);
  await client.query(`
    INSERT INTO "users" ("id", "name", "email", "password_hash", "role", "updated_at")
    VALUES ('editor-01', 'UNB Editor', 'editor@unb.co.za', $1, 'EDITOR', NOW())
    ON CONFLICT ("email") DO NOTHING;
  `, [editorPasswordHash]);

  // 3. Categories & Products
  await client.query(`
    INSERT INTO "categories" ("id", "name", "slug", "description", "display_order", "updated_at")
    VALUES 
      ('cat-01', 'Sorghum Beverages', 'sorghum-beverages', 'Traditional African sorghum-based malt beverages and traditional beers.', 1, NOW()),
      ('cat-02', 'Maize Beverages', 'maize-beverages', 'Refreshing, nutritious non-alcoholic fermented maize beverages (Mageu).', 2, NOW()),
      ('cat-03', 'Ready-to-Drink (RTD)', 'ready-to-drink', 'Modern ready-to-drink packaged beverages crafted for everyday refreshment.', 3, NOW())
    ON CONFLICT ("slug") DO NOTHING;
  `);

  // 4. Sample Products
  await client.query(`
    INSERT INTO "products" ("id", "category_id", "name", "slug", "short_description", "description", "image_url", "is_featured", "status", "display_order", "updated_at")
    VALUES 
      ('prod-01', 'cat-01', 'Chibuku Shake Shake', 'chibuku-shake-shake', 'The legendary African sorghum beer with living yeast.', 'Chibuku Shake Shake is a traditional opaque beer brewed with malted sorghum and maize.', 'https://images.unsplash.com/photo-1608270190562-b9185a539b4b?w=600&auto=format&fit=crop&q=80', true, 'PUBLISHED', 1, NOW()),
      ('prod-02', 'cat-02', 'Super Mageu Number 1', 'super-mageu-number-1', 'South Africas favorite smooth fermented maize drink.', 'Enriched with essential B-vitamins and minerals for sustained energy throughout the day.', 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80', true, 'PUBLISHED', 2, NOW())
    ON CONFLICT ("slug") DO NOTHING;
  `);

  // 5. Sample Jobs
  await client.query(`
    INSERT INTO "jobs" ("id", "title", "slug", "location", "employment_type", "description", "requirements", "responsibilities", "status", "updated_at")
    VALUES 
      ('job-01', 'Brewery Production Manager', 'brewery-production-manager', 'Johannesburg, Gauteng', 'Full-time', 'Lead end-to-end brewery operations ensuring exceptional quality and safety standards.', 'BSc in Brewing, Food Science or Chemical Engineering. 5+ years FMCG experience.', 'Manage brewing schedules, oversee hygiene compliance, lead continuous improvement initiatives.', 'PUBLISHED', NOW()),
      ('job-02', 'Senior Brand Marketing Manager', 'senior-brand-marketing-manager', 'Durban, KwaZulu-Natal', 'Full-time', 'Drive brand growth and marketing strategies across our sorghum beverage portfolio.', 'Degree in Marketing or Business. 6+ years FMCG brand marketing.', 'Execute brand campaigns, oversee retail merchandising, manage ATL/BTL marketing budgets.', 'PUBLISHED', NOW())
    ON CONFLICT ("slug") DO NOTHING;
  `);

  // 6. Sample News
  await client.query(`
    INSERT INTO "news" ("id", "title", "slug", "category", "summary", "content", "status", "published_at", "updated_at")
    VALUES 
      ('news-01', 'UNB Expands Sustainable Sourcing Across Rural Farmers', 'unb-expands-sustainable-sourcing-across-rural-farmers', 'Sustainability', 'Empowering local sorghum and maize farmers through long-term supply partnerships.', 'United National Breweries has announced an expansion of its agricultural support program, partnering with more than 350 smallholder farmers.', 'PUBLISHED', NOW(), NOW()),
      ('news-02', 'UNB Recognized for Water Conservation Excellence', 'unb-recognized-for-water-conservation-excellence', 'Awards', 'Achieving 30% reduction in water intensity across all regional brewing facilities.', 'Through smart water recycling and state-of-the-art effluent treatment plants, UNB sets new sustainability benchmarks.', 'PUBLISHED', NOW(), NOW())
    ON CONFLICT ("slug") DO NOTHING;
  `);

  console.log('Database seeded with admin, products, jobs, and news!');
  await client.end();
}

seed().catch(err => {
  console.error('Seed Error:', err);
  process.exit(1);
});
