import React, { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { adminService } from '../../services/adminService';
import { Button } from '../../components/ui/Button';
import {
  Mail,
  Phone,
  Calendar,
  Eye,
  Loader2,
  AlertCircle,
  X,
  MessageSquare,
} from 'lucide-react';
import type { Enquiry } from '../../types';

export const AdminEnquiries: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Details Modal
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  const fetchEnquiries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminService.getEnquiries({ enquiryType: typeFilter });
      const list = Array.isArray(res) ? res : (res.data || []);
      setEnquiries(list);
    } catch (err) {
      setError((err as Error).message || 'Failed to load contact enquiries.');
    } finally {
      setLoading(false);
    }
  }, [typeFilter]);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  return (
    <AdminLayout
      title="Contact Enquiries"
      subtitle="View, inspect and respond to messages submitted via the public contact form"
    >
      <div className="space-y-6">
        {/* Error Banner */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xs flex items-center justify-between text-xs text-red-700 font-medium">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-xs border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-gray-500 uppercase mr-2">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 text-xs border border-gray-300 rounded-xs focus:outline-hidden focus:border-unb-navy bg-white font-medium cursor-pointer"
            >
              <option value="ALL">All Enquiry Types</option>
              <option value="General">General Enquiry</option>
              <option value="Trade">Trade & Distribution</option>
              <option value="Media">Media & Press</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <span className="text-xs text-gray-500 font-semibold">
            {enquiries.length} {enquiries.length === 1 ? 'enquiry' : 'enquiries'} received
          </span>
        </div>

        {/* Enquiries Table */}
        <div className="bg-white border border-gray-200 rounded-xs shadow-xs overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-unb-navy animate-spin" />
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Loading contact enquiries...
              </p>
            </div>
          ) : enquiries.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <p className="text-sm font-bold text-unb-navy">No enquiries found</p>
              <p className="text-xs text-gray-500">Contact form submissions from visitors will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-[10px] font-bold text-gray-500 uppercase border-b border-gray-200 tracking-wider">
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Message Snippet</th>
                    <th className="py-3 px-4">Received Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {enquiries.map((enq) => (
                    <tr key={enq.id} className="hover:bg-gray-50/70 transition-colors">
                      {/* Name & Email */}
                      <td className="py-3.5 px-4">
                        <div>
                          <p className="font-bold text-unb-navy">{enq.name}</p>
                          <p className="text-[11px] text-gray-500">{enq.email}</p>
                        </div>
                      </td>

                      {/* Type Badge */}
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-xs bg-blue-50 text-unb-navy border border-blue-100">
                          {enq.enquiryType}
                        </span>
                      </td>

                      {/* Message Snippet */}
                      <td className="py-3.5 px-4 text-gray-600">
                        <p className="truncate max-w-sm">{enq.message}</p>
                      </td>

                      {/* Received Date */}
                      <td className="py-3.5 px-4 text-gray-600">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>{formatDate(enq.createdAt)}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          onClick={() => setSelectedEnquiry(enq)}
                          variant="outline"
                          size="sm"
                          className="!py-1 !px-2.5 text-[11px]"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          <span>OPEN MESSAGE</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ENQUIRY DETAILS MODAL */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-xs shadow-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setSelectedEnquiry(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-gray-100 pb-3">
              <span className="text-[10px] font-bold text-unb-amber uppercase">
                {selectedEnquiry.enquiryType} ENQUIRY
              </span>
              <h3 className="text-xl font-black text-unb-navy">{selectedEnquiry.name}</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Received: {formatDate(selectedEnquiry.createdAt)}
              </p>
            </div>

            {/* Contact Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xs border border-gray-200 text-xs">
              <div className="flex items-center gap-2 text-gray-700">
                <Mail className="w-4 h-4 text-unb-navy shrink-0" />
                <a href={`mailto:${selectedEnquiry.email}`} className="text-unb-navy font-semibold hover:underline">
                  {selectedEnquiry.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Phone className="w-4 h-4 text-unb-navy shrink-0" />
                {selectedEnquiry.phone ? (
                  <a href={`tel:${selectedEnquiry.phone}`} className="text-unb-navy font-semibold hover:underline">
                    {selectedEnquiry.phone}
                  </a>
                ) : (
                  <span className="text-gray-400">No phone provided</span>
                )}
              </div>
            </div>

            {/* Message Body */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-unb-navy uppercase">
                <MessageSquare className="w-4 h-4 text-unb-amber" />
                <span>Message Details</span>
              </div>
              <div className="p-4 bg-white border border-gray-200 rounded-xs text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {selectedEnquiry.message}
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-gray-100">
              <a
                href={`mailto:${selectedEnquiry.email}?subject=RE: UNB Enquiry - ${selectedEnquiry.enquiryType}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-unb-navy hover:text-unb-amber"
              >
                <Mail className="w-4 h-4" />
                <span>REPLY VIA EMAIL</span>
              </a>
              <Button onClick={() => setSelectedEnquiry(null)} variant="navy" size="sm">
                CLOSE
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
