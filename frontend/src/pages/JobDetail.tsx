import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { PageHero } from '../components/sections/PageHero';
import { Button } from '../components/ui/Button';
import { ArrowLeft, MapPin, Briefcase, Calendar, CheckCircle2, Upload, X, AlertCircle } from 'lucide-react';

export const JobDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [modalOpen, setModalOpen] = useState(false);
  
  // Application Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    coverMessage: '',
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const job = {
    title: slug ? slug.replace(/-/g, ' ').toUpperCase() : 'PRODUCTION MANAGER',
    location: 'Pretoria Industrial, South Africa',
    employmentType: 'Full-time',
    closingDate: '30 September 2026',
    description: 'United National Breweries is seeking an experienced Production Manager to oversee daily brewing operations, maintain stringent quality standards, and ensure operational excellence across our sorghum brewing facility.',
    responsibilities: [
      'Manage end-to-end sorghum brewing production schedules and output targets.',
      'Ensure strict compliance with health, safety, food quality, and environmental regulations.',
      'Lead, mentor, and direct production staff and shift supervisors.',
      'Monitor raw material utilization, yield ratios, and wastage reduction programs.',
      'Collaborate with maintenance teams to ensure high equipment uptime and reliability.',
    ],
    requirements: [
      'BSc or Diploma in Chemical Engineering, Biotechnology, Food Science, or Brewing Science.',
      '5+ years of production leadership experience in beverage manufacturing or FMCG.',
      'Deep understanding of fermentation processes and quality control methods.',
      'Strong leadership, analytical problem-solving, and communication skills.',
    ],
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFileError('File size exceeds 5MB limit.');
      setCvFile(null);
      return;
    }

    // Validate type (PDF / DOC / DOCX)
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setFileError('Only PDF, DOC, or DOCX files are allowed.');
      setCvFile(null);
      return;
    }

    setFileError('');
    setCvFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setSubmitting(true);
    // Simulate API call for Phase 2 UI
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <Layout>
      <PageHero
        categoryTag="CAREER OPPORTUNITY"
        title={job.title}
        backgroundImageUrl="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1600&auto=format&fit=crop"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Back link */}
        <div className="mb-6">
          <Link to="/careers" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#132B5B] hover:text-[#D99B26] tracking-wider uppercase">
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO OPEN POSITIONS</span>
          </Link>
        </div>

        {/* Job Metadata Bar */}
        <div className="bg-[#F7F6F2] p-6 border border-gray-200 rounded-xs mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-gray-700">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#D99B26]" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-[#D99B26]" />
              <span>{job.employmentType}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>Closing Date: {job.closingDate}</span>
            </div>
          </div>

          <Button onClick={() => setModalOpen(true)} variant="primary">
            APPLY FOR THIS POSITION
          </Button>
        </div>

        {/* Job Content */}
        <div className="bg-white border border-gray-200 rounded-xs p-8 space-y-8 shadow-xs">
          
          <div className="space-y-3">
            <h2 className="text-sm font-black text-[#132B5B] uppercase tracking-wider">ROLE OVERVIEW</h2>
            <p className="text-xs text-gray-700 leading-relaxed">{job.description}</p>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-100">
            <h2 className="text-sm font-black text-[#132B5B] uppercase tracking-wider">KEY RESPONSIBILITIES</h2>
            <ul className="space-y-2 text-xs text-gray-700">
              {job.responsibilities.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#132B5B] shrink-0 mt-0.5" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-100">
            <h2 className="text-sm font-black text-[#132B5B] uppercase tracking-wider">QUALIFICATIONS & REQUIREMENTS</h2>
            <ul className="space-y-2 text-xs text-gray-700">
              {job.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D99B26] shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-6 border-t border-gray-100 text-center">
            <Button onClick={() => setModalOpen(true)} variant="navy" size="lg">
              APPLY NOW FOR THIS ROLE →
            </Button>
          </div>

        </div>

      </div>

      {/* APPLICATION MODAL FORM */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full rounded-xs shadow-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <span className="text-[10px] font-bold text-[#D99B26] uppercase">CANDIDATE APPLICATION</span>
                  <h2 className="text-xl font-black text-[#132B5B]">{job.title}</h2>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Thabo Mokoena"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xs focus:outline-hidden focus:border-[#132B5B]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.co.za"
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xs focus:outline-hidden focus:border-[#132B5B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+27 82 123 4567"
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xs focus:outline-hidden focus:border-[#132B5B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Cover Message</label>
                  <textarea
                    rows={3}
                    value={formData.coverMessage}
                    onChange={(e) => setFormData({ ...formData, coverMessage: e.target.value })}
                    placeholder="Brief introduction or key skills..."
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xs focus:outline-hidden focus:border-[#132B5B]"
                  />
                </div>

                {/* CV File Upload */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">CV / Resume Upload (PDF/DOCX, max 5MB)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xs p-4 text-center hover:border-[#132B5B] transition-colors cursor-pointer bg-gray-50">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      id="cv-upload-input"
                    />
                    <label htmlFor="cv-upload-input" className="cursor-pointer flex flex-col items-center gap-2">
                      <Upload className="w-6 h-6 text-[#132B5B]" />
                      <span className="text-xs font-semibold text-gray-700">
                        {cvFile ? cvFile.name : 'Click to upload your CV document'}
                      </span>
                      <span className="text-[10px] text-gray-400">PDF, DOC, DOCX up to 5MB</span>
                    </label>
                  </div>
                  {fileError && (
                    <div className="flex items-center gap-1 text-[11px] text-red-600 font-semibold mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{fileError}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900"
                  >
                    CANCEL
                  </button>
                  <Button type="submit" variant="primary" disabled={submitting}>
                    {submitting ? 'SUBMITTING...' : 'SUBMIT APPLICATION'}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="py-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-[#132B5B]">Application Submitted!</h3>
                <p className="text-xs text-gray-600 max-w-sm mx-auto">
                  Thank you for applying for the <strong>{job.title}</strong> position. Our HR recruitment team will review your application.
                </p>
                <div className="pt-4">
                  <Button onClick={() => { setModalOpen(false); setSubmitted(false); }} variant="navy">
                    CLOSE
                  </Button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </Layout>
  );
};
