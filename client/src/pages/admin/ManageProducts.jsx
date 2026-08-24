import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Check, ShieldAlert } from 'lucide-react';
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
          <h1 className="font-display font-black text-3xl text-white tracking-tight">
            Manage <span className="text-sky-400">Products</span>
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Add or update product catalogue entries used by the frontend product showcase.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs sm:text-sm tracking-wide transition-all shadow-lg shadow-sky-500/25"
        >
          <Plus className="h-4 w-4 stroke-[3]" /> Add Product
        </button>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-semibold flex items-center gap-2">
          <Check className="h-5 w-5" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold flex items-center gap-2">
          <ShieldAlert className="h-5 w-5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : products.length > 0 ? (
        <div className="bg-slate-900 border border-slate-800 overflow-hidden rounded-2xl shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-300 text-xs font-bold tracking-wider">
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Featured</th>
                  <th className="py-4 px-6">Main Image</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm text-slate-200">
                {products.map((product) => {
                  const imageUrl = resolveAssetUrl(product.image);
                  return (
                    <tr key={product._id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="py-4 px-6 font-bold text-white">{product.name}</td>
                      <td className="py-4 px-6 text-slate-300">{product.category}</td>
                      <td className="py-4 px-6">
                        {product.featured ? (
                          <span className="text-[10px] tracking-wide font-bold bg-sky-500/15 text-sky-300 border border-sky-400/30 px-2.5 py-1 rounded-lg">
                            Featured
                          </span>
                        ) : (
                          <span className="text-[10px] tracking-wide font-semibold text-slate-500">Standard</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="h-12 w-20 object-cover rounded-lg border border-slate-700"
                          />
                        ) : (
                          <span className="text-[10px] text-slate-500">No Image</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 text-slate-300 hover:text-sky-400 hover:bg-slate-800 border border-slate-700 bg-slate-950/60 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 text-slate-300 hover:text-red-400 hover:bg-slate-800 border border-slate-700 bg-slate-950/60 rounded-lg transition-colors"
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
        <div className="text-center p-12 bg-slate-900 rounded-2xl border border-dashed border-slate-800 text-slate-400">
          No products found. Use the Add Product button to create catalogue entries.
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-3xl w-full my-8 max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="font-display font-black text-xl text-white">
                  {editMode ? 'Edit Product' : 'Add Product'}
                </h2>
                <p className="text-sm text-slate-300 mt-1">
                  Add full product details, upload a main image and optional gallery.
                </p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-sky-400 p-1.5 rounded-lg hover:bg-slate-800">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 grid gap-6 overflow-y-auto text-left">
              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none resize-none"
                />
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">Material</label>
                  <input
                    type="text"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    placeholder="e.g. SS 304 / SS 316"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">Dimensions</label>
                  <input
                    type="text"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    placeholder="e.g. 1200mm x 600mm x 900mm"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">Main Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="w-full text-sm text-slate-300"
                  />
                  {existingImage && !imageFile && (
                    <div className="mt-3 border border-slate-700 rounded-xl overflow-hidden">
                      <img src={resolveAssetUrl(existingImage)} alt="Existing main" className="w-full h-36 object-cover" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">Gallery Images</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryChange}
                    className="w-full text-sm text-slate-300"
                  />
                  {existingGallery.length > 0 && (
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {existingGallery.map((url, idx) => (
                        <div key={idx} className="relative rounded-lg overflow-hidden border border-slate-700">
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
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">Features (one per line)</label>
                  <textarea
                    rows={4}
                    value={features}
                    onChange={(e) => setFeatures(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">Specifications (JSON)</label>
                  <textarea
                    rows={4}
                    value={specifications}
                    onChange={(e) => setSpecifications(e.target.value)}
                    placeholder='{"weight":"2kg","finish":"polished"}'
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none resize-none font-mono text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 text-sm text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-sky-500 focus:ring-sky-500"
                  />
                  <span className="text-xs font-bold tracking-wide">Featured Product</span>
                </label>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-black tracking-wide transition-all disabled:cursor-not-allowed disabled:opacity-70 shadow-md shadow-sky-500/25"
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
