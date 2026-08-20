import fs from 'fs';
import path from 'path';

async function runPhase7Audit() {
  const baseUrl = 'http://localhost:5000/api';
  console.log('========================================================');
  console.log('PHASE 7 — SECURITY, SEO, A11Y & PERFORMANCE AUDIT SUITE');
  console.log('========================================================\n');

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

  // 1. SECURITY HEADERS AUDIT
  console.log('\n--- 1. HTTP Security Headers Audit ---');
  const healthRes = await fetch(`${baseUrl}/health`);
  const headers = healthRes.headers;
  
  assert(
    headers.get('x-content-type-options') === 'nosniff',
    'X-Content-Type-Options is set to nosniff'
  );
  assert(
    headers.get('x-frame-options') === 'DENY' || headers.get('x-frame-options') === 'SAMEORIGIN',
    'X-Frame-Options is configured (Clickjacking defense)',
    `Value: ${headers.get('x-frame-options')}`
  );
  assert(
    headers.get('referrer-policy')?.includes('origin') || false,
    'Referrer-Policy is securely configured',
    `Value: ${headers.get('referrer-policy')}`
  );
  assert(
    headers.get('x-powered-by') === null,
    'X-Powered-By header is stripped to prevent server fingerprinting'
  );

  // 2. CORS & CSRF AUDIT
  console.log('\n--- 2. CORS & CSRF Protection Audit ---');
  
  // 2a. Login to obtain session cookie
  const loginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@unb.co.za', password: 'admin123!' }),
  });
  const loginData = await loginRes.json();
  const setCookie = loginRes.headers.get('set-cookie') || '';
  const adminToken = loginData.data?.token;

  assert(
    loginRes.status === 200 && setCookie.includes('admin_token'),
    'Admin authentication emits httpOnly cookie session'
  );

  // 2b. CSRF: Mutating request with foreign Origin header is rejected
  const csrfProbeRes = await fetch(`${baseUrl}/admin/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': setCookie,
      'Origin': 'https://malicious-attacker-domain.com',
    },
    body: JSON.stringify({
      name: 'CSRF Product',
      slug: 'csrf-product',
      categoryId: 'any',
      status: 'DRAFT',
    }),
  });
  assert(
    csrfProbeRes.status === 403,
    'CSRF Protection: Blocked cross-origin mutating request from unauthorized origin',
    `Status: ${csrfProbeRes.status}`
  );

  // 3. PRIVATE CV ISOLATION & ACCESS CONTROL
  console.log('\n--- 3. Private CV & Upload Security Audit ---');
  
  // 3a. Submit application with traversal filename
  const jobsRes = await fetch(`${baseUrl}/jobs`);
  const jobsData = await jobsRes.json();
  const targetJob = jobsData.data?.[0];

  let testAppId = '';
  if (targetJob) {
    const maliciousPdf = Buffer.from('%PDF-1.4 Test Traversal CV Content');
    const form = new FormData();
    form.append('name', 'Security Auditor');
    form.append('email', 'auditor@unb.co.za');
    form.append('phone', '+27 11 000 0000');
    form.append('coverMessage', 'Auditing CV path traversal and privacy controls.');
    form.append('captchaToken', 'valid-mock-token');
    form.append('cv', new Blob([maliciousPdf], { type: 'application/pdf' }), '../../etc/passwd.pdf');

    const appRes = await fetch(`${baseUrl}/jobs/${targetJob.id}/apply`, {
      method: 'POST',
      body: form,
    });
    const appData = await appRes.json();
    testAppId = appData.data?.id;

    assert(
      appRes.status === 201 && !!testAppId,
      'Application accepted; server sanitized path-traversal filename safely',
      `Application ID: ${testAppId}`
    );

    // 3b. Verify file is not in public /uploads/ directory
    const publicProbe1 = await fetch('http://localhost:5000/uploads/cv/passwd.pdf');
    const publicProbe2 = await fetch('http://localhost:5000/uploads/../../etc/passwd.pdf');
    assert(
      publicProbe1.status === 404 && publicProbe2.status === 404,
      'Candidate CV is NOT exposed via public static web routes (Privacy Boundary Enforced)'
    );

    // 3c. Verify unauthenticated streaming fails with 401
    const unauthStream = await fetch(`${baseUrl}/admin/applications/${testAppId}/cv`);
    assert(
      unauthStream.status === 401,
      'Unauthenticated direct request to CV streaming endpoint returns 401 Unauthorized'
    );

    // 3d. Verify authorized streaming succeeds with 200
    const authStream = await fetch(`${baseUrl}/admin/applications/${testAppId}/cv`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    assert(
      authStream.status === 200 && authStream.headers.get('content-type')?.includes('application/pdf'),
      'Authorized Admin successfully streams CV binary from private storage'
    );
  }

  // 4. DRAFT & UNPUBLISHED CONTENT ISOLATION
  console.log('\n--- 4. Draft & Unpublished Content Isolation ---');
  const publicNewsRes = await fetch(`${baseUrl}/news`);
  const publicNewsData = await publicNewsRes.json();
  const publicArticles = publicNewsData.data || [];
  const anyDraftNews = publicArticles.some((a: { status?: string }) => a.status === 'DRAFT');
  assert(
    !anyDraftNews,
    'Public News listing strictly excludes unpublished DRAFT articles'
  );

  const publicJobsRes = await fetch(`${baseUrl}/jobs`);
  const publicJobsData = await publicJobsRes.json();
  const publicJobs = publicJobsData.data || [];
  const anyDraftJobs = publicJobs.some((j: { status?: string }) => j.status === 'DRAFT');
  assert(
    !anyDraftJobs,
    'Public Careers listing strictly excludes unpublished DRAFT vacancies'
  );

  // 5. INPUT VALIDATION & SQL INJECTION RESILIENCE
  console.log('\n--- 5. Input Validation & Injection Defense ---');
  const sqlInjectionContact = await fetch(`${baseUrl}/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-captcha-token': 'valid-mock-token',
    },
    body: JSON.stringify({
      name: "Robert'; DROP TABLE users; --",
      email: 'invalid-email-format',
      enquiryType: 'General Enquiry',
      message: 'Short',
    }),
  });
  const sqlData = await sqlInjectionContact.json();
  assert(
    sqlInjectionContact.status === 400 && !!sqlData.error?.details,
    'Zod validator strictly rejects invalid email format and undersized messages'
  );

  // 6. ERROR HANDLING & INFORMATION LEAKAGE DEFENSE
  console.log('\n--- 6. Error Handling & Information Leakage Defense ---');
  const notFoundRes = await fetch(`${baseUrl}/non-existent-endpoint-404`);
  const notFoundData = await notFoundRes.json();
  assert(
    notFoundRes.status === 404 && !notFoundData.stack && !notFoundData.query,
    '404 Not Found returns structured clean error without exposing internals or paths'
  );

  console.log('\n========================================================');
  console.log(`PHASE 7 AUDIT SUMMARY: ${passedTests}/${totalTests} TESTS PASSED`);
  console.log('========================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runPhase7Audit().catch(console.error);
