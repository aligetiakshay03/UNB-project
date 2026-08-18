import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { PageHero } from '../components/sections/PageHero';
import { SectionHeader } from '../components/sections/SectionHeader';
import { Button } from '../components/ui/Button';
import { Mail, Phone, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    enquiryType: 'General Enquiry',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required.';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Valid email address is required.';
    if (!formData.message.trim() || formData.message.trim().length < 10) errs.message = 'Message must be at least 10 characters long.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    // Simulate API call for Phase 2 UI
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <Layout showCTABanner={false}>
      {/* HERO SECTION */}
      <PageHero
        categoryTag="CONTACT US"
        title="Get In Touch With UNB"
        description="Questions, enquiries, trade opportunities, or feedback? We'd love to hear from you."
        backgroundImageUrl="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=1600&auto=format&fit=crop"
      />

      <section className="py-16 bg-[#F7F6F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Contact Details Card */}
            <div className="lg:col-span-5 bg-[#132B5B] text-white p-8 rounded-xs shadow-md space-y-8">
              <SectionHeader
                categoryTag="REACH US DIRECTLY"
                title="Head Office & Brewery"
                darkBg={true}
              />

              <div className="space-y-6 text-xs text-blue-100">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#D99B26]/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#D99B26]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white uppercase text-xs">Phelindaba Brewery (Head Office)</h4>
                    <p className="mt-1 leading-relaxed">
                      1000 Maunde Street,<br />
                      Pretoria Industrial, Pretoria, 0183<br />
                      Gauteng, South Africa
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#D99B26]/20 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-[#D99B26]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white uppercase text-xs">Telephone</h4>
                    <a href="tel:+27119906300" className="mt-1 block hover:text-[#D99B26] transition-colors font-semibold">
                      +27 11 990 6300
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#D99B26]/20 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-[#D99B26]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white uppercase text-xs">Email Enquiries</h4>
                    <a href="mailto:enquiries@unbreweries.co.za" className="mt-1 block hover:text-[#D99B26] transition-colors font-semibold">
                      enquiries@unbreweries.co.za
                    </a>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="pt-4">
                <div className="h-40 bg-blue-900/60 rounded-xs border border-blue-800 flex items-center justify-center text-center p-4">
                  <span className="text-xs font-semibold text-blue-200">
                    📍 Map Location — Pretoria Industrial, Pretoria, 0183
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7 bg-white p-8 border border-gray-200 rounded-xs shadow-xs">
              
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <SectionHeader
                    categoryTag="SEND A MESSAGE"
                    title="Online Enquiry Form"
                    description="Please complete the form below and our team will get back to you promptly."
                  />

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Sipho Ndlovu"
                      className={`w-full px-3 py-2 text-xs border rounded-xs focus:outline-hidden ${
                        errors.name ? 'border-red-500' : 'border-gray-300 focus:border-[#132B5B]'
                      }`}
                    />
                    {errors.name && <p className="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.name}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@example.co.za"
                        className={`w-full px-3 py-2 text-xs border rounded-xs focus:outline-hidden ${
                          errors.email ? 'border-red-500' : 'border-gray-300 focus:border-[#132B5B]'
                        }`}
                      />
                      {errors.email && <p className="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+27 11 123 4567"
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xs focus:outline-hidden focus:border-[#132B5B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Enquiry Type *</label>
                    <select
                      value={formData.enquiryType}
                      onChange={(e) => setFormData({ ...formData, enquiryType: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xs focus:outline-hidden focus:border-[#132B5B] bg-white font-medium"
                    >
                      <option value="General Enquiry">General Enquiry</option>
                      <option value="Trade & Distribution">Trade & Distribution Opportunities</option>
                      <option value="Media & Press">Media & Press</option>
                      <option value="Careers">Careers & Recruitment</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Message *</label>
                    <textarea
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Write your message or enquiry details here..."
                      className={`w-full px-3 py-2 text-xs border rounded-xs focus:outline-hidden ${
                        errors.message ? 'border-red-500' : 'border-gray-300 focus:border-[#132B5B]'
                      }`}
                    />
                    {errors.message && <p className="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.message}</p>}
                  </div>

                  <div className="pt-2">
                    <Button type="submit" variant="primary" size="lg" disabled={submitting}>
                      {submitting ? 'SENDING ENQUIRY...' : 'SUBMIT ENQUIRY'}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="py-16 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-[#132B5B]">Thank You for Contacting UNB!</h3>
                  <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                    We have received your enquiry. Our team will review your message and respond to <strong>{formData.email}</strong> as soon as possible.
                  </p>
                  <div className="pt-4">
                    <Button onClick={() => setSubmitted(false)} variant="navy">
                      SEND ANOTHER MESSAGE
                    </Button>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      </section>
    </Layout>
  );
};
