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
  Upload,
  Calendar,
} from 'lucide-react';
import type { News, ContentStatus } from '../../types';

export const AdminNews: React.FC = () => {
  const { hasPermission } = useAuth();
  const [articles, setArticles] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<News | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'CORPORATE',
    summary: '',
    content: '',
    status: 'DRAFT' as ContentStatus,
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminService.getNews({ status: statusFilter });
      const list = Array.isArray(res) ? res : (res.data || []);
      setArticles(list);
    } catch (err) {
      setError((err as Error).message || 'Failed to load news articles.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleOpenCreate = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      category: 'CORPORATE',
      summary: '',
      content: '',
      status: 'DRAFT',
    });
    setSelectedImage(null);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (article: News) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      category: article.category || 'CORPORATE',
      summary: article.summary || '',
      content: article.content,
      status: article.status,
    });
    setSelectedImage(null);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setModalError('Title is required.');
      return;
    }
    if (!formData.content.trim()) {
      setModalError('Article content is required.');
      return;
    }

    try {
      setModalSubmitting(true);
      setModalError(null);

      const data = new FormData();
      data.append('title', formData.title.trim());
      data.append('category', formData.category.trim());
      if (formData.summary) data.append('summary', formData.summary.trim());
      data.append('content', formData.content.trim());
      data.append('status', formData.status);

      if (selectedImage) {
        data.append('image', selectedImage);
      }

      if (editingArticle) {
        await adminService.updateNews(editingArticle.id, data);
      } else {
        await adminService.createNews(data);
      }

      setIsModalOpen(false);
      await fetchNews();
    } catch (err) {
      setModalError((err as Error).message || 'Failed to save news article.');
    } finally {
      setModalSubmitting(false);
    }
  };

  const handleToggleStatus = async (article: News) => {
    const nextStatus: ContentStatus = article.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      await adminService.patchNewsStatus(article.id, nextStatus);
      await fetchNews();
    } catch (err) {
      setError((err as Error).message || 'Failed to update article status.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      await adminService.deleteNews(deleteId);
      setDeleteId(null);
      await fetchNews();
    } catch (err) {
      setError((err as Error).message || 'Failed to delete news article.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Unpublished';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <AdminLayout
      title="News & Press Releases"
      subtitle="Publish corporate announcements, community stories and press releases"
      action={
        hasPermission('news.create') ? (
          <Button onClick={handleOpenCreate} variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            <span>CREATE ARTICLE</span>
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
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>

          <span className="text-xs text-gray-500 font-semibold">
            {articles.length} {articles.length === 1 ? 'article' : 'articles'} listed
          </span>
        </div>

        {/* Articles Table */}
        <div className="bg-white border border-gray-200 rounded-xs shadow-xs overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-unb-navy animate-spin" />
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Loading news articles...
              </p>
            </div>
          ) : articles.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <p className="text-sm font-bold text-unb-navy">No news articles found</p>
              <p className="text-xs text-gray-500">Create an article to post press releases or stories.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-[10px] font-bold text-gray-500 uppercase border-b border-gray-200 tracking-wider">
                    <th className="py-3 px-4">Title & Details</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Published Date</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {articles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div>
                          <p className="font-bold text-unb-navy">{article.title}</p>
                          <p className="text-[11px] text-gray-500 truncate max-w-md">
                            {article.summary || article.content.substring(0, 100) + '...'}
                          </p>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-bold text-unb-navy bg-blue-50 px-2 py-0.5 rounded-xs border border-blue-100 uppercase">
                          {article.category || 'CORPORATE'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-gray-600">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {hasPermission('news.publish') ? (
                          <button
                            onClick={() => handleToggleStatus(article)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xs text-[10px] font-black uppercase tracking-wider cursor-pointer transition-colors ${
                              article.status === 'PUBLISHED'
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            title="Click to toggle status"
                          >
                            {article.status === 'PUBLISHED' ? (
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
                              article.status === 'PUBLISHED'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {article.status}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {hasPermission('news.edit') && (
                            <button
                              onClick={() => handleOpenEdit(article)}
                              className="p-1 text-gray-600 hover:text-unb-navy cursor-pointer transition-colors"
                              title="Edit article"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                          {hasPermission('news.delete') && (
                            <button
                              onClick={() => setDeleteId(article.id)}
                              className="p-1 text-red-400 hover:text-red-700 cursor-pointer transition-colors"
                              title="Delete article"
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
                  {editingArticle ? 'EDIT ARTICLE' : 'NEW ANNOUNCEMENT'}
                </span>
                <h3 className="text-lg font-black text-unb-navy">
                  {editingArticle ? editingArticle.title : 'Publish News or Press Release'}
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
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. UNB Announces Infrastructure Upgrades"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xs focus:outline-hidden focus:border-unb-navy"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xs focus:outline-hidden focus:border-unb-navy bg-white font-medium cursor-pointer"
                  >
                    <option value="CORPORATE">Corporate</option>
                    <option value="COMMUNITY">Community</option>
                    <option value="HERITAGE">Heritage</option>
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
                  Summary
                </label>
                <input
                  type="text"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Short introductory summary snippet..."
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xs focus:outline-hidden focus:border-unb-navy"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Article Body / Content *
                </label>
                <textarea
                  rows={6}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Full article content (paragraphs separated by blank lines)..."
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xs focus:outline-hidden focus:border-unb-navy font-mono"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Featured Header Image (JPEG, PNG, WebP)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xs p-3 text-center hover:border-unb-navy transition-colors cursor-pointer bg-gray-50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                    className="hidden"
                    id="news-image-upload"
                  />
                  <label htmlFor="news-image-upload" className="cursor-pointer flex items-center justify-center gap-2 text-xs text-gray-600">
                    <Upload className="w-4 h-4 text-unb-navy" />
                    <span>{selectedImage ? selectedImage.name : 'Choose image file to upload'}</span>
                  </label>
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
                    : editingArticle
                    ? (formData.status === 'PUBLISHED' ? 'UPDATE & PUBLISH' : 'UPDATE DRAFT')
                    : (formData.status === 'PUBLISHED' ? 'PUBLISH ARTICLE' : 'SAVE AS DRAFT')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG (ADMIN ONLY) */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete News Article"
        message="Are you sure you want to permanently delete this news article? This action cannot be undone."
        loading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </AdminLayout>
  );
};
