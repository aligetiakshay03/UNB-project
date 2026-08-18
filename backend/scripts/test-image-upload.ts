import fs from 'fs';
import path from 'path';

async function testUpload() {
  const baseUrl = 'http://localhost:5000/api';

  // 1. Login as Admin
  const loginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@unb.co.za', password: 'admin123!' }),
  });
  const loginData = await loginRes.json();
  const token = loginData.data?.token || loginData.token;

  // 2. Create a test image file
  const testImagePath = path.join(process.cwd(), 'scratch_test_image.png');
  // 1x1 transparent PNG buffer
  const pngBuffer = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );
  fs.writeFileSync(testImagePath, pngBuffer);

  // 3. Prepare FormData
  const formData = new FormData();
  formData.append('title', `Image Test News ${Date.now()}`);
  formData.append('category', 'CORPORATE');
  formData.append('summary', 'Testing image upload persistence and serving');
  formData.append('content', 'Testing image upload content body');
  formData.append('status', 'PUBLISHED');

  const fileBlob = new Blob([fs.readFileSync(testImagePath)], { type: 'image/png' });
  formData.append('image', fileBlob, 'test-upload-sample.png');

  // 4. POST /api/admin/news
  const createRes = await fetch(`${baseUrl}/admin/news`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const createData = await createRes.json();
  console.log('Create News Status:', createRes.status);
  console.log('Created Article Featured Image:', createData.data?.featuredImage);

  if (createData.data?.featuredImage) {
    const imageUrl = `http://localhost:5000${createData.data.featuredImage}`;
    console.log('Fetching uploaded image from:', imageUrl);
    const imgFetch = await fetch(imageUrl);
    console.log('Image Fetch Status:', imgFetch.status, '| Content-Type:', imgFetch.headers.get('content-type'));
  }

  // Cleanup test image
  if (fs.existsSync(testImagePath)) {
    fs.unlinkSync(testImagePath);
  }

  console.log('--- TEST COMPLETED ---');
}

testUpload().catch(console.error);
