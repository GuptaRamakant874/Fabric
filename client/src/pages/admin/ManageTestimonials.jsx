import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, FileUp, Check, ShieldAlert, Star } from 'lucide-react';
import API from '../../api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { resolveAssetUrl } from '../../utils/urls';

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
          <h1 className="font-display font-black text-3xl text-industrial-light uppercase tracking-tight">
            Manage <span className="text-industrial-orange">Testimonials</span>
          </h1>
          <p className="text-sm text-industrial-muted mt-1">
            Display client reviews and ratings on the home landing page.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded bg-industrial-orange hover:bg-industrial-orange-hover text-industrial-charcoal font-black text-xs uppercase tracking-wider transition-all"
        >
          <Plus className="h-4.5 w-4.5" /> Add Review
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
                className="bg-industrial-gray border border-industrial-border/60 rounded-lg p-5 flex flex-col justify-between shadow-lg relative"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    {/* Stars */}
                    <div className="flex text-industrial-orange">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-current" />
                      ))}
                    </div>

                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => openEditModal(t)}
                        className="text-industrial-muted hover:text-industrial-orange border border-industrial-border/40 p-1.5 rounded"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(t._id)}
                        className="text-industrial-muted hover:text-red-400 border border-industrial-border/40 p-1.5 rounded"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-industrial-muted italic leading-relaxed">
                    "{t.message}"
                  </p>
                </div>

                <div className="flex items-center gap-3 border-t border-industrial-border/30 mt-4 pt-3">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={t.clientName}
                      className="h-9 w-9 rounded-full object-cover border border-industrial-border"
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-industrial-steel/40 flex items-center justify-center text-[10px] text-industrial-muted font-bold border border-industrial-border">
                      {t.clientName.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-industrial-light">{t.clientName}</h4>
                    <span className="text-[10px] text-industrial-muted">{t.company || 'Private client'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center p-12 bg-industrial-gray rounded-lg border border-dashed border-industrial-border text-industrial-muted">
          No customer reviews registered yet. Click "Add Review" to display feedback.
        </div>
      )}

      {/* Editor Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-industrial-gray border border-industrial-border rounded-lg shadow-2xl max-w-md w-full">
            {/* Header */}
            <div className="p-6 border-b border-industrial-border flex items-center justify-between">
              <h2 className="font-display font-black text-xl text-industrial-light uppercase">
                {editMode ? 'Edit Testimonial' : 'Add Testimonial'}
              </h2>
              <button onClick={() => setIsOpen(false)} className="text-industrial-muted hover:text-industrial-orange p-1">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
              {errorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold rounded flex items-center gap-2">
                  <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Client Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-industrial-muted mb-1.5">
                  Client Name
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. John Carter"
                  className="w-full bg-industrial-charcoal border border-industrial-border rounded px-3 py-2 text-sm text-industrial-light focus:border-industrial-orange focus:outline-none"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-industrial-muted mb-1.5">
                  Company / Organization
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Apex Construction (optional)"
                  className="w-full bg-industrial-charcoal border border-industrial-border rounded px-3 py-2 text-sm text-industrial-light focus:border-industrial-orange focus:outline-none"
                />
              </div>

              {/* Rating selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-industrial-muted mb-1.5">
                  Rating Stars
                </label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full bg-industrial-charcoal border border-industrial-border rounded px-3 py-2 text-sm text-industrial-light focus:outline-none"
                >
                  <option value={5}>5 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={2}>2 Stars</option>
                  <option value={1}>1 Star</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-industrial-muted mb-1.5">
                  Testimonial Review Message
                </label>
                <textarea
                  rows="3"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Client feedback review text..."
                  className="w-full bg-industrial-charcoal border border-industrial-border rounded px-3 py-2 text-sm text-industrial-light focus:border-industrial-orange focus:outline-none resize-none"
                ></textarea>
              </div>

              {/* File Upload Box */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-industrial-muted mb-1.5">
                  Client Headshot / Company Logo
                </label>
                <div className="relative border border-dashed border-industrial-border rounded p-4 flex flex-col items-center justify-center bg-industrial-charcoal/50">
                  <input
                    type="file"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <FileUp className="h-6 w-6 text-industrial-orange mb-1" />
                  <p className="text-xs text-industrial-light font-bold">
                    {imageFile ? imageFile.name : 'Select headshot image'}
                  </p>
                </div>
                {editMode && existingImage && !imageFile && (
                  <p className="text-[10px] text-industrial-muted mt-1.5">
                    Currently utilizing: <span className="font-mono text-industrial-orange truncate max-w-[200px] inline-block align-bottom">{existingImage}</span>
                  </p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-industrial-border flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border border-industrial-border rounded text-xs font-bold uppercase text-industrial-muted hover:text-industrial-light"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-industrial-orange hover:bg-industrial-orange-hover text-industrial-charcoal font-black text-xs uppercase tracking-wider rounded disabled:opacity-50"
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
