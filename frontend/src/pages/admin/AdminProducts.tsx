import React, { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/adminService';
import { Button } from '../../components/ui/Button';
import { resolveImageUrl } from '../../utils/imageUrl';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Star,
  Loader2,
  AlertCircle,
  X,
  Upload,
} from 'lucide-react';
import type { Product, Category, ContentStatus } from '../../types';

export const AdminProducts: React.FC = () => {
  const { hasPermission } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    shortDescription: '',
    description: '',
    isFeatured: false,
    status: 'DRAFT' as ContentStatus,
    displayOrder: 0,
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [prodRes, catRes] = await Promise.all([
        adminService.getProducts({
          status: statusFilter,
          category: categoryFilter,
        }),
        adminService.getCategories(),
      ]);
      const list = Array.isArray(prodRes) ? prodRes : (prodRes.data || []);
      setProducts(list);
      setCategories(catRes || []);
    } catch (err) {
      setError((err as Error).message || 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, categoryFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      categoryId: categories[0]?.id || '',
      shortDescription: '',
      description: '',
      isFeatured: false,
      status: 'DRAFT',
      displayOrder: 0,
    });
    setSelectedImage(null);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      categoryId: product.categoryId,
      shortDescription: product.shortDescription || '',
      description: product.description || '',
      isFeatured: product.isFeatured || false,
      status: product.status,
      displayOrder: product.displayOrder || 0,
    });
    setSelectedImage(null);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setModalError('Product name is required.');
      return;
    }
    if (!formData.categoryId) {
      setModalError('Please select a category.');
      return;
    }

    try {
      setModalSubmitting(true);
      setModalError(null);

      const data = new FormData();
      data.append('name', formData.name.trim());
      data.append('categoryId', formData.categoryId);
      if (formData.shortDescription) data.append('shortDescription', formData.shortDescription.trim());
      if (formData.description) data.append('description', formData.description.trim());
      data.append('isFeatured', formData.isFeatured ? 'true' : 'false');
      data.append('status', formData.status);
      data.append('displayOrder', formData.displayOrder.toString());

      if (selectedImage) {
        data.append('image', selectedImage);
      }

      if (editingProduct) {
        await adminService.updateProduct(editingProduct.id, data);
      } else {
        await adminService.createProduct(data);
      }

      setIsModalOpen(false);
      await fetchProducts();
    } catch (err) {
      setModalError((err as Error).message || 'Failed to save product.');
    } finally {
      setModalSubmitting(false);
    }
  };

  const handleToggleStatus = async (product: Product) => {
    const nextStatus: ContentStatus = product.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      await adminService.patchProductStatus(product.id, nextStatus);
      await fetchProducts();
    } catch (err) {
      setError((err as Error).message || 'Failed to update status.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      await adminService.deleteProduct(deleteId);
      setDeleteId(null);
      await fetchProducts();
    } catch (err) {
      setError((err as Error).message || 'Failed to delete product.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <AdminLayout
      title="Product & Brand Management"
      subtitle="Create, edit, publish and organize UNB beverage products"
      action={
        hasPermission('products.create') ? (
          <Button onClick={handleOpenCreate} variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            <span>ADD NEW PRODUCT</span>
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
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <span className="text-[11px] font-bold text-gray-500 uppercase mr-2">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-1.5 text-xs border border-gray-300 rounded-xs focus:outline-hidden focus:border-unb-navy bg-white font-medium cursor-pointer"
              >
                <option value="ALL">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
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
          </div>

          <span className="text-xs text-gray-500 font-semibold">
            {products.length} {products.length === 1 ? 'product' : 'products'} listed
          </span>
        </div>

        {/* Products Table */}
        <div className="bg-white border border-gray-200 rounded-xs shadow-xs overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-unb-navy animate-spin" />
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Loading products...
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <p className="text-sm font-bold text-unb-navy">No products found</p>
              <p className="text-xs text-gray-500">Create a new product to add items to the catalogue.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-[10px] font-bold text-gray-500 uppercase border-b border-gray-200 tracking-wider">
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 text-center">Featured</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50/70 transition-colors">
                      {/* Product Name & Details */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-unb-sand rounded-xs border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                            <img
                              src={resolveImageUrl(product.imageUrl, '/images/unb-reference/home-about.jpg')}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-unb-navy">{product.name}</p>
                            <p className="text-[11px] text-gray-400 font-mono">/{product.slug}</p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="text-xs text-gray-700 font-medium">
                          {product.category?.name || '—'}
                        </span>
                      </td>

                      {/* Featured */}
                      <td className="py-3.5 px-4 text-center">
                        {product.isFeatured ? (
                          <Star className="w-4 h-4 text-unb-amber fill-unb-amber mx-auto" />
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        {hasPermission('products.publish') ? (
                          <button
                            onClick={() => handleToggleStatus(product)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xs text-[10px] font-black uppercase tracking-wider cursor-pointer transition-colors ${
                              product.status === 'PUBLISHED'
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            title="Click to toggle status"
                          >
                            {product.status === 'PUBLISHED' ? (
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
                              product.status === 'PUBLISHED'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {product.status}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {hasPermission('products.edit') && (
                            <button
                              onClick={() => handleOpenEdit(product)}
                              className="p-1 text-gray-600 hover:text-unb-navy cursor-pointer transition-colors"
                              title="Edit product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                          {hasPermission('products.delete') && (
                            <button
                              onClick={() => setDeleteId(product.id)}
                              className="p-1 text-red-400 hover:text-red-700 cursor-pointer transition-colors"
                              title="Delete product"
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
          <div className="bg-white max-w-xl w-full rounded-xs shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="border-b border-gray-100 pb-3">
                <span className="text-[10px] font-bold text-unb-amber uppercase">
                  {editingProduct ? 'EDIT PRODUCT' : 'NEW PRODUCT'}
                </span>
                <h3 className="text-lg font-black text-unb-navy">
                  {editingProduct ? editingProduct.name : 'Create Beverage Product'}
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
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Chibuku Super"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xs focus:outline-hidden focus:border-unb-navy"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xs focus:outline-hidden focus:border-unb-navy bg-white font-medium cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
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
                  Short Description
                </label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Brief tagline or summary..."
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xs focus:outline-hidden focus:border-unb-navy"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Detailed Description / Brand Story
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Full product story, brewing method, characteristics..."
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xs focus:outline-hidden focus:border-unb-navy"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Product Image (JPEG, PNG, WebP)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xs p-3 text-center hover:border-unb-navy transition-colors cursor-pointer bg-gray-50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                    className="hidden"
                    id="product-image-upload"
                  />
                  <label htmlFor="product-image-upload" className="cursor-pointer flex items-center justify-center gap-2 text-xs text-gray-600">
                    <Upload className="w-4 h-4 text-unb-navy" />
                    <span>{selectedImage ? selectedImage.name : 'Choose image file to upload'}</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured-checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="rounded-xs border-gray-300 text-unb-navy focus:ring-0"
                />
                <label htmlFor="featured-checkbox" className="text-xs font-bold text-gray-700 cursor-pointer">
                  Feature on Home Page showcase
                </label>
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
                    : editingProduct
                    ? (formData.status === 'PUBLISHED' ? 'UPDATE & PUBLISH' : 'UPDATE DRAFT')
                    : (formData.status === 'PUBLISHED' ? 'PUBLISH PRODUCT' : 'SAVE AS DRAFT')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG (ADMIN ONLY) */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Product"
        message="Are you sure you want to permanently delete this product and its variants? This action cannot be undone."
        loading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </AdminLayout>
  );
};
