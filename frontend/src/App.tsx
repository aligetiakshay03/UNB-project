import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop';
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
import { NotFound } from './pages/NotFound';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
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
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
