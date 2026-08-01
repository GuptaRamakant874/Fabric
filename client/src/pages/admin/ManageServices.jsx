import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, FileUp, Check, ShieldAlert } from 'lucide-react';
import * as Icons from 'lucide-react';
import API from '../../api';
import LoadingSpinner from '../../components/LoadingSpinner';

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isOpen, setIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Wrench');
  const [order, setOrder] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState('');

  // Feedbacks
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const availableIcons = ['Wrench', 'Flame', 'Cpu', 'Grid', 'Layers', 'Shield', 'Gauge', 'Settings', 'Hammer'];

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    try {
      const res = await API.getServices();
      setServices(res.data.data);
    } catch (err) {
      setErrorMsg('Failed to load services list.');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditMode(false);
    setTitle('');
    setDescription('');
    setIcon('Wrench');
    setOrder(services.length + 1);
    setImageFile(null);
    setExistingImage('');
    setErrorMsg(null);
    setIsOpen(true);
  };

  const openEditModal = (service) => {
    setEditMode(true);
    setEditingId(service._id);
    setTitle(service.title);
    setDescription(service.description);
    setIcon(service.icon || 'Wrench');
    setOrder(service.order || 0);
    setImageFile(null);
    setExistingImage(service.image || '');
    setErrorMsg(null);
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await API.deleteService(id);
      setSuccessMsg('Service removed successfully.');
      loadServices();
    } catch (err) {
      setErrorMsg('Failed to delete service.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!title || !description) {
      setErrorMsg('Title and Description are required.');
      setSaving(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('icon', icon);
    formData.append('order', order);

    if (imageFile) {
      formData.append('image', imageFile);
    } else if (editMode) {
      formData.append('existingImage', existingImage);
    }

    try {
      if (editMode) {
        await API.updateService(editingId, formData);
        setSuccessMsg('Service updated successfully.');
      } else {
        await API.createService(formData);
        setSuccessMsg('New service added successfully.');
      }
      setIsOpen(false);
      loadServices();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to save service.');
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
            Manage <span className="text-industrial-orange">Services</span>
          </h1>
          <p className="text-sm text-industrial-muted mt-1">
            Configure the core capabilities displayed on the public services directory.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded bg-industrial-orange hover:bg-industrial-orange-hover text-industrial-charcoal font-black text-xs uppercase tracking-wider transition-all"
        >
          <Plus className="h-4.5 w-4.5" /> Add Service
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

      {/* Services Table */}
      {loading ? (
        <LoadingSpinner />
      ) : services.length > 0 ? (
        <div className="glass-panel overflow-hidden rounded-lg shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-industrial-charcoal border-b border-industrial-border text-industrial-muted uppercase text-[10px] font-bold tracking-wider">
                  <th className="py-4 px-6">Order</th>
                  <th className="py-4 px-6">Icon</th>
                  <th className="py-4 px-6">Image</th>
                  <th className="py-4 px-6">Service Title</th>
                  <th className="py-4 px-6">Description Overview</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-industrial-border/30 text-sm">
                {services.map((service) => {
                  const IconComp = Icons[service.icon] || Icons.Wrench;
                  const imageUrl = service.image?.startsWith('/uploads/')
                    ? `http://localhost:5000${service.image}`
                    : service.image;

                  return (
                    <tr key={service._id} className="hover:bg-industrial-steel/10 transition-colors">
                      <td className="py-4 px-6 font-mono text-industrial-orange font-bold">
                        {service.order}
                      </td>
                      <td className="py-4 px-6">
                        <div className="p-2 bg-industrial-steel/40 text-industrial-orange rounded border border-industrial-border w-fit">
                          <IconComp className="h-4.5 w-4.5" />
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={service.title}
                            className="h-8 w-12 object-cover rounded border border-industrial-border"
                          />
                        ) : (
                          <span className="text-[10px] text-industrial-muted font-mono">No Image</span>
                        )}
                      </td>
                      <td className="py-4 px-6 font-bold text-industrial-light">
                        {service.title}
                      </td>
                      <td className="py-4 px-6 text-industrial-muted max-w-xs truncate">
                        {service.description}
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(service)}
                          className="p-2 text-industrial-muted hover:text-industrial-orange border border-industrial-border rounded"
                          title="Edit Service"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(service._id)}
                          className="p-2 text-industrial-muted hover:text-red-400 border border-industrial-border rounded"
                          title="Delete Service"
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
          No services configured. Click "Add Service" to build capabilities.
        </div>
      )}

      {/* Editor Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-industrial-gray border border-industrial-border rounded-lg shadow-2xl max-w-lg w-full">
            {/* Header */}
            <div className="p-6 border-b border-industrial-border flex items-center justify-between">
              <h2 className="font-display font-black text-xl text-industrial-light uppercase">
                {editMode ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button onClick={() => setIsOpen(false)} className="text-industrial-muted hover:text-industrial-orange p-1">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 text-left">
              {errorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold rounded flex items-center gap-2">
                  <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-industrial-muted mb-1.5">
                  Service Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Precision CNC Plasma Cutting"
                  className="w-full bg-industrial-charcoal border border-industrial-border rounded px-3 py-2 text-sm text-industrial-light focus:border-industrial-orange focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-industrial-muted mb-1.5">
                  Description Details
                </label>
                <textarea
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Details of cutting size tolerances, steel thickness limits..."
                  className="w-full bg-industrial-charcoal border border-industrial-border rounded px-3 py-2 text-sm text-industrial-light focus:border-industrial-orange focus:outline-none resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Icon Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-industrial-muted mb-1.5">
                    Vector Icon
                  </label>
                  <select
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full bg-industrial-charcoal border border-industrial-border rounded px-3 py-2 text-sm text-industrial-light focus:outline-none"
                  >
                    {availableIcons.map((ico) => (
                      <option key={ico} value={ico}>
                        {ico}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ordering order */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-industrial-muted mb-1.5">
                    Display Order Index
                  </label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full bg-industrial-charcoal border border-industrial-border rounded px-3 py-2 text-sm text-industrial-light focus:border-industrial-orange focus:outline-none"
                  />
                </div>
              </div>

              {/* File Upload Box */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-industrial-muted mb-1.5">
                  Service Illustration Image
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
                    {imageFile ? imageFile.name : 'Select capability photo'}
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
                  {saving ? 'Saving...' : 'Save Capability'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageServices;
