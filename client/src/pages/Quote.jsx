import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Send, FileUp, CheckCircle2, ShieldAlert } from 'lucide-react';
import API from '../api';
import CustomDropdown from '../components/CustomDropdown';

const quoteSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(7, 'Please provide a valid phone number'),
  company: z.string().optional(),
  projectType: z.string().min(1, 'Please select a fabrication category'),
  description: z.string().min(15, 'Please provide at least 15 characters of project description'),
});

const Quote = () => {
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [productTypeOptions, setProductTypeOptions] = useState([]);

  // Fetch product categories from API on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.getProducts();
        const products = res.data.data || [];
        const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];
        const options = categories.map((cat) => ({ value: cat, label: cat }));
        // Append a generic fallback
        options.push({ value: 'Other Custom Fabrication', label: 'Other Custom Fabrication' });
        setProductTypeOptions(options);
      } catch {
        // Fallback static list if API fails
        setProductTypeOptions([
          { value: 'Stainless Steel Cleanroom Equipment', label: 'Stainless Steel Cleanroom Equipment' },
          { value: 'SS Cabinets & Storage Furniture', label: 'SS Cabinets & Storage Furniture' },
          { value: 'Cleanroom Workstations & Tables', label: 'Cleanroom Workstations & Tables' },
          { value: 'Pharmaceutical Trolleys & Carts', label: 'Pharmaceutical Trolleys & Carts' },
          { value: 'Industrial Weldment Assembly', label: 'Industrial Weldment Assembly' },
          { value: 'Custom Railings & Stairs', label: 'Custom Railings & Stairs' },
          { value: 'Other Custom Fabrication', label: 'Other Custom Fabrication' },
        ]);
      }
    };
    fetchCategories();
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(quoteSchema),
    defaultValues: { projectType: '' },
  });

  const selectedProjectType = watch('projectType');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    setSubmitError(null);

    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));
    if (file) formData.append('file', file);

    try {
      await API.submitQuote(formData);
      setSubmitSuccess(true);
      reset();
      setFile(null);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to submit quote inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* Page Header */}
      <section className="bg-slate-900 border-b border-slate-700 py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 industrial-grid opacity-15"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            Request A <span className="text-sky-400">Quote</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Submit your fabrication specifications and blueprints. Our engineering team will review your drawings and provide a detailed bid.
          </p>
        </div>
      </section>

      {/* Form Container */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {submitSuccess ? (
          <div className="bg-slate-900 border border-sky-400/30 p-8 sm:p-12 rounded-2xl text-center space-y-4 max-w-2xl mx-auto shadow-2xl">
            <CheckCircle2 className="h-16 w-16 text-sky-400 mx-auto" />
            <h2 className="font-display font-black text-2xl text-white">
              Proposal Request Received!
            </h2>
            <p className="text-sm text-slate-200 leading-relaxed">
              Thank you for submitting your specifications. Our estimator and structural drafting team will analyze your requirements and get back to you within 24–48 business hours.
            </p>
            <button
              onClick={() => setSubmitSuccess(false)}
              className="mt-6 inline-flex items-center px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs sm:text-sm tracking-wide transition-all shadow-lg shadow-sky-500/25"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-slate-900 border border-slate-700 p-6 sm:p-10 rounded-2xl space-y-8 shadow-2xl text-left"
          >
            <div className="border-b border-slate-700 pb-4">
              <h2 className="font-display font-black text-xl text-white tracking-tight">
                Project <span className="text-sky-400">Specifications</span>
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Please provide accurate details so we can estimate your project promptly.
              </p>
            </div>

            {submitError && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm font-semibold flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  Contact Name <span className="text-sky-400">*</span>
                </label>
                <input
                  type="text"
                  {...register('name')}
                  placeholder="Enter full name"
                  className="w-full bg-slate-950 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/25 focus:outline-none transition-colors"
                />
                {errors.name && (
                  <p className="mt-1.5 text-xs text-red-400 font-semibold">{errors.name.message}</p>
                )}
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  {...register('company')}
                  placeholder="Enter organization (optional)"
                  className="w-full bg-slate-950 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/25 focus:outline-none transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  Email Address <span className="text-sky-400">*</span>
                </label>
                <input
                  type="email"
                  {...register('email')}
                  placeholder="e.g. name@company.com"
                  className="w-full bg-slate-950 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/25 focus:outline-none transition-colors"
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-400 font-semibold">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  Phone Number <span className="text-sky-400">*</span>
                </label>
                <input
                  type="text"
                  {...register('phone')}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full bg-slate-950 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/25 focus:outline-none transition-colors"
                />
                {errors.phone && (
                  <p className="mt-1.5 text-xs text-red-400 font-semibold">{errors.phone.message}</p>
                )}
              </div>

              {/* Fabrication Type — loaded from product categories */}
              <div className="sm:col-span-2">
                <CustomDropdown
                  id="projectType"
                  label={
                    <span className="text-sm font-bold text-white">
                      Fabrication Type <span className="text-sky-400">*</span>
                    </span>
                  }
                  options={productTypeOptions}
                  value={selectedProjectType}
                  onChange={(val) => setValue('projectType', val, { shouldValidate: true })}
                  placeholder="Select a product category..."
                />
                {errors.projectType && (
                  <p className="mt-1.5 text-xs text-red-400 font-semibold">{errors.projectType.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-white mb-2">
                  Detailed Project Description <span className="text-sky-400">*</span>
                </label>
                <textarea
                  rows="5"
                  {...register('description')}
                  placeholder="Provide dimensions, materials (e.g. SS 304, SS 316, carbon steel, aluminum, grade), load requirements, and surface finish."
                  className="w-full bg-slate-950 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/25 focus:outline-none transition-colors resize-none"
                ></textarea>
                {errors.description && (
                  <p className="mt-1.5 text-xs text-red-400 font-semibold">{errors.description.message}</p>
                )}
              </div>

              {/* File Upload */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-white mb-2">
                  Upload Spec Drawings / CAD Blueprints
                </label>
                <div className="relative border border-dashed border-slate-600 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-950/70 hover:bg-slate-950 hover:border-sky-400 transition-all group cursor-pointer">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.dwg,.png,.jpg,.jpeg"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <FileUp className="h-10 w-10 text-sky-400 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="max-w-full break-all text-center text-sm text-white font-bold">
                    {file ? file.name : 'Select or drag your blueprints file'}
                  </p>
                  <p className="text-xs text-slate-300 mt-1">
                    Accepts PDF, CAD (.dwg), ZIP, Word, or Image files (Max 10MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-sm tracking-wide transition-all shadow-xl shadow-sky-500/25 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01]"
              >
                {submitting ? 'Processing Specs...' : 'Submit Proposal Request'}
                {!submitting && <Send className="h-4 w-4" />}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
};

export default Quote;
