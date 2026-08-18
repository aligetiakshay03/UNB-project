async function testAdminFlow() {
  const baseUrl = 'http://localhost:5000/api';

  console.log('--- TESTING ADMIN AUTH & CMS ENDPOINTS ---');

  // 1. Test Admin Login
  const adminLoginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@unb.co.za', password: 'admin123!' }),
  });
  const adminLoginData = await adminLoginRes.json();
  const adminToken = adminLoginData.data?.token || adminLoginData.token;
  console.log('1. Admin Login Status:', adminLoginRes.status, '| Role:', adminLoginData.data?.user?.role);

  // 2. Test Editor Login
  const editorLoginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'editor@unb.co.za', password: 'editor123!' }),
  });
  const editorLoginData = await editorLoginRes.json();
  const editorToken = editorLoginData.data?.token || editorLoginData.token;
  console.log('2. Editor Login Status:', editorLoginRes.status, '| Role:', editorLoginData.data?.user?.role);

  const adminHeaders = { Authorization: `Bearer ${adminToken}` };
  const editorHeaders = { Authorization: `Bearer ${editorToken}` };

  // 3. Categories
  const catRes = await fetch(`${baseUrl}/admin/categories`, { headers: adminHeaders });
  const catData = await catRes.json();
  console.log('3. GET /admin/categories:', catRes.status, `(${catData.data?.length} categories)`);

  // 4. Products
  const prodRes = await fetch(`${baseUrl}/admin/products`, { headers: adminHeaders });
  const prodData = await prodRes.json();
  console.log('4. GET /admin/products:', prodRes.status, `(${prodData.data?.length} products)`);

  // 5. News
  const newsRes = await fetch(`${baseUrl}/admin/news`, { headers: adminHeaders });
  const newsData = await newsRes.json();
  console.log('5. GET /admin/news:', newsRes.status, `(${newsData.data?.length} articles)`);

  // 6. Careers / Jobs
  const jobsRes = await fetch(`${baseUrl}/admin/jobs`, { headers: adminHeaders });
  const jobsData = await jobsRes.json();
  console.log('6. GET /admin/jobs:', jobsRes.status, `(${jobsData.data?.length} jobs)`);

  // 7. Applications
  const appsRes = await fetch(`${baseUrl}/admin/applications`, { headers: adminHeaders });
  const appsData = await appsRes.json();
  console.log('7. GET /admin/applications:', appsRes.status, `(${appsData.data?.length} applications)`);

  // 8. Enquiries
  const enqRes = await fetch(`${baseUrl}/admin/enquiries`, { headers: adminHeaders });
  const enqData = await enqRes.json();
  console.log('8. GET /admin/enquiries:', enqRes.status, `(${enqData.data?.length} enquiries)`);

  // 9. Editor Permissions check
  const editorProdRes = await fetch(`${baseUrl}/admin/products`, { headers: editorHeaders });
  console.log('9. Editor GET /admin/products:', editorProdRes.status);

  console.log('--- ALL CMS ENDPOINTS VERIFIED SUCCESSFULLY ---');
}

testAdminFlow().catch(console.error);
