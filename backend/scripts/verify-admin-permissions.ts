import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const BASE_URL = 'http://localhost:5000/api';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';

async function verifyPermissions() {
  console.log('--- STARTING ROLE / PERMISSION MATRIX VERIFICATION ---');

  // 1. Ensure ADMIN and EDITOR users exist
  const adminPasswordHash = await bcrypt.hash('admin123!', 12);
  const editorPasswordHash = await bcrypt.hash('editor123!', 12);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@unb.co.za' },
    update: { role: 'ADMIN' },
    create: {
      name: 'UNB Admin',
      email: 'admin@unb.co.za',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  });

  const editorUser = await prisma.user.upsert({
    where: { email: 'editor@unb.co.za' },
    update: { role: 'EDITOR' },
    create: {
      name: 'UNB Content Editor',
      email: 'editor@unb.co.za',
      passwordHash: editorPasswordHash,
      role: 'EDITOR',
    },
  });

  const adminToken = jwt.sign({ id: adminUser.id, email: adminUser.email, role: 'ADMIN' }, JWT_SECRET, { expiresIn: '8h' });
  const editorToken = jwt.sign({ id: editorUser.id, email: editorUser.email, role: 'EDITOR' }, JWT_SECRET, { expiresIn: '8h' });

  // Fetch or create sample data for testing
  let category = await prisma.category.findFirst();
  if (!category) {
    category = await prisma.category.create({
      data: { name: 'Test Category', slug: `test-cat-${Date.now()}` },
    });
  }

  // Create temporary test items for deletion tests
  const testProduct = await prisma.product.create({
    data: {
      name: 'Temp Test Product',
      slug: `temp-prod-${Date.now()}`,
      categoryId: category.id,
      status: 'DRAFT',
    },
  });

  const testNews = await prisma.news.create({
    data: {
      title: 'Temp Test News',
      slug: `temp-news-${Date.now()}`,
      content: 'Temp test content',
      status: 'DRAFT',
    },
  });

  const testJob = await prisma.job.create({
    data: {
      title: 'Temp Test Job',
      slug: `temp-job-${Date.now()}`,
      description: 'Temp test description',
      status: 'DRAFT',
    },
  });

  const testApp = await prisma.application.create({
    data: {
      jobId: testJob.id,
      name: 'Temp Applicant',
      email: 'temp@unb.co.za',
      applicationStatus: 'NEW',
    },
  });

  const testEnquiry = await prisma.enquiry.create({
    data: {
      name: 'Temp Enquirer',
      email: 'enquirer@unb.co.za',
      enquiryType: 'General',
      message: 'Testing enquiry message content',
    },
  });

  const results: Array<{
    resource: string;
    action: string;
    method: string;
    endpoint: string;
    unauthExpected: number;
    unauthActual: number;
    editorExpected: number;
    editorActual: number;
    adminExpected: number;
    adminActual: number;
    pass: boolean;
  }> = [];

  const testEndpoint = async (
    resource: string,
    action: string,
    method: string,
    endpoint: string,
    body: any,
    editorExpected: number,
    adminExpected: number
  ) => {
    // 1. Unauthenticated test
    const unauthRes = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined,
    });
    const unauthActual = unauthRes.status;

    // 2. Editor test
    const editorRes = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${editorToken}`,
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const editorActual = editorRes.status;

    // 3. Admin test
    const adminRes = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${adminToken}`,
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const adminActual = adminRes.status;

    const pass = unauthActual === 401 && editorActual === editorExpected && adminActual === adminExpected;

    results.push({
      resource,
      action,
      method,
      endpoint,
      unauthExpected: 401,
      unauthActual,
      editorExpected,
      editorActual,
      adminExpected,
      adminActual,
      pass,
    });

    console.log(
      `[${pass ? 'PASS' : 'FAIL'}] ${method} ${endpoint} | Unauth: ${unauthActual} (exp 401) | Editor: ${editorActual} (exp ${editorExpected}) | Admin: ${adminActual} (exp ${adminExpected})`
    );
  };

  // Products tests
  const deleteProduct = await prisma.product.create({
    data: { name: 'Delete Product', slug: `del-prod-${Date.now()}`, categoryId: category.id, status: 'DRAFT' },
  });
  await testEndpoint('Products', 'List Products', 'GET', '/admin/products', null, 200, 200);
  await testEndpoint('Products', 'Patch Product Status', 'PATCH', `/admin/products/${testProduct.id}/status`, { status: 'PUBLISHED' }, 200, 200);
  await testEndpoint('Products', 'Delete Product (Editor vs Admin)', 'DELETE', `/admin/products/${deleteProduct.id}`, null, 403, 200);

  // News tests
  const deleteNews = await prisma.news.create({
    data: { title: 'Delete News', slug: `del-news-${Date.now()}`, content: 'Content', status: 'DRAFT' },
  });
  await testEndpoint('News', 'List News', 'GET', '/admin/news', null, 200, 200);
  await testEndpoint('News', 'Patch News Status', 'PATCH', `/admin/news/${testNews.id}/status`, { status: 'PUBLISHED' }, 200, 200);
  await testEndpoint('News', 'Delete News (Editor vs Admin)', 'DELETE', `/admin/news/${deleteNews.id}`, null, 403, 200);

  // Jobs tests
  const deleteJob = await prisma.job.create({
    data: { title: 'Delete Job', slug: `del-job-${Date.now()}`, description: 'Description', status: 'DRAFT' },
  });
  await testEndpoint('Jobs', 'List Jobs', 'GET', '/admin/jobs', null, 200, 200);
  await testEndpoint('Jobs', 'Patch Job Status', 'PATCH', `/admin/jobs/${testJob.id}/status`, { status: 'PUBLISHED' }, 200, 200);
  await testEndpoint('Jobs', 'Delete Job (Editor vs Admin)', 'DELETE', `/admin/jobs/${deleteJob.id}`, null, 403, 200);

  // Applications tests
  await testEndpoint('Applications', 'List Applications', 'GET', '/admin/applications', null, 200, 200);
  await testEndpoint('Applications', 'Get Application Detail', 'GET', `/admin/applications/${testApp.id}`, null, 200, 200);
  await testEndpoint('Applications', 'Patch Application Status', 'PATCH', `/admin/applications/${testApp.id}/status`, { applicationStatus: 'REVIEWING' }, 200, 200);

  // Enquiries tests
  await testEndpoint('Enquiries', 'List Enquiries', 'GET', '/admin/enquiries', null, 200, 200);
  await testEndpoint('Enquiries', 'Get Enquiry Detail', 'GET', `/admin/enquiries/${testEnquiry.id}`, null, 200, 200);

  // Cleanup test items
  await prisma.application.deleteMany({ where: { id: testApp.id } });
  await prisma.enquiry.deleteMany({ where: { id: testEnquiry.id } });
  await prisma.job.deleteMany({ where: { id: testJob.id } });
  await prisma.news.deleteMany({ where: { id: testNews.id } });
  await prisma.product.deleteMany({ where: { id: testProduct.id } });

  await prisma.$disconnect();
  console.log('\n--- PERMISSIONS VERIFICATION COMPLETE ---');
}

verifyPermissions().catch(console.error);
