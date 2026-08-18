import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop';
import { AuthProvider } from './context/AuthContext';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Sustainability } from './pages/Sustainability';
import { Brands } from './pages/Brands';
import { BrandDetail } from './pages/BrandDetail';
import { Careers } from './pages/Careers';
import { JobDetail } from './pages/JobDetail';
import { News } from './pages/News';
import { NewsDetail } from './pages/NewsDetail';
import { Contact } from './pages/Contact';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminNews } from './pages/admin/AdminNews';
import { AdminCareers } from './pages/admin/AdminCareers';
import { AdminApplications } from './pages/admin/AdminApplications';
import { AdminEnquiries } from './pages/admin/AdminEnquiries';
import { NotFound } from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Website Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/sustainability" element={<Sustainability />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/brands/:slug" element={<BrandDetail />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/careers/:slug" element={<JobDetail />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:slug" element={<NewsDetail />} />
          <Route path="/contact" element={<Contact />} />

          {/* Admin CMS Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/news" element={<AdminNews />} />
          <Route path="/admin/careers" element={<AdminCareers />} />
          <Route path="/admin/applications" element={<AdminApplications />} />
          <Route path="/admin/enquiries" element={<AdminEnquiries />} />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
