import React, { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/adminService';
import { Button } from '../../components/ui/Button';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Loader2,
  AlertCircle,
  X,
  MapPin,
  Briefcase,
  Calendar,
} from 'lucide-react';
import type { Job, ContentStatus } from '../../types';

export const AdminCareers: React.FC = () => {
  const { hasPermission } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    location: 'Pretoria Industrial, South Africa',
    employmentType: 'Full-time',
    description: '',
    requirements: '',
    responsibilities: '',
    closingDate: '',
    status: 'DRAFT' as ContentStatus,
  });
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminService.getJobs({ status: statusFilter });
      const list = Array.isArray(res) ? res : (res.data || []);
      setJobs(list);
    } catch (err) {
      setError((err as Error).message || 'Failed to load career vacancies.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleOpenCreate = () => {
    setEditingJob(null);
    setFormData({
      title: '',
      location: 'Pretoria Industrial, South Africa',
      employmentType: 'Full-time',
      description: '',
      requirements: '',
      responsibilities: '',
      closingDate: '',
      status: 'DRAFT',
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      location: job.location || 'Pretoria Industrial, South Africa',
      employmentType: job.employmentType || 'Full-time',
      description: job.description,
      requirements: job.requirements || '',
      responsibilities: job.responsibilities || '',
      closingDate: job.closingDate ? job.closingDate.substring(0, 10) : '',
      status: job.status,
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setModalError('Position title is required.');
      return;
    }
    if (!formData.description.trim()) {
      setModalError('Job description is required.');
      return;
    }

    try {
      setModalSubmitting(true);
      setModalError(null);

      const payload = {
        title: formData.title.trim(),
        location: formData.location.trim() || undefined,
        employmentType: formData.employmentType.trim() || undefined,
        description: formData.description.trim(),
        requirements: formData.requirements.trim() || undefined,
        responsibilities: formData.responsibilities.trim() || undefined,
        closingDate: formData.closingDate ? formData.closingDate : null,
        status: formData.status,
      };

      if (editingJob) {
        await adminService.updateJob(editingJob.id, payload);
      } else {
        await adminService.createJob(payload);
      }

      setIsModalOpen(false);
      await fetchJobs();
    } catch (err) {
      setModalError((err as Error).message || 'Failed to save job vacancy.');
    } finally {
      setModalSubmitting(false);
    }
  };

  const handleToggleStatus = async (job: Job) => {
    const nextStatus: ContentStatus = job.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      await adminService.patchJobStatus(job.id, nextStatus);
      await fetchJobs();
    } catch (err) {
      setError((err as Error).message || 'Failed to update job status.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      await adminService.deleteJob(deleteId);
      setDeleteId(null);
      await fetchJobs();
    } catch (err) {
      setError((err as Error).message || 'Failed to delete job.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatClosingDate = (dateStr?: string) => {
    if (!dateStr) return 'Open until filled';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <AdminLayout
      title="Careers & Recruitment CMS"
      subtitle="Manage open job vacancies, requirements, closing deadlines and applicant recruitment"
      action={
        hasPermission('jobs.create') ? (
          <Button onClick={handleOpenCreate} variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            <span>POST NEW VACANCY</span>
          </Button>
        ) : null
      }
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
              <option value="ALL">All Statuses</option>
              <option value="PUBLISHED">Published / Active</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>

          <span className="text-xs text-gray-500 font-semibold">
            {jobs.length} {jobs.length === 1 ? 'position' : 'positions'} listed
          </span>
        </div>

        {/* Jobs Table */}
        <div className="bg-white border border-gray-200 rounded-xs shadow-xs overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-unb-navy animate-spin" />
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Loading job postings...
              </p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <p className="text-sm font-bold text-unb-navy">No vacancies found</p>
              <p className="text-xs text-gray-500">Post a new position to display careers on the website.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-[10px] font-bold text-gray-500 uppercase border-b border-gray-200 tracking-wider">
                    <th className="py-3 px-4">Position</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Closing Date</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div>
                          <p className="font-bold text-unb-navy">{job.title}</p>
                          <p className="text-[11px] text-gray-400 font-mono">/{job.slug}</p>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-gray-600">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <MapPin className="w-3.5 h-3.5 text-unb-amber" />
                          <span>{job.location || 'Pretoria Industrial'}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-gray-600">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                          <span>{job.employmentType || 'Full-time'}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-gray-600">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>{formatClosingDate(job.closingDate)}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {hasPermission('jobs.publish') ? (
                          <button
                            onClick={() => handleToggleStatus(job)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xs text-[10px] font-black uppercase tracking-wider cursor-pointer transition-colors ${
                              job.status === 'PUBLISHED'
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            title="Click to toggle status"
                          >
                            {job.status === 'PUBLISHED' ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-green-600" />
                                <span>PUBLISHED</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3 text-gray-500" />
                                <span>DRAFT</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase ${
                              job.status === 'PUBLISHED'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {job.status}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {hasPermission('jobs.edit') && (
                            <button
                              onClick={() => handleOpenEdit(job)}
                              className="p-1 text-gray-600 hover:text-unb-navy cursor-pointer transition-colors"
                              title="Edit vacancy"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                          {hasPermission('jobs.delete') && (
                            <button
                              onClick={() => setDeleteId(job.id)}
                              className="p-1 text-red-400 hover:text-red-700 cursor-pointer transition-colors"
                              title="Delete vacancy"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full rounded-xs shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="border-b border-gray-100 pb-3">
                <span className="text-[10px] font-bold text-unb-amber uppercase">
                  {editingJob ? 'EDIT POSITION' : 'NEW POSITION'}
                </span>
                <h3 className="text-lg font-black text-unb-navy">
                  {editingJob ? editingJob.title : 'Create Career Vacancy'}
                </h3>
              </div>

              {modalError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xs flex items-center gap-2 text-xs text-red-700 font-medium">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Position Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Production Manager — Sorghum Brewing"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xs focus:outline-hidden focus:border-unb-navy"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Pretoria Industrial"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xs focus:outline-hidden focus:border-unb-navy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Employment Type
                  </label>
                  <select
                    value={formData.employmentType}
                    onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xs focus:outline-hidden focus:border-unb-navy bg-white font-medium cursor-pointer"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Apprenticeship">Apprenticeship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ContentStatus })}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xs focus:outline-hidden focus:border-unb-navy bg-white font-medium cursor-pointer"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Publish</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Closing Deadline Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.closingDate}
                  onChange={(e) => setFormData({ ...formData, closingDate: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xs focus:outline-hidden focus:border-unb-navy"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Job Description / Role Overview *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Overview of the vacancy and responsibilities summary..."
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xs focus:outline-hidden focus:border-unb-navy"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Key Responsibilities (one per line)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.responsibilities}
                    onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                    placeholder="- Manage production schedules&#10;- Ensure compliance standards"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xs focus:outline-hidden focus:border-unb-navy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Requirements & Qualifications (one per line)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    placeholder="- BSc Chemical Engineering&#10;- 5+ years brewing experience"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xs focus:outline-hidden focus:border-unb-navy"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
                >
                  CANCEL
                </button>
                <Button type="submit" variant="primary" disabled={modalSubmitting}>
                  {modalSubmitting
                    ? 'SAVING...'
                    : editingJob
                    ? (formData.status === 'PUBLISHED' ? 'UPDATE & PUBLISH' : 'UPDATE DRAFT')
                    : (formData.status === 'PUBLISHED' ? 'PUBLISH POSITION' : 'SAVE AS DRAFT')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG (ADMIN ONLY) */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Career Position"
        message="Are you sure you want to permanently delete this job posting and all associated candidate applications? This action cannot be undone."
        loading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </AdminLayout>
  );
};
