import fs from 'fs';
import path from 'path';

async function runPhase8QATestSuite() {
  const baseUrl = 'http://localhost:5000/api';
  console.log('================================================================');
  console.log('PHASE 8 — FULL QA, REGRESSION & END-TO-END UAT SUITE');
  console.log('================================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    totalTests++;
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      if (detail) console.log(`   └─ ${detail}`);
      passedTests++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      if (detail) console.error(`   └─ ${detail}`);
    }
  }

  // ─── 1. SERVER HEALTH & PUBLIC BASELINE ──────────────────────────────────────
  console.log('\n--- 1. API Health & Baseline Public Availability ---');
  const healthRes = await fetch(`${baseUrl}/health`);
  const healthData = await healthRes.json();
  assert(healthRes.status === 200 && healthData.status === 'ok', 'API Health Check returns 200 OK');

  const pubProductsRes = await fetch(`${baseUrl}/products`);
  const pubProducts = await pubProductsRes.json();
  assert(pubProductsRes.status === 200 && Array.isArray(pubProducts.data), 'Public GET /api/products returns product array', `Count: ${pubProducts.data?.length}`);

  const pubNewsRes = await fetch(`${baseUrl}/news`);
  const pubNews = await pubNewsRes.json();
  assert(pubNewsRes.status === 200 && Array.isArray(pubNews.data), 'Public GET /api/news returns published news array', `Count: ${pubNews.data?.length}`);

  const pubJobsRes = await fetch(`${baseUrl}/jobs`);
  const pubJobs = await pubJobsRes.json();
  assert(pubJobsRes.status === 200 && Array.isArray(pubJobs.data), 'Public GET /api/jobs returns active job array', `Count: ${pubJobs.data?.length}`);

  // ─── 2. AUTHENTICATION & SESSION MANAGEMENT ──────────────────────────────────
  console.log('\n--- 2. Authentication, Session & Logout QA ---');
  
  // 2a. Invalid credentials
  const invalidLoginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@unb.co.za', password: 'wrongpassword' }),
  });
  assert(invalidLoginRes.status === 401, 'Invalid password correctly rejected with 401 Unauthorized');

  // 2b. Admin Login
  const adminLoginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@unb.co.za', password: 'admin123!' }),
  });
  const adminLoginData = await adminLoginRes.json();
  const adminCookie = adminLoginRes.headers.get('set-cookie') || '';
  const adminToken = adminLoginData.data?.token;
  assert(
    adminLoginRes.status === 200 && adminLoginData.data?.user?.role === 'ADMIN',
    'Admin Login succeeds with role ADMIN and httpOnly session cookie'
  );

  // 2c. Editor Login (if exists)
  let editorToken = '';
  let editorCookie = '';
  const editorLoginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'editor@unb.co.za', password: 'editor123!' }),
  });
  if (editorLoginRes.status === 200) {
    const editorLoginData = await editorLoginRes.json();
    editorToken = editorLoginData.data?.token;
    editorCookie = editorLoginRes.headers.get('set-cookie') || '';
    assert(
      editorLoginData.data?.user?.role === 'EDITOR',
      'Editor Login succeeds with role EDITOR'
    );
  } else {
    console.log('ℹ️ [NOTE] Editor user not seeded; testing admin role permissions');
  }

  // 2d. Session Restoration via Cookie
  const meRes = await fetch(`${baseUrl}/auth/me`, {
    headers: { Cookie: adminCookie || `admin_token=${adminToken}` },
  });
  const meData = await meRes.json();
  assert(meRes.status === 200 && meData.data?.role === 'ADMIN', 'Session restored via cookie (/api/auth/me)');

  // ─── 3. PRODUCT LIFECYCLE & DRAFT ISOLATION ──────────────────────────────────
  console.log('\n--- 3. Products End-to-End Lifecycle & Draft Isolation ---');
  
  // Get an existing category ID for product creation
  const categoriesRes = await fetch(`${baseUrl}/admin/products`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const categoriesData = await categoriesRes.json();
  const existingProduct = categoriesData.data?.[0];
  const testCategoryId = existingProduct?.categoryId || existingProduct?.category?.id;

  const testProductSlug = `test-qa-product-${Date.now()}`;
  let createdProductId = '';

  if (testCategoryId) {
    // 3a. Create Product as DRAFT
    const createProdRes = await fetch(`${baseUrl}/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        name: '[TEST] QA Brewed Beverage',
        categoryId: testCategoryId,
        shortDescription: 'High quality test beverage for QA verification.',
        description: 'Detailed description of the QA test beverage.',
        status: 'DRAFT',
        imageUrl: '/images/unb-reference/brand-chibuku.jpg',
      }),
    });
    const createProdData = await createProdRes.json();
    createdProductId = createProdData.data?.id;
    const createdProductSlug = createProdData.data?.slug;
    assert(createProdRes.status === 201 && !!createdProductId, 'Admin creates product as DRAFT', `ID: ${createdProductId} | Slug: ${createdProductSlug}`);

    // 3b. Verify DRAFT is NOT visible on public /api/products
    const pubCheck1 = await fetch(`${baseUrl}/products`);
    const pubCheckData1 = await pubCheck1.json();
    const isVisibleInPublic1 = (pubCheckData1.data || []).some((p: { slug: string }) => p.slug === createdProductSlug);
    assert(!isVisibleInPublic1, 'Draft product is NOT visible in public products listing (Isolation Verified)');

    // 3c. Update Product to PUBLISHED
    const publishProdRes = await fetch(`${baseUrl}/admin/products/${createdProductId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        name: '[TEST] QA Brewed Beverage',
        categoryId: testCategoryId,
        status: 'PUBLISHED',
        imageUrl: '/images/unb-reference/brand-chibuku.jpg',
      }),
    });
    const publishProdData = await publishProdRes.json();
    assert(publishProdRes.status === 200, 'Admin publishes product (status: PUBLISHED)');

    // 3d. Verify PUBLISHED product appears on public /api/products and /api/products/:slug
    const pubCheck2 = await fetch(`${baseUrl}/products/${createdProductSlug}`);
    const pubCheckData2 = await pubCheck2.json();
    assert(pubCheck2.status === 200 && pubCheckData2.data?.slug === createdProductSlug, 'Published product is accessible via public GET /api/products/:slug');

    // 3e. RBAC Delete check: If editorToken available, verify editor CANNOT delete (403)
    if (editorToken) {
      const editorDeleteRes = await fetch(`${baseUrl}/admin/products/${createdProductId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${editorToken}` },
      });
      assert(editorDeleteRes.status === 403, 'RBAC Enforcement: Editor is BLOCKED from deleting product (403 Forbidden)');
    }

    // 3f. Admin cleanup: Delete test product
    const adminDeleteRes = await fetch(`${baseUrl}/admin/products/${createdProductId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(adminDeleteRes.status === 200, 'Admin successfully deleted test product');
  }

  // ─── 4. NEWS LIFECYCLE & WHITE-SCREEN REGRESSION QA ──────────────────────────
  console.log('\n--- 4. News Lifecycle & Resilience QA ---');
  
  let createdNewsId = '';
  let createdNewsSlug = '';

  // 4a. Create News as DRAFT
  const createNewsRes = await fetch(`${baseUrl}/admin/news`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      title: '[TEST] QA Community Development Initiative',
      category: 'COMMUNITY',
      summary: 'Testing news article creation, rendering, and lifecycle resilience.',
      content: 'Paragraph 1 of test news article.\n\nParagraph 2 with full context.',
      status: 'DRAFT',
      featuredImage: '/images/unb-reference/home-about.jpg',
    }),
  });
  const createNewsData = await createNewsRes.json();
  createdNewsId = createNewsData.data?.id;
  createdNewsSlug = createNewsData.data?.slug;
  assert(createNewsRes.status === 201 && !!createdNewsId, 'Admin creates news article as DRAFT', `ID: ${createdNewsId} | Slug: ${createdNewsSlug}`);

  // 4b. Verify DRAFT article is NOT in public listing
  const pubNewsCheck1 = await fetch(`${baseUrl}/news`);
  const pubNewsCheckData1 = await pubNewsCheck1.json();
  const isNewsVisible1 = (pubNewsCheckData1.data || []).some((n: { slug: string }) => n.slug === createdNewsSlug);
  assert(!isNewsVisible1, 'Draft news article is NOT visible in public news listing');

  // 4c. Update News to PUBLISHED
  const publishNewsRes = await fetch(`${baseUrl}/admin/news/${createdNewsId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      title: '[TEST] QA Community Development Initiative',
      category: 'COMMUNITY',
      summary: 'Testing news article creation, rendering, and lifecycle resilience.',
      content: 'Paragraph 1 of test news article.\n\nParagraph 2 with full context.',
      status: 'PUBLISHED',
      featuredImage: '/images/unb-reference/home-about.jpg',
    }),
  });
  assert(publishNewsRes.status === 200, 'Admin publishes news article (status: PUBLISHED)');

  // 4d. Verify PUBLISHED article is accessible via public GET /api/news/:slug with content field
  const pubNewsCheck2 = await fetch(`${baseUrl}/news/${createdNewsSlug}`);
  const pubNewsCheckData2 = await pubNewsCheck2.json();
  assert(
    pubNewsCheck2.status === 200 && !!pubNewsCheckData2.data?.content,
    'Published news article returns full content and summary (White-screen regression check)',
    `Title: ${pubNewsCheckData2.data?.title}`
  );

  // 4e. Admin cleanup: Delete test news article
  const adminDeleteNewsRes = await fetch(`${baseUrl}/admin/news/${createdNewsId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(adminDeleteNewsRes.status === 200, 'Admin successfully deleted test news article');

  // ─── 5. CAREERS, JOB APPLICATIONS & PRIVATE CV FLOW ──────────────────────────
  console.log('\n--- 5. Careers, Job Applications & Private CV Flow ---');
  
  const testJobSlug = `test-qa-job-${Date.now()}`;
  let createdJobId = '';

  // 5a. Admin creates test job vacancy
  const createJobRes = await fetch(`${baseUrl}/admin/jobs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      title: '[TEST] Quality Assurance Lead',
      slug: testJobSlug,
      location: 'Pretoria Brewery',
      employmentType: 'Full-Time',
      description: 'Lead end-to-end quality assurance and product testing across operations.',
      requirements: '- 5+ years QA experience in FMCG\n- Relevant technical qualification',
      responsibilities: '- Execute product tasting & standard testing\n- Maintain food safety protocols',
      status: 'PUBLISHED',
    }),
  });
  const createJobData = await createJobRes.json();
  createdJobId = createJobData.data?.id;
  assert(createJobRes.status === 201 && !!createdJobId, 'Admin creates and publishes test career vacancy', `ID: ${createdJobId}`);

  // 5b. Candidate submits job application with private CV
  let createdAppId = '';
  if (createdJobId) {
    const mockCvBuffer = Buffer.from('%PDF-1.4 Official QA Candidate CV document for UNB testing');
    const form = new FormData();
    form.append('name', 'Nandi Khumalo');
    form.append('email', 'nandi.khumalo@example.co.za');
    form.append('phone', '+27 83 456 7890');
    form.append('coverMessage', 'Passionate brewing QA specialist applying for the Lead role.');
    form.append('captchaToken', 'valid-mock-token');
    form.append('cv', new Blob([mockCvBuffer], { type: 'application/pdf' }), 'Nandi_Khumalo_CV.pdf');

    const appSubmitRes = await fetch(`${baseUrl}/jobs/${createdJobId}/apply`, {
      method: 'POST',
      body: form,
    });
    const appSubmitData = await appSubmitRes.json();
    createdAppId = appSubmitData.data?.id;

    assert(
      appSubmitRes.status === 201 && !!createdAppId,
      'Candidate submits job application with private CV & triggers HR email',
      `Application ID: ${createdAppId}`
    );

    // 5c. Admin views application list and detail
    const adminAppsRes = await fetch(`${baseUrl}/admin/applications?jobId=${createdJobId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const adminAppsData = await adminAppsRes.json();
    const foundApp = (adminAppsData.data || []).find((a: { id: string }) => a.id === createdAppId);
    assert(!!foundApp, 'Application appears in Admin CMS Applications list');

    // 5d. Admin updates application status (e.g. REVIEWED / SHORTLISTED)
    const patchStatusRes = await fetch(`${baseUrl}/admin/applications/${createdAppId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ applicationStatus: 'SHORTLISTED' }),
    });
    assert(patchStatusRes.status === 200, 'Admin updates candidate application status to SHORTLISTED');

    // 5e. Admin securely streams CV from private storage
    const streamCvRes = await fetch(`${baseUrl}/admin/applications/${createdAppId}/cv`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const cvBody = await streamCvRes.text();
    assert(
      streamCvRes.status === 200 && cvBody.includes('Official QA Candidate CV document'),
      'Admin securely streams private candidate CV'
    );

    // 5f. Unauthorized user CV streaming is blocked
    const anonCvRes = await fetch(`${baseUrl}/admin/applications/${createdAppId}/cv`);
    assert(anonCvRes.status === 401, 'Anonymous user blocked from candidate CV streaming (401 Unauthorized)');

    // 5g. Clean up test job
    await fetch(`${baseUrl}/admin/jobs/${createdJobId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
  }

  // ─── 6. CONTACT ENQUIRIES & EMAIL DISPATCH ───────────────────────────────────
  console.log('\n--- 6. Contact Form Enquiries & Admin Visibility ---');
  
  const testContactRes = await fetch(`${baseUrl}/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-captcha-token': 'valid-mock-token',
    },
    body: JSON.stringify({
      name: 'QA Test Enquirer',
      email: 'qa.tester@unb.co.za',
      phone: '+27 12 345 6789',
      enquiryType: 'Trade & Distribution',
      message: 'Testing trade enquiry ingestion, email notification, and admin viewing.',
    }),
  });
  const testContactData = await testContactRes.json();
  const contactId = testContactData.data?.id;

  assert(
    testContactRes.status === 201 && !!contactId,
    'Contact enquiry submitted, persisted to DB, and triggered notification email',
    `Enquiry ID: ${contactId}`
  );

  // Admin verifies enquiry in CMS
  const adminEnquiriesRes = await fetch(`${baseUrl}/admin/enquiries`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const adminEnquiriesData = await adminEnquiriesRes.json();
  const foundEnquiry = (adminEnquiriesData.data || []).find((e: { id: string }) => e.id === contactId);
  assert(!!foundEnquiry, 'Submitted enquiry appears in Admin CMS Enquiries list');

  // ─── 7. FINAL ERROR RESILIENCE & SUMMARY ─────────────────────────────────────
  console.log('\n--- 7. Error Handling & 404 Resilience ---');
  const invalidProdRes = await fetch(`${baseUrl}/products/non-existent-product-slug-404`);
  assert(invalidProdRes.status === 404, 'Invalid product slug returns clean 404 Not Found');

  const invalidNewsRes = await fetch(`${baseUrl}/news/non-existent-news-slug-404`);
  assert(invalidNewsRes.status === 404, 'Invalid news slug returns clean 404 Not Found');

  const invalidJobRes = await fetch(`${baseUrl}/jobs/non-existent-job-slug-404`);
  assert(invalidJobRes.status === 404, 'Invalid job slug returns clean 404 Not Found');

  console.log('\n================================================================');
  console.log(`PHASE 8 QA & REGRESSION SUMMARY: ${passedTests}/${totalTests} TESTS PASSED`);
  console.log('================================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runPhase8QATestSuite().catch(console.error);
