import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Check, ShieldAlert, Package } from 'lucide-react';
import API from '../../api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { resolveAssetUrl } from '../../utils/urls';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('General');
  const [description, setDescription] = useState('');
  const [material, setMaterial] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [features, setFeatures] = useState('');
  const [specifications, setSpecifications] = useState('');
  const [featured, setFeatured] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [existingImage, setExistingImage] = useState('');
  const [existingGallery, setExistingGallery] = useState([]);

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await API.getProducts();
      setProducts(res.data.data);
    } catch (err) {
      setErrorMsg('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditMode(false);
    setEditingId(null);
    setName('');
    setCategory('General');
    setDescription('');
    setMaterial('');
    setDimensions('');
    setFeatures('');
    setSpecifications('');
    setFeatured(false);
    setImageFile(null);
    setGalleryFiles([]);
    setExistingImage('');
    setExistingGallery([]);
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsOpen(true);
  };

  const openEditModal = (product) => {
    setEditMode(true);
    setEditingId(product._id);
    setName(product.name);
    setCategory(product.category || 'General');
    setDescription(product.description || '');
    setMaterial(product.material || '');
    setDimensions(product.dimensions || '');
    setFeatures((product.features || []).join('\n'));
    setSpecifications(JSON.stringify(product.specifications || {}, null, 2));
    setFeatured(product.featured || false);
    setImageFile(null);
    setGalleryFiles([]);
    setExistingImage(product.image || '');
    setExistingGallery(product.gallery || []);
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product from the catalogue?')) return;
    try {
      await API.deleteProduct(id);
      setSuccessMsg('Product deleted successfully.');
      loadProducts();
    } catch (err) {
      setErrorMsg('Could not delete product.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name || !category || !description) {
      setErrorMsg('Name, category and description are required.');
      setSaving(false);
      return;
    }

    if (!editMode && !imageFile) {
      setErrorMsg('Please upload a main product image.');
      setSaving(false);
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('material', material);
    formData.append('dimensions', dimensions);
    formData.append('features', features);
    formData.append('specifications', specifications);
    formData.append('featured', featured);

    if (imageFile) {
      formData.append('image', imageFile);
    } else if (editMode) {
      formData.append('existingImage', existingImage);
    }

    galleryFiles.forEach((file) => {
      formData.append('gallery', file);
    });

    if (editMode) {
      formData.append('existingGallery', JSON.stringify(existingGallery));
    }

    try {
      if (editMode) {
        await API.updateProduct(editingId, formData);
        setSuccessMsg('Product updated successfully.');
      } else {
        await API.createProduct(formData);
        setSuccessMsg('Product added successfully.');
      }
      setIsOpen(false);
      loadProducts();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Could not save product.');
    } finally {
      setSaving(false);
    }
  };

  const handleGalleryChange = (e) => {
    if (!e.target.files) return;
    setGalleryFiles(Array.from(e.target.files));
  };

  const removeGalleryItem = (index) => {
    setExistingGallery(existingGallery.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-8 text-left">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-3xl text-industrial-light uppercase tracking-tight">
            Manage <span className="text-industrial-orange">Products</span>
          </h1>
          <p className="text-sm text-industrial-muted mt-1">
            Add or update product catalogue entries used by the frontend product showcase.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded bg-industrial-orange hover:bg-industrial-orange-hover text-industrial-charcoal font-black text-xs uppercase tracking-wider transition-all"
        >
          <Plus className="h-4.5 w-4.5" /> Add Product
        </button>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-semibold flex items-center gap-2">
          <Check className="h-5 w-5" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-3.5 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-semibold flex items-center gap-2">
          <ShieldAlert className="h-5 w-5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : products.length > 0 ? (
        <div className="glass-panel overflow-hidden rounded-lg shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-industrial-charcoal border-b border-industrial-border text-industrial-muted uppercase text-[10px] font-bold tracking-wider">
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Featured</th>
                  <th className="py-4 px-6">Main Image</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-industrial-border/30 text-sm">
                {products.map((product) => {
                  const imageUrl = resolveAssetUrl(product.image);
                  return (
                    <tr key={product._id} className="hover:bg-industrial-steel/10 transition-colors">
                      <td className="py-4 px-6 font-bold text-industrial-light">{product.name}</td>
                      <td className="py-4 px-6 text-industrial-muted">{product.category}</td>
                      <td className="py-4 px-6">
                        {product.featured ? (
                          <span className="text-[10px] uppercase tracking-wider font-bold bg-industrial-orange/15 text-industrial-orange border border-industrial-orange/30 px-2 py-1 rounded">
                            Yes
                          </span>
                        ) : (
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-industrial-muted">No</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="h-12 w-20 object-cover rounded border border-industrial-border"
                          />
                        ) : (
                          <span className="text-[10px] text-industrial-muted">No image</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 text-industrial-muted hover:text-industrial-orange border border-industrial-border rounded"
                          title="Edit Product"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 text-industrial-muted hover:text-red-400 border border-industrial-border rounded"
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center p-12 bg-industrial-gray rounded-lg border border-dashed border-industrial-border text-industrial-muted">
          No products found. Use the Add Product button to create catalogue entries.
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-industrial-gray border border-industrial-border rounded-lg shadow-2xl max-w-3xl w-full">
            <div className="p-6 border-b border-industrial-border flex items-center justify-between">
              <div>
                <h2 className="font-display font-black text-xl text-industrial-light uppercase tracking-tight">
                  {editMode ? 'Edit Product' : 'Add Product'}
                </h2>
                <p className="text-sm text-industrial-muted mt-1">
                  Add full product details, upload a main image and optional gallery.
                </p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-industrial-muted hover:text-industrial-orange p-1">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 grid gap-6">
              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-industrial-muted mb-1.5">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-industrial-charcoal border border-industrial-border rounded px-3 py-2 text-sm text-industrial-light focus:border-industrial-orange focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-industrial-muted mb-1.5">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-industrial-charcoal border border-industrial-border rounded px-3 py-2 text-sm text-industrial-light focus:border-industrial-orange focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-industrial-muted mb-1.5">Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-industrial-charcoal border border-industrial-border rounded px-3 py-2 text-sm text-industrial-light focus:border-industrial-orange focus:outline-none"
                />
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-industrial-muted mb-1.5">Material</label>
                  <input
                    type="text"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="w-full bg-industrial-charcoal border border-industrial-border rounded px-3 py-2 text-sm text-industrial-light focus:border-industrial-orange focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-industrial-muted mb-1.5">Dimensions</label>
                  <input
                    type="text"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    className="w-full bg-industrial-charcoal border border-industrial-border rounded px-3 py-2 text-sm text-industrial-light focus:border-industrial-orange focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-industrial-muted mb-1.5">Main Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="w-full text-sm text-industrial-light"
                  />
                  {existingImage && !imageFile && (
                    <div className="mt-3 border border-industrial-border rounded-lg overflow-hidden">
                      <img src={resolveAssetUrl(existingImage)} alt="Existing main" className="w-full h-36 object-cover" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-industrial-muted mb-1.5">Gallery Images</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryChange}
                    className="w-full text-sm text-industrial-light"
                  />
                  {existingGallery.length > 0 && (
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {existingGallery.map((url, idx) => (
                        <div key={idx} className="relative rounded-lg overflow-hidden border border-industrial-border">
                          <img src={resolveAssetUrl(url)} alt={`Gallery ${idx + 1}`} className="h-20 w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeGalleryItem(idx)}
                            className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-industrial-muted mb-1.5">Features (one per line)</label>
                  <textarea
                    rows={4}
                    value={features}
                    onChange={(e) => setFeatures(e.target.value)}
                    className="w-full bg-industrial-charcoal border border-industrial-border rounded px-3 py-2 text-sm text-industrial-light focus:border-industrial-orange focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-industrial-muted mb-1.5">Specifications (JSON)</label>
                  <textarea
                    rows={4}
                    value={specifications}
                    onChange={(e) => setSpecifications(e.target.value)}
                    placeholder='{"weight":"2kg","finish":"polished"}'
                    className="w-full bg-industrial-charcoal border border-industrial-border rounded px-3 py-2 text-sm text-industrial-light focus:border-industrial-orange focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 text-sm text-industrial-light">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded border-industrial-border bg-industrial-charcoal text-industrial-orange focus:ring-industrial-orange"
                  />
                  <span className="text-xs uppercase tracking-wider">Featured product</span>
                </label>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2 border-t border-industrial-border/50">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded border border-industrial-border text-sm text-industrial-muted hover:bg-industrial-steel/30"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded bg-industrial-orange hover:bg-industrial-orange-hover text-industrial-charcoal text-sm font-black uppercase tracking-wider transition-all disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving ? 'Saving...' : editMode ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
