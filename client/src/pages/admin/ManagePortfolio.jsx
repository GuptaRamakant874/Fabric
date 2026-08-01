import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, FileUp, Check, ShieldAlert, Star } from 'lucide-react';
import API from '../../api';
import LoadingSpinner from '../../components/LoadingSpinner';

const ManagePortfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal / Form States
  const [isOpen, setIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Industrial');
  const [client, setClient] = useState('');
  const [completedDate, setCompletedDate] = useState('');
  const [featured, setFeatured] = useState(false);
  const [description, setDescription] = useState('');
  
  // Upload States
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  
  // Feedbacks
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await API.getProjects();
      setProjects(res.data.data);
    } catch (err) {
      setErrorMsg('Failed to load portfolio items.');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditMode(false);
    setTitle('');
    setCategory('Industrial');
    setClient('');
    setCompletedDate(new Date().toISOString().split('T')[0]);
    setFeatured(false);
    setDescription('');
    setNewImageFiles([]);
    setExistingImages([]);
    setErrorMsg(null);
    setIsOpen(true);
  };

  const openEditModal = (project) => {
    setEditMode(true);
    setEditingId(project._id);
    setTitle(project.title);
    setCategory(project.category);
    setClient(project.client || '');
    setCompletedDate(project.completedDate ? new Date(project.completedDate).toISOString().split('T')[0] : '');
    setFeatured(project.featured || false);
    setDescription(project.description);
    setNewImageFiles([]);
    setExistingImages(project.images || []);
    setErrorMsg(null);
    setIsOpen(true);
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setNewImageFiles(Array.from(e.target.files));
    }
  };

  const handleRemoveExistingImage = (indexToRemove) => {
    setExistingImages(existingImages.filter((_, idx) => idx !== indexToRemove));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this portfolio project?')) return;
    try {
      await API.deleteProject(id);
      setSuccessMsg('Project deleted successfully.');
      loadProjects();
    } catch (err) {
      setErrorMsg('Failed to delete project.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!title || !description) {
      setErrorMsg('Please fill out the Title and Description fields.');
      setSaving(false);
      return;
    }

    if (!editMode && newImageFiles.length === 0) {
      setErrorMsg('Please upload at least one image.');
      setSaving(false);
      return;
    }

    if (editMode && existingImages.length === 0 && newImageFiles.length === 0) {
      setErrorMsg('Project must have at least one image.');
      setSaving(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('client', client);
    formData.append('completedDate', completedDate);
    formData.append('featured', featured);
    formData.append('description', description);

    // Append newly uploaded files
    newImageFiles.forEach((file) => {
      formData.append('images', file);
    });

    if (editMode) {
      // Append list of retained images
      formData.append('existingImages', JSON.stringify(existingImages));
    }

    try {
      if (editMode) {
        await API.updateProject(editingId, formData);
        setSuccessMsg('Project updated successfully.');
      } else {
        await API.createProject(formData);
        setSuccessMsg('New project added successfully.');
      }
      setIsOpen(false);
      loadProjects();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error occurred while saving project.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-3xl text-industrial-light uppercase tracking-tight">
            Manage <span className="text-industrial-orange">Portfolio</span>
          </h1>
          <p className="text-sm text-industrial-muted mt-1">
            Create, update, and delete company projects displayed in the public gallery.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded bg-industrial-orange hover:bg-industrial-orange-hover text-industrial-charcoal font-black text-xs uppercase tracking-wider transition-all"
        >
          <Plus className="h-4.5 w-4.5" /> Add Project
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

      {/* Projects Table */}
      {loading ? (
        <LoadingSpinner />
      ) : projects.length > 0 ? (
        <div className="glass-panel overflow-hidden rounded-lg shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-industrial-charcoal border-b border-industrial-border text-industrial-muted uppercase text-[10px] font-bold tracking-wider">
                  <th className="py-4 px-6">Image</th>
                  <th className="py-4 px-6">Project Title</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Client</th>
                  <th className="py-4 px-6 text-center">Featured</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-industrial-border/30 text-sm">
                {projects.map((project) => {
                  const mainImage = project.images?.[0];
                  const imageUrl = mainImage?.startsWith('/uploads/') ? `http://localhost:5000${mainImage}` : mainImage;
                  return (
                    <tr key={project._id} className="hover:bg-industrial-steel/10 transition-colors">
                      <td className="py-4 px-6">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={project.title}
                            className="h-10 w-16 object-cover rounded border border-industrial-border"
                          />
                        ) : (
                          <div className="h-10 w-16 bg-industrial-steel/20 rounded flex items-center justify-center text-[10px] text-industrial-muted">
                            No Img
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 font-bold text-industrial-light">
                        {project.title}
                      </td>
                      <td className="py-4 px-6">
                        <span className="bg-industrial-steel/60 text-industrial-orange px-2 py-0.5 rounded text-xs border border-industrial-border/60">
                          {project.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-industrial-muted">
                        {project.client || 'N/A'}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {project.featured ? (
                          <Star className="h-5 w-5 text-industrial-orange fill-current mx-auto" />
                        ) : (
                          <span className="text-industrial-muted">&mdash;</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(project)}
                          className="p-2 text-industrial-muted hover:text-industrial-orange border border-industrial-border rounded"
                          title="Edit Project"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(project._id)}
                          className="p-2 text-industrial-muted hover:text-red-400 border border-industrial-border rounded"
                          title="Delete Project"
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
          No projects found. Click "Add Project" to upload your first portfolio item.
        </div>
      )}

      {/* Editor Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-industrial-gray border border-industrial-border rounded-lg shadow-2xl max-w-2xl w-full my-8 max-h-[90vh] flex flex-col">
            {/* Modal Head */}
            <div className="p-6 border-b border-industrial-border flex items-center justify-between">
              <h2 className="font-display font-black text-xl text-industrial-light uppercase">
                {editMode ? 'Edit Project Details' : 'Add New Portfolio Project'}
              </h2>
              <button onClick={() => setIsOpen(false)} className="text-industrial-muted hover:text-industrial-orange p-1">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Form Scroll Area */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-grow text-left">
              {errorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold rounded flex items-center gap-2">
                  <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Title */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-industrial-muted mb-1.5">
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Spiral Staircase Installation"
                    className="w-full bg-industrial-charcoal border border-industrial-border rounded px-3 py-2 text-sm text-industrial-light focus:border-industrial-orange focus:outline-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-industrial-muted mb-1.5">
                    Category Type
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-industrial-charcoal border border-industrial-border rounded px-3 py-2.5 text-sm text-industrial-light focus:outline-none"
                  >
                    <option value="Industrial">Industrial</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Residential">Residential</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>

                {/* Client */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-industrial-muted mb-1.5">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    placeholder="e.g. Vance Construction"
                    className="w-full bg-industrial-charcoal border border-industrial-border rounded px-3 py-2 text-sm text-industrial-light focus:border-industrial-orange focus:outline-none"
                  />
                </div>

                {/* Completed Date */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-industrial-muted mb-1.5">
                    Completion Date
                  </label>
                  <input
                    type="date"
                    value={completedDate}
                    onChange={(e) => setCompletedDate(e.target.value)}
                    className="w-full bg-industrial-charcoal border border-industrial-border rounded px-3 py-2 text-sm text-industrial-light focus:outline-none"
                  />
                </div>

                {/* Featured Checkbox */}
                <div className="flex items-center pt-6">
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="w-4 h-4 bg-industrial-charcoal border border-industrial-border rounded text-industrial-orange focus:ring-0 focus:outline-none"
                    />
                    <span className="text-xs font-bold uppercase tracking-wider text-industrial-muted">
                      Mark as Featured Project
                    </span>
                  </label>
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-industrial-muted mb-1.5">
                    Project Description
                  </label>
                  <textarea
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe details, weight, materials, dimensions, and finishing..."
                    className="w-full bg-industrial-charcoal border border-industrial-border rounded px-3 py-2 text-sm text-industrial-light focus:border-industrial-orange focus:outline-none resize-none"
                  ></textarea>
                </div>

                {/* File Upload Box */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-industrial-muted mb-1.5">
                    Upload Images
                  </label>
                  <div className="relative border border-dashed border-industrial-border rounded p-4 flex flex-col items-center justify-center bg-industrial-charcoal/50">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <FileUp className="h-8 w-8 text-industrial-orange mb-1" />
                    <p className="text-xs text-industrial-light font-bold">
                      {newImageFiles.length > 0
                        ? `${newImageFiles.length} file(s) selected`
                        : 'Select new photos to upload'}
                    </p>
                  </div>
                </div>

                {/* Existing Images Manager */}
                {editMode && existingImages.length > 0 && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-industrial-muted mb-2">
                      Active Images ({existingImages.length})
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {existingImages.map((img, index) => {
                        const imgUrl = img.startsWith('/uploads/') ? `http://localhost:5000${img}` : img;
                        return (
                          <div key={index} className="relative aspect-video rounded border border-industrial-border overflow-hidden group">
                            <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveExistingImage(index)}
                              className="absolute top-1 right-1 bg-red-600/90 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Delete Image"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-industrial-border flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border border-industrial-border rounded text-xs font-bold uppercase text-industrial-muted hover:text-industrial-light hover:bg-industrial-steel/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-industrial-orange hover:bg-industrial-orange-hover text-industrial-charcoal font-black text-xs uppercase tracking-wider rounded disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePortfolio;
