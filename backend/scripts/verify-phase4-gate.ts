import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const BASE_URL = 'http://localhost:5000/api';

async function runVerification() {
  console.log('--- STARTING PHASE 4 FINAL VERIFICATION ---');

  // 1. Health Check
  console.log('\n[1] Checking GET /api/health...');
  const healthRes = await fetch(`${BASE_URL}/health`);
  console.log(`Health Status: ${healthRes.status} (Expected: 200)`);

  // 2. Authentication - Login
  console.log('\n[2] Checking POST /api/auth/login (Valid credentials)...');
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@unb.co.za', password: 'admin123!' }),
  });
  const loginData = await loginRes.json();
  const token = loginData.data?.token;
  console.log(`Login Status: ${loginRes.status}, Token received: ${!!token}`);

  // 3. Authentication - /api/auth/me with valid token
  console.log('\n[3] Checking GET /api/auth/me with valid token...');
  const meRes = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const meData = await meRes.json();
  console.log(`Me Status: ${meRes.status}, User Email: ${meData.data?.email}`);

  // 4. Authentication - Missing token
  console.log('\n[4] Checking GET /api/auth/me with missing token...');
  const missingRes = await fetch(`${BASE_URL}/auth/me`);
  console.log(`Missing Token Status: ${missingRes.status} (Expected: 401)`);

  // 5. Authentication - Malformed token
  console.log('\n[5] Checking GET /api/auth/me with malformed token...');
  const malformedRes = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: 'Bearer invalid.token.string' },
  });
  console.log(`Malformed Token Status: ${malformedRes.status} (Expected: 401)`);

  // 6. Authentication - Expired token
  console.log('\n[6] Checking GET /api/auth/me with expired token...');
  const secret = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';
  const expiredToken = jwt.sign({ userId: 'fake-id', role: 'ADMIN' }, secret, { expiresIn: '-10s' });
  const expiredRes = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${expiredToken}` },
  });
  console.log(`Expired Token Status: ${expiredRes.status} (Expected: 401)`);

  // 7. Authentication - Logout
  console.log('\n[7] Checking POST /api/auth/logout...');
  const logoutRes = await fetch(`${BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(`Logout Status: ${logoutRes.status} (Expected: 200)`);

  // 8. Admin Route Protection
  console.log('\n[8] Checking Admin Route Protection (GET /api/admin/enquiries)...');
  const unauthAdmin = await fetch(`${BASE_URL}/admin/enquiries`);
  console.log(`Unauthenticated Admin Status: ${unauthAdmin.status} (Expected: 401)`);
  const authAdmin = await fetch(`${BASE_URL}/admin/enquiries`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(`Authorized Admin Status: ${authAdmin.status} (Expected: 200)`);

  // 9. Job Application & CV Upload
  console.log('\n[9] Checking POST /api/jobs/:jobId/apply with CV and metadata verification...');
  let activeJob = await prisma.job.findFirst({ where: { status: 'PUBLISHED' } });
  if (!activeJob) {
    activeJob = await prisma.job.create({
      data: {
        title: 'Production Lead — Sorghum Fermentation',
        slug: `production-lead-${Date.now()}`,
        location: 'Pretoria Industrial',
        employmentType: 'Full-time',
        description: 'Lead brewing operations and fermentation quality control.',
        requirements: 'Degree in Biotechnology / Chemical Engineering',
        responsibilities: 'Oversee brewing lines and fermentation process',
        status: 'PUBLISHED',
      },
    });
  }

  // A. Valid application with CV
  const form = new FormData();
  form.append('name', 'Verification Candidate');
  form.append('email', 'candidate.verify@unb.co.za');
  form.append('phone', '+27 82 555 1234');
  form.append('coverMessage', 'Verified application testing');
  const pdfBlob = new Blob(['%PDF-1.4 sample CV content test'], { type: 'application/pdf' });
  form.append('cv', pdfBlob, 'candidate_cv.pdf');

  const applyRes = await fetch(`${BASE_URL}/jobs/${activeJob.id}/apply`, {
    method: 'POST',
    body: form,
  });
  const applyData = await applyRes.json();
  console.log(`Apply Status: ${applyRes.status} (Expected: 201), ID: ${applyData.data?.id}`);

  // Verify record in PostgreSQL database
  const savedApp = await prisma.application.findUnique({
    where: { id: applyData.data?.id },
  });
  console.log('PostgreSQL Application Record:', {
    id: savedApp?.id,
    name: savedApp?.name,
    cvFileName: savedApp?.cvFileName,
    cvFileSize: savedApp?.cvFileSize,
    cvFileType: savedApp?.cvFileType,
    cvUrl: savedApp?.cvUrl,
  });

  // B. Oversized CV rejection (>5MB)
  const oversizedForm = new FormData();
  oversizedForm.append('name', 'Oversized Candidate');
  oversizedForm.append('email', 'oversized@unb.co.za');
  const largeBlob = new Blob([new Uint8Array(6 * 1024 * 1024)], { type: 'application/pdf' });
  oversizedForm.append('cv', largeBlob, 'large.pdf');

  const oversizedRes = await fetch(`${BASE_URL}/jobs/${activeJob.id}/apply`, {
    method: 'POST',
    body: oversizedForm,
  });
  console.log(`Oversized CV Status: ${oversizedRes.status} (Expected: 400)`);

  // C. Invalid MIME type rejection
  const invalidTypeForm = new FormData();
  invalidTypeForm.append('name', 'Invalid Type Candidate');
  invalidTypeForm.append('email', 'invalid@unb.co.za');
  const exeBlob = new Blob(['console.log("bad");'], { type: 'application/x-msdownload' });
  invalidTypeForm.append('cv', exeBlob, 'script.exe');

  const invalidTypeRes = await fetch(`${BASE_URL}/jobs/${activeJob.id}/apply`, {
    method: 'POST',
    body: invalidTypeForm,
  });
  console.log(`Invalid File Type Status: ${invalidTypeRes.status} (Expected: 400)`);

  await prisma.$disconnect();
  console.log('\n--- VERIFICATION FINISHED SUCCESSFULLY ---');
}

runVerification().catch(console.error);
