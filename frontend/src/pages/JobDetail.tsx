import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { PageHero } from '../components/sections/PageHero';
import { Button } from '../components/ui/Button';
import { ArrowLeft, MapPin, Briefcase, Calendar, CheckCircle2, Upload, X, AlertCircle, Loader2 } from 'lucide-react';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';
import type { Job } from '../types';
import { SEOHead } from '../components/seo/SEOHead';

export const JobDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchJob = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        setError(null);
        const data = await jobService.getJobBySlug(slug);
        if (isMounted) {
          setJob(data);
        }
      } catch (err) {
        if (isMounted) {
          setError((err as Error).message || 'Job vacancy not found');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchJob();
    return () => {
      isMounted = false;
    };
  }, [slug]);

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
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx)$/i)) {
      setFileError('Only PDF, DOC, or DOCX files are allowed.');
      setCvFile(null);
      return;
    }

    setFileError('');
    setCvFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;
    if (!formData.name.trim() || !formData.email.trim()) {
      setFormError('Please fill in your name and a valid email address.');
      return;
    }

    try {
      setSubmitting(true);
      setFormError('');
      await applicationService.submitApplication(job.id, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        coverMessage: formData.coverMessage.trim() || undefined,
        cv: cvFile || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      setFormError((err as Error).message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4 py-24">
          <Loader2 className="w-10 h-10 text-unb-navy animate-spin" />
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Loading vacancy details...</p>
        </div>
      </Layout>
    );
  }

  if (error || !job) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-unb-amber mx-auto flex items-center justify-center">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-unb-navy">Position Not Found</h1>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            The requested career vacancy could not be located or may have reached its closing deadline.
          </p>
          <div>
            <Link to="/careers">
              <Button variant="navy">← BACK TO OPEN POSITIONS</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const formatClosingDate = (dateStr?: string) => {
    if (!dateStr) return 'Open until filled';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const responsibilitiesList = job.responsibilities
    ? job.responsibilities.split('\n').map((s) => s.replace(/^[-*•]\s*/, '').trim()).filter(Boolean)
    : [
        'Manage end-to-end production operations and quality standards.',
        'Ensure strict compliance with health, safety, and environmental regulations.',
        'Collaborate cross-functionally across operations and leadership teams.',
      ];

  const requirementsList = job.requirements
    ? job.requirements.split('\n').map((s) => s.replace(/^[-*•]\s*/, '').trim()).filter(Boolean)
    : [
        'Relevant diploma or degree in field of specialty.',
        'Proven track record and experience in manufacturing or FMCG.',
        'Strong leadership, communication, and technical problem-solving skills.',
      ];

  return (
    <Layout>
      <SEOHead
        title={`${job.title} (${job.location}) | Careers at United National Breweries`}
        description={job.description ? job.description.substring(0, 160) : `Apply for the ${job.title} role at United National Breweries in ${job.location}.`}
        canonicalUrl={`https://unb.co.za/careers/${job.slug}`}
      />
      <PageHero
        categoryTag="CAREER OPPORTUNITY"
        title={job.title}
        backgroundImageUrl="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1600&auto=format&fit=crop"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Back link */}
        <div className="mb-6">
          <Link to="/careers" className="inline-flex items-center gap-1.5 text-xs font-bold text-unb-navy hover:text-unb-amber tracking-wider uppercase">
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO OPEN POSITIONS</span>
          </Link>
        </div>

        {/* Job Metadata Bar */}
        <div className="bg-unb-sand p-6 border border-gray-200 rounded-xs mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-gray-700">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-unb-amber" />
              <span>{job.location || 'Pretoria Industrial, South Africa'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-unb-amber" />
              <span>{job.employmentType || 'Full-time'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>Closing Date: {formatClosingDate(job.closingDate)}</span>
            </div>
          </div>

          <Button onClick={() => setModalOpen(true)} variant="primary">
            APPLY FOR THIS POSITION
          </Button>
        </div>

        {/* Job Content */}
        <div className="bg-white border border-gray-200 rounded-xs p-8 space-y-8 shadow-xs">
          
          <div className="space-y-3">
            <h2 className="text-sm font-black text-unb-navy uppercase tracking-wider">ROLE OVERVIEW</h2>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{job.description}</p>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-100">
            <h2 className="text-sm font-black text-unb-navy uppercase tracking-wider">KEY RESPONSIBILITIES</h2>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
              {responsibilitiesList.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-unb-navy shrink-0 mt-0.5" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-100">
            <h2 className="text-sm font-black text-unb-navy uppercase tracking-wider">QUALIFICATIONS & REQUIREMENTS</h2>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
              {requirementsList.map((req, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-unb-amber shrink-0 mt-0.5" />
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
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <span className="text-[10px] font-bold text-unb-amber uppercase">CANDIDATE APPLICATION</span>
                  <h2 className="text-xl font-black text-unb-navy">{job.title}</h2>
                </div>

                {formError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xs flex items-center gap-2 text-xs text-red-700 font-medium">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div>
                  <label htmlFor="apply-name" className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name *</label>
                  <input
                    id="apply-name"
                    type="text"
                    required
                    aria-required="true"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Thabo Mokoena"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xs focus:outline-hidden focus:border-unb-navy"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="apply-email" className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address *</label>
                    <input
                      id="apply-email"
                      type="email"
                      required
                      aria-required="true"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.co.za"
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xs focus:outline-hidden focus:border-unb-navy"
                    />
                  </div>

                  <div>
                    <label htmlFor="apply-phone" className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number</label>
                    <input
                      id="apply-phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+27 82 123 4567"
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xs focus:outline-hidden focus:border-unb-navy"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="apply-message" className="block text-xs font-bold text-gray-700 uppercase mb-1">Cover Message</label>
                  <textarea
                    id="apply-message"
                    rows={3}
                    value={formData.coverMessage}
                    onChange={(e) => setFormData({ ...formData, coverMessage: e.target.value })}
                    placeholder="Brief introduction or key skills..."
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xs focus:outline-hidden focus:border-unb-navy"
                  />
                </div>

                {/* CV File Upload */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">CV / Resume Upload (PDF/DOCX, max 5MB)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xs p-4 text-center hover:border-unb-navy transition-colors cursor-pointer bg-gray-50">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      id="cv-upload-input"
                    />
                    <label htmlFor="cv-upload-input" className="cursor-pointer flex flex-col items-center gap-2">
                      <Upload className="w-6 h-6 text-unb-navy" />
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
                    className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
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
                <h3 className="text-lg font-black text-unb-navy">Application Submitted!</h3>
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
