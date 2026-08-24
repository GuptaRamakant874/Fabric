import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, FileUp, Check, ShieldAlert } from 'lucide-react';
import * as Icons from 'lucide-react';
import API from '../../api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { resolveAssetUrl } from '../../utils/urls';
import CustomDropdown from '../../components/CustomDropdown';

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
          <h1 className="font-display font-black text-3xl text-white tracking-tight">
            Manage <span className="text-sky-400">Services</span>
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Configure the core capabilities displayed on the public services directory.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs sm:text-sm tracking-wide transition-all shadow-lg shadow-sky-500/25"
        >
          <Plus className="h-4 w-4 stroke-[3]" /> Add Service
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

      {/* Services Table */}
      {loading ? (
        <LoadingSpinner />
      ) : services.length > 0 ? (
        <div className="bg-slate-900 border border-slate-800 overflow-hidden rounded-2xl shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-300 text-xs font-bold tracking-wider">
                  <th className="py-4 px-6">Order</th>
                  <th className="py-4 px-6">Icon</th>
                  <th className="py-4 px-6">Image</th>
                  <th className="py-4 px-6">Service Title</th>
                  <th className="py-4 px-6">Description Overview</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm text-slate-200">
                {services.map((service) => {
                  const IconComp = Icons[service.icon] || Icons.Wrench;
                  const imageUrl = resolveAssetUrl(service.image);

                  return (
                    <tr key={service._id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="py-4 px-6 font-mono text-sky-400 font-bold">
                        #{service.order}
                      </td>
                      <td className="py-4 px-6">
                        <div className="p-2 bg-slate-950 text-sky-400 rounded-lg border border-slate-700 w-fit">
                          <IconComp className="h-4.5 w-4.5" />
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={service.title}
                            className="h-9 w-14 object-cover rounded-lg border border-slate-700"
                          />
                        ) : (
                          <span className="text-[10px] text-slate-500 font-mono">No Image</span>
                        )}
                      </td>
                      <td className="py-4 px-6 font-bold text-white">
                        {service.title}
                      </td>
                      <td className="py-4 px-6 text-slate-300 max-w-xs truncate">
                        {service.description}
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(service)}
                          className="p-2 text-slate-300 hover:text-sky-400 hover:bg-slate-800 border border-slate-700 bg-slate-950/60 rounded-lg transition-colors"
                          title="Edit Service"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(service._id)}
                          className="p-2 text-slate-300 hover:text-red-400 hover:bg-slate-800 border border-slate-700 bg-slate-950/60 rounded-lg transition-colors"
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
        <div className="text-center p-12 bg-slate-900 rounded-2xl border border-dashed border-slate-800 text-slate-400">
          No services configured. Click "Add Service" to build capabilities.
        </div>
      )}

      {/* Editor Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-lg w-full my-8 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h2 className="font-display font-black text-xl text-white">
                {editMode ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-sky-400 p-1.5 rounded-lg hover:bg-slate-800">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 text-left overflow-y-auto">
              {errorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  Service Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Precision CNC Plasma Cutting"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  Description Details
                </label>
                <textarea
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Details of cutting size tolerances, steel thickness limits..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Icon Selection (Opens Downward) */}
                <div>
                  <CustomDropdown
                    label="Vector Icon"
                    options={availableIcons}
                    value={icon}
                    onChange={(val) => setIcon(val)}
                    buttonClassName="py-2.5 px-3 text-sm"
                  />
                </div>

                {/* Ordering order */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    Display Order Index
                  </label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-sky-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* File Upload Box */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  Service Illustration Image
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
                    {imageFile ? imageFile.name : 'Select capability photo'}
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
