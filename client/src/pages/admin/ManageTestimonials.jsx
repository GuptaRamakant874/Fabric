import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, FileUp, Check, ShieldAlert, Star } from 'lucide-react';
import API from '../../api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { resolveAssetUrl } from '../../utils/urls';
import CustomDropdown from '../../components/CustomDropdown';

const ManageTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isOpen, setIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [clientName, setClientName] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState('');

  // Feedbacks
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const ratingOptions = [
    { value: 5, label: '5 Stars' },
    { value: 4, label: '4 Stars' },
    { value: 3, label: '3 Stars' },
    { value: 2, label: '2 Stars' },
    { value: 1, label: '1 Star' },
  ];

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    setLoading(true);
    try {
      const res = await API.getTestimonials();
      setTestimonials(res.data.data);
    } catch (err) {
      setErrorMsg('Failed to load testimonials.');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditMode(false);
    setClientName('');
    setCompany('');
    setMessage('');
    setRating(5);
    setImageFile(null);
    setExistingImage('');
    setErrorMsg(null);
    setIsOpen(true);
  };

  const openEditModal = (t) => {
    setEditMode(true);
    setEditingId(t._id);
    setClientName(t.clientName);
    setCompany(t.company || '');
    setMessage(t.message);
    setRating(t.rating || 5);
    setImageFile(null);
    setExistingImage(t.image || '');
    setErrorMsg(null);
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await API.deleteTestimonial(id);
      setSuccessMsg('Testimonial removed successfully.');
      loadTestimonials();
    } catch (err) {
      setErrorMsg('Failed to delete testimonial.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!clientName || !message) {
      setErrorMsg('Client Name and Message content are required.');
      setSaving(false);
      return;
    }

    const formData = new FormData();
    formData.append('clientName', clientName);
    formData.append('company', company);
    formData.append('message', message);
    formData.append('rating', rating);

    if (imageFile) {
      formData.append('image', imageFile);
    } else if (editMode) {
      formData.append('existingImage', existingImage);
    }

    try {
      if (editMode) {
        await API.updateTestimonial(editingId, formData);
        setSuccessMsg('Testimonial updated successfully.');
      } else {
        await API.createTestimonial(formData);
        setSuccessMsg('Testimonial added successfully.');
      }
      setIsOpen(false);
      loadTestimonials();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to save testimonial.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-3xl text-white tracking-tight">
            Manage <span className="text-sky-400">Testimonials</span>
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Display client reviews and ratings on the home landing page.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs sm:text-sm tracking-wide transition-all shadow-lg shadow-sky-500/25"
        >
          <Plus className="h-4 w-4 stroke-[3]" /> Add Review
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

      {/* Testimonials list */}
      {loading ? (
        <LoadingSpinner />
      ) : testimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => {
            const avatarUrl = resolveAssetUrl(t.image);
            return (
              <div
                key={t._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl relative hover:border-sky-500/40 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    {/* Stars */}
                    <div className="flex text-amber-400 gap-0.5">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>

                    <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => openEditModal(t)}
                        className="text-slate-400 hover:text-sky-400 hover:bg-slate-800 border border-slate-700 bg-slate-950/60 p-1.5 rounded-lg transition-colors"
                        title="Edit Review"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(t._id)}
                        className="text-slate-400 hover:text-red-400 hover:bg-slate-800 border border-slate-700 bg-slate-950/60 p-1.5 rounded-lg transition-colors"
                        title="Delete Review"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-slate-200 italic leading-relaxed">
                    "{t.message}"
                  </p>
                </div>

                <div className="flex items-center gap-3 border-t border-slate-800 mt-4 pt-3.5">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={t.clientName}
                      className="h-9 w-9 rounded-full object-cover border border-slate-700"
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-slate-950 flex items-center justify-center text-[10px] text-sky-400 font-bold border border-slate-700">
                      {t.clientName.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-sm text-white">{t.clientName}</h4>
                    <span className="text-xs text-slate-400">{t.company || 'Private Client'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center p-12 bg-slate-900 rounded-2xl border border-dashed border-slate-800 text-slate-400">
          No customer reviews registered yet. Click "Add Review" to display feedback.
        </div>
      )}

      {/* Editor Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-md w-full my-8 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h2 className="font-display font-black text-xl text-white">
                {editMode ? 'Edit Testimonial' : 'Add Testimonial'}
              </h2>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-sky-400 p-1.5 rounded-lg hover:bg-slate-800">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left overflow-y-auto">
              {errorMsg && (
                <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Client Name */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  Client Name
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. John Carter"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  Company / Organization
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Apex Biotech (optional)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                />
              </div>

              {/* Rating selection (Opens Downward) */}
              <div>
                <CustomDropdown
                  label="Rating Stars"
                  options={ratingOptions}
                  value={rating}
                  onChange={(val) => setRating(Number(val))}
                  buttonClassName="py-2.5 px-4 text-sm"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  Testimonial Review Message
                </label>
                <textarea
                  rows="3"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Client feedback review text..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none resize-none"
                ></textarea>
              </div>

              {/* File Upload Box */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  Client Headshot / Company Logo
                </label>
                <div className="relative border border-dashed border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-950/70 hover:bg-slate-950 hover:border-sky-400 transition-all cursor-pointer">
                  <input
                    type="file"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <FileUp className="h-6 w-6 text-sky-400 mb-1" />
                  <p className="text-xs text-white font-bold">
                    {imageFile ? imageFile.name : 'Select headshot image'}
                  </p>
                </div>
                {editMode && existingImage && !imageFile && (
                  <p className="text-[10px] text-slate-400 mt-1.5">
                    Currently utilizing: <span className="font-mono text-sky-400 truncate max-w-[200px] inline-block align-bottom">{existingImage}</span>
                  </p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border border-slate-700 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs tracking-wide rounded-xl disabled:opacity-50 shadow-md shadow-sky-500/25"
                >
                  {saving ? 'Saving...' : 'Save Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTestimonials;
