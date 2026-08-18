import React, { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { adminService } from '../../services/adminService';
import { Button } from '../../components/ui/Button';
import {
  Mail,
  Phone,
  Calendar,
  FileText,
  Eye,
  Loader2,
  AlertCircle,
  X,
  Briefcase,
} from 'lucide-react';
import type { Application, ApplicationStatus } from '../../types';

export const AdminApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Candidate Details Modal
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminService.getApplications({ status: statusFilter });
      const list = Array.isArray(res) ? res : (res.data || []);
      setApplications(list);
    } catch (err) {
      setError((err as Error).message || 'Failed to load candidate applications.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleOpenDetail = async (app: Application) => {
    try {
      const fullApp = await adminService.getApplication(app.id);
      setSelectedApp(fullApp);
    } catch {
      setSelectedApp(app);
    }
  };

  const handleStatusChange = async (appId: string, nextStatus: ApplicationStatus) => {
    try {
      await adminService.patchApplicationStatus(appId, nextStatus);
      if (selectedApp && selectedApp.id === appId) {
        setSelectedApp({ ...selectedApp, applicationStatus: nextStatus });
      }
      await fetchApplications();
    } catch (err) {
      setError((err as Error).message || 'Failed to update application status.');
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'NEW':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'REVIEWING':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SHORTLISTED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'HIRED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <AdminLayout
      title="Candidate Applications"
      subtitle="Review job submissions, resume metadata, candidate details and recruitment pipeline"
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
            <span className="text-[11px] font-bold text-gray-500 uppercase mr-2">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs border border-gray-300 rounded-xs focus:outline-hidden focus:border-unb-navy bg-white font-medium cursor-pointer"
            >
              <option value="ALL">All Application Statuses</option>
              <option value="NEW">New (Unreviewed)</option>
              <option value="REVIEWING">In Review</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="HIRED">Hired</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <span className="text-xs text-gray-500 font-semibold">
            {applications.length} {applications.length === 1 ? 'applicant' : 'applicants'} found
          </span>
        </div>

        {/* Applications Table */}
        <div className="bg-white border border-gray-200 rounded-xs shadow-xs overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-unb-navy animate-spin" />
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Loading applicant submissions...
              </p>
            </div>
          ) : applications.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <p className="text-sm font-bold text-unb-navy">No applications found</p>
              <p className="text-xs text-gray-500">Applications submitted on open careers will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-[10px] font-bold text-gray-500 uppercase border-b border-gray-200 tracking-wider">
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">Position Applied For</th>
                    <th className="py-3 px-4">Date Submitted</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50/70 transition-colors">
                      {/* Candidate */}
                      <td className="py-3.5 px-4">
                        <div>
                          <p className="font-bold text-unb-navy">{app.name}</p>
                          <p className="text-[11px] text-gray-500">{app.email}</p>
                        </div>
                      </td>

                      {/* Job Title */}
                      <td className="py-3.5 px-4 text-gray-700">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Briefcase className="w-3.5 h-3.5 text-unb-amber" />
                          <span>{app.job?.title || 'General Vacancy'}</span>
                        </div>
                      </td>

                      {/* Submitted Date */}
                      <td className="py-3.5 px-4 text-gray-600">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>{formatDate(app.createdAt)}</span>
                        </div>
                      </td>

                      {/* Status Selector */}
                      <td className="py-3.5 px-4">
                        <select
                          value={app.applicationStatus}
                          onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                          className={`text-[10px] font-black uppercase px-2 py-1 rounded-xs border focus:outline-hidden cursor-pointer ${getStatusBadge(
                            app.applicationStatus
                          )}`}
                        >
                          <option value="NEW">New</option>
                          <option value="REVIEWING">Reviewing</option>
                          <option value="SHORTLISTED">Shortlisted</option>
                          <option value="HIRED">Hired</option>
                          <option value="REJECTED">Rejected</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          onClick={() => handleOpenDetail(app)}
                          variant="outline"
                          size="sm"
                          className="!py-1 !px-2.5 text-[11px]"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          <span>VIEW DETAILS</span>
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

      {/* CANDIDATE DETAILS MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full rounded-xs shadow-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-gray-100 pb-3">
              <span className="text-[10px] font-bold text-unb-amber uppercase">CANDIDATE DOSSIER</span>
              <h3 className="text-xl font-black text-unb-navy">{selectedApp.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Applied for: <strong>{selectedApp.job?.title || 'General Vacancy'}</strong> on {formatDate(selectedApp.createdAt)}
              </p>
            </div>

            {/* Contact Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xs border border-gray-200 text-xs">
              <div className="flex items-center gap-2 text-gray-700">
                <Mail className="w-4 h-4 text-unb-navy shrink-0" />
                <a href={`mailto:${selectedApp.email}`} className="text-unb-navy font-semibold hover:underline">
                  {selectedApp.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Phone className="w-4 h-4 text-unb-navy shrink-0" />
                {selectedApp.phone ? (
                  <a href={`tel:${selectedApp.phone}`} className="text-unb-navy font-semibold hover:underline">
                    {selectedApp.phone}
                  </a>
                ) : (
                  <span className="text-gray-400">No phone provided</span>
                )}
              </div>
            </div>

            {/* Status Update Row */}
            <div className="flex items-center justify-between bg-unb-sand p-3 rounded-xs border border-gray-200">
              <span className="text-xs font-bold text-unb-navy uppercase">Application Status:</span>
              <select
                value={selectedApp.applicationStatus}
                onChange={(e) => handleStatusChange(selectedApp.id, e.target.value as ApplicationStatus)}
                className="px-3 py-1 text-xs border border-gray-300 rounded-xs focus:outline-hidden focus:border-unb-navy bg-white font-bold cursor-pointer uppercase"
              >
                <option value="NEW">New (Unreviewed)</option>
                <option value="REVIEWING">In Review</option>
                <option value="SHORTLISTED">Shortlisted</option>
                <option value="HIRED">Hired</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            {/* Cover Message */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-unb-navy uppercase">Cover Message / Introduction</h4>
              <div className="p-4 bg-white border border-gray-200 rounded-xs text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">
                {selectedApp.coverMessage || 'No cover message attached.'}
              </div>
            </div>

            {/* CV Attachment Metadata */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-unb-navy uppercase">Attached CV Document</h4>
              {selectedApp.cvFileName ? (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-unb-navy" />
                    <div>
                      <p className="text-xs font-bold text-gray-900">{selectedApp.cvFileName}</p>
                      <p className="text-[10px] text-gray-500">
                        {selectedApp.cvFileSize ? `${Math.round(selectedApp.cvFileSize / 1024)} KB` : ''} • {selectedApp.cvFileType || 'PDF/DOCX'}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-unb-navy bg-white px-2 py-1 rounded-xs border border-gray-300">
                    CV Metadata Stored
                  </span>
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">No CV document was uploaded with this application.</p>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <Button onClick={() => setSelectedApp(null)} variant="navy" size="sm">
                CLOSE
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
