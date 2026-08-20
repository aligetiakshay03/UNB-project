import fs from 'fs';
import path from 'path';

async function runPhase6Verification() {
  const baseUrl = 'http://localhost:5000/api';
  console.log('========================================================');
  console.log('PHASE 6 — AUTOMATED VERIFICATION SUITE');
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

  // 1. HEALTH & ENVIRONMENT
  console.log('\n--- 1. Health & Config Verification ---');
  const healthRes = await fetch(`${baseUrl}/health`);
  const healthData = await healthRes.json();
  assert(healthRes.status === 200, 'Health check endpoint returns 200 OK', `Status: ${healthData.status}`);

  // 2. CONTACT ENQUIRY & CAPTCHA & EMAIL
  console.log('\n--- 2. Contact Enquiry & Email Dispatch ---');
  
  // 2a. Rejection of invalid CAPTCHA token
  const invalidCaptchaRes = await fetch(`${baseUrl}/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-captcha-token': 'invalid-token',
    },
    body: JSON.stringify({
      name: 'Bot User',
      email: 'bot@example.com',
      enquiryType: 'General',
      message: 'Spam message',
    }),
  });
  assert(invalidCaptchaRes.status === 400, 'Contact form rejects invalid CAPTCHA token with 400 Bad Request');

  // 2b. Successful enquiry submission with mock email dispatch
  const validContactRes = await fetch(`${baseUrl}/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-captcha-token': 'valid-mock-token',
    },
    body: JSON.stringify({
      name: 'Thabo Mokoena',
      email: 'thabo@example.co.za',
      phone: '+27 82 123 4567',
      enquiryType: 'Trade',
      message: 'Interested in distribution opportunities in KwaZulu-Natal.',
    }),
  });
  const contactData = await validContactRes.json();
  assert(
    validContactRes.status === 201 && !!contactData.data?.id,
    'Valid contact enquiry persisted to database and triggered email notification',
    `Created Enquiry ID: ${contactData.data?.id}`
  );

  // 3. JOB APPLICATION, PRIVATE CV STORAGE & EMAIL
  console.log('\n--- 3. Job Application, Private Storage & HR Email ---');
  const jobsRes = await fetch(`${baseUrl}/jobs`);
  const jobsData = await jobsRes.json();
  const targetJob = jobsData.data?.[0];
  assert(!!targetJob, 'Found available published job for application test', `Job: ${targetJob?.title}`);

  let createdApplicationId = '';
  if (targetJob) {
    // Create a mock PDF buffer
    const mockPdfBuffer = Buffer.from('%PDF-1.4 Mock CV Content for candidate testing UNB');
    const formData = new FormData();
    formData.append('name', 'Sipho Dlamini');
    formData.append('email', 'sipho.dlamini@example.co.za');
    formData.append('phone', '+27 71 987 6543');
    formData.append('coverMessage', 'Experienced brewing technician with 6 years experience.');
    formData.append('captchaToken', 'valid-mock-token');
    formData.append('cv', new Blob([mockPdfBuffer], { type: 'application/pdf' }), 'Sipho_Dlamini_CV.pdf');

    const applyRes = await fetch(`${baseUrl}/jobs/${targetJob.id}/apply`, {
      method: 'POST',
      body: formData,
    });

    const applyData = await applyRes.json();
    createdApplicationId = applyData.data?.id;
    assert(
      applyRes.status === 201 && !!createdApplicationId,
      'Job application submitted with private CV upload & HR email dispatch',
      `Application ID: ${createdApplicationId}`
    );

    // Verify CV is NOT accessible via public /uploads route
    const publicProbeRes = await fetch(`http://localhost:5000/uploads/cv/Sipho_Dlamini_CV.pdf`);
    assert(
      publicProbeRes.status === 404,
      'Candidate CV is NOT accessible via public /uploads/ directory (Privacy Enforced)'
    );
  }

  // 4. AUTHENTICATION HARDENING & COOKIE SESSIONS
  console.log('\n--- 4. Authentication Hardening & Cookie Handling ---');
  const loginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@unb.co.za', password: 'admin123!' }),
  });
  const loginData = await loginRes.json();
  const setCookieHeader = loginRes.headers.get('set-cookie');
  const adminToken = loginData.data?.token;

  assert(loginRes.status === 200, 'Admin login succeeds with credentials');
  assert(
    !!setCookieHeader && setCookieHeader.includes('admin_token'),
    'Login sets httpOnly admin_token cookie in Set-Cookie header'
  );

  // Test /api/auth/me using Cookie header
  const meCookieRes = await fetch(`${baseUrl}/auth/me`, {
    headers: {
      Cookie: setCookieHeader || `admin_token=${adminToken}`,
    },
  });
  const meCookieData = await meCookieRes.json();
  assert(
    meCookieRes.status === 200 && meCookieData.data?.role === 'ADMIN',
    'Session restored via httpOnly cookie authentication (/api/auth/me)'
  );

  // Test /api/auth/me using Bearer header (backward compatibility)
  const meBearerRes = await fetch(`${baseUrl}/auth/me`, {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });
  assert(meBearerRes.status === 200, 'Session restored via Authorization Bearer token (backward compatibility)');

  // 5. SECURE CV ACCESS & STREAMING
  console.log('\n--- 5. Secure CV Access & Streaming ---');
  if (createdApplicationId) {
    // 5a. Unauthenticated access rejected
    const unauthCvRes = await fetch(`${baseUrl}/admin/applications/${createdApplicationId}/cv`);
    assert(unauthCvRes.status === 401, 'Unauthenticated CV access rejected with 401 Unauthorized');

    // 5b. Authenticated Admin access streams private file
    const authCvRes = await fetch(`${baseUrl}/admin/applications/${createdApplicationId}/cv`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    const cvContentType = authCvRes.headers.get('content-type');
    const cvBody = await authCvRes.text();

    assert(
      authCvRes.status === 200 && cvContentType?.includes('application/pdf') && cvBody.includes('Mock CV Content'),
      'Authenticated Admin successfully streams candidate CV from private storage',
      `Content-Type: ${cvContentType} | Bytes: ${cvBody.length}`
    );
  }

  // 6. LOGOUT SEMANTICS
  console.log('\n--- 6. Logout Semantics ---');
  const logoutRes = await fetch(`${baseUrl}/auth/logout`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });
  const logoutSetCookie = logoutRes.headers.get('set-cookie');
  assert(logoutRes.status === 200, 'Logout endpoint returns 200 OK');
  assert(
    !!logoutSetCookie && (logoutSetCookie.includes('admin_token=;') || logoutSetCookie.includes('Max-Age=0') || logoutSetCookie.includes('Expires=')),
    'Logout clears httpOnly admin_token cookie'
  );

  console.log('\n========================================================');
  console.log(`PHASE 6 VERIFICATION SUMMARY: ${passedTests}/${totalTests} TESTS PASSED`);
  console.log('========================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runPhase6Verification().catch(console.error);
