import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Send, FileUp, CheckCircle2, ShieldAlert } from 'lucide-react';
import API from '../api';

// Zod schema for client-side form validation
const quoteSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  company: z.string().optional(),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(6, 'Please enter a valid phone number'),
  projectType: z.string().min(1, 'Please select a project category'),
  description: z.string().min(10, 'Please describe your project (minimum 10 characters)'),
  budgetRange: z.string().min(1, 'Please select a budget range'),
  timeline: z.string().min(1, 'Please select a timeline'),
});

const Quote = () => {
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      projectType: '',
      budgetRange: '',
      timeline: '',
    }
  });

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    setSubmitError(null);

    const formData = new FormData();
    
    // Append standard fields
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    // Append drawing file if selected
    if (file) {
      formData.append('file', file);
    }

    try {
      const response = await API.submitQuote(formData);
      if (response.data && response.data.success) {
        setSubmitSuccess(true);
        reset();
        setFile(null);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit quote request. Please try again.';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const projectTypes = [
    'Structural Steel Framing',
    'CNC Laser & Plasma Cutting',
    'Industrial Weldment Assembly',
    'Custom Railings & Stairs',
    'Prototype / Sheet Metal Shaping',
    'Other Custom Fabrication'
  ];

  return (
    <div className="pt-20">
      {/* Page Header */}
      <section className="bg-industrial-gray border-b border-industrial-border/60 py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 industrial-grid opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display font-black text-3xl sm:text-5xl text-industrial-light uppercase tracking-tight">
            Request a <span className="text-industrial-orange">Quote</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-industrial-muted max-w-2xl mx-auto">
            Submit your fabrication specifications, budget, and blueprints. Our engineering team will review your drawings and provide a structural bid.
          </p>
        </div>
      </section>

      {/* Form Container */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {submitSuccess ? (
          <div className="glass-panel border border-industrial-orange/30 p-8 rounded-xl text-center space-y-4 max-w-2xl mx-auto shadow-2xl animate-pulse-glow">
            <CheckCircle2 className="h-16 w-16 text-industrial-orange mx-auto" />
            <h2 className="font-display font-black text-2xl text-industrial-light uppercase">
              Proposal Request Received!
            </h2>
            <p className="text-sm text-industrial-muted leading-relaxed">
              Thank you for submitting your specifications. Our estimator and structural drafting team will analyze your requirements and get back to you with a detailed estimate within 24-48 business hours.
            </p>
            <button
              onClick={() => setSubmitSuccess(false)}
              className="mt-6 inline-flex items-center px-6 py-2.5 rounded bg-industrial-orange hover:bg-industrial-orange-hover text-industrial-charcoal font-bold text-xs uppercase tracking-wider transition-all"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="glass-panel p-6 sm:p-10 rounded-xl space-y-8 shadow-2xl">
            {submitError && (
              <div className="p-4 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-xs sm:text-sm font-semibold flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Name */}
              <div className="text-left">
                <label className="block text-xs font-bold uppercase tracking-wider text-industrial-muted mb-2">
                  Contact Name <span className="text-industrial-orange">*</span>
                </label>
                <input
                  type="text"
                  {...register('name')}
                  placeholder="Enter full name"
                  className="w-full bg-industrial-charcoal border border-industrial-border/60 rounded px-4 py-3 text-sm text-industrial-light placeholder-industrial-muted/50 focus:border-industrial-orange focus:outline-none transition-colors"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500 font-semibold">{errors.name.message}</p>
                )}
              </div>

              {/* Company */}
              <div className="text-left">
                <label className="block text-xs font-bold uppercase tracking-wider text-industrial-muted mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  {...register('company')}
                  placeholder="Enter organization (optional)"
                  className="w-full bg-industrial-charcoal border border-industrial-border/60 rounded px-4 py-3 text-sm text-industrial-light placeholder-industrial-muted/50 focus:border-industrial-orange focus:outline-none transition-colors"
                />
              </div>

              {/* Email */}
              <div className="text-left">
                <label className="block text-xs font-bold uppercase tracking-wider text-industrial-muted mb-2">
                  Email Address <span className="text-industrial-orange">*</span>
                </label>
                <input
                  type="email"
                  {...register('email')}
                  placeholder="e.g. name@company.com"
                  className="w-full bg-industrial-charcoal border border-industrial-border/60 rounded px-4 py-3 text-sm text-industrial-light placeholder-industrial-muted/50 focus:border-industrial-orange focus:outline-none transition-colors"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500 font-semibold">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div className="text-left">
                <label className="block text-xs font-bold uppercase tracking-wider text-industrial-muted mb-2">
                  Phone Number <span className="text-industrial-orange">*</span>
                </label>
                <input
                  type="text"
                  {...register('phone')}
                  placeholder="e.g. +1 (555) 123-4567"
                  className="w-full bg-industrial-charcoal border border-industrial-border/60 rounded px-4 py-3 text-sm text-industrial-light placeholder-industrial-muted/50 focus:border-industrial-orange focus:outline-none transition-colors"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-500 font-semibold">{errors.phone.message}</p>
                )}
              </div>

              {/* Project Type */}
              <div className="text-left">
                <label className="block text-xs font-bold uppercase tracking-wider text-industrial-muted mb-2">
                  Fabrication Type <span className="text-industrial-orange">*</span>
                </label>
                <select
                  {...register('projectType')}
                  className="w-full bg-industrial-charcoal border border-industrial-border/60 rounded px-4 py-3 text-sm text-industrial-light focus:border-industrial-orange focus:outline-none transition-colors"
                >
                  <option value="">Select a category...</option>
                  {projectTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.projectType && (
                  <p className="mt-1 text-xs text-red-500 font-semibold">{errors.projectType.message}</p>
                )}
              </div>

              {/* Timeline */}
              <div className="text-left">
                <label className="block text-xs font-bold uppercase tracking-wider text-industrial-muted mb-2">
                  Expected Timeline <span className="text-industrial-orange">*</span>
                </label>
                <select
                  {...register('timeline')}
                  className="w-full bg-industrial-charcoal border border-industrial-border/60 rounded px-4 py-3 text-sm text-industrial-light focus:border-industrial-orange focus:outline-none transition-colors"
                >
                  <option value="">Select speed option...</option>
                  <option value="Urgent (< 2 weeks)">Urgent (&lt; 2 weeks)</option>
                  <option value="Standard (2-6 weeks)">Standard (2-6 weeks)</option>
                  <option value="Flexible (6+ weeks)">Flexible (6+ weeks)</option>
                  <option value="Design/Planning Phase Only">Planning Phase Only</option>
                </select>
                {errors.timeline && (
                  <p className="mt-1 text-xs text-red-500 font-semibold">{errors.timeline.message}</p>
                )}
              </div>

              {/* Budget Range */}
              <div className="text-left sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-industrial-muted mb-2">
                  Estimated Project Budget <span className="text-industrial-orange">*</span>
                </label>
                <select
                  {...register('budgetRange')}
                  className="w-full bg-industrial-charcoal border border-industrial-border/60 rounded px-4 py-3 text-sm text-industrial-light focus:border-industrial-orange focus:outline-none transition-colors"
                >
                  <option value="">Select a price range...</option>
                  <option value="Under $5,000">Under $5,000</option>
                  <option value="$5,000 - $25,000">$5,000 - $25,000</option>
                  <option value="$25,000 - $100,000">$25,000 - $100,000</option>
                  <option value="$100,000 - $500,000">$100,000 - $500,000</option>
                  <option value="Over $500,000">Over $500,000</option>
                </select>
                {errors.budgetRange && (
                  <p className="mt-1 text-xs text-red-500 font-semibold">{errors.budgetRange.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="text-left sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-industrial-muted mb-2">
                  Detailed Project Description <span className="text-industrial-orange">*</span>
                </label>
                <textarea
                  rows="5"
                  {...register('description')}
                  placeholder="Provide dimensions, materials (e.g. carbon steel, aluminum, grade), load requirements, and painting specifications."
                  className="w-full bg-industrial-charcoal border border-industrial-border/60 rounded px-4 py-3 text-sm text-industrial-light placeholder-industrial-muted/50 focus:border-industrial-orange focus:outline-none transition-colors resize-none"
                ></textarea>
                {errors.description && (
                  <p className="mt-1 text-xs text-red-500 font-semibold">{errors.description.message}</p>
                )}
              </div>

              {/* File Upload */}
              <div className="text-left sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-industrial-muted mb-2">
                  Upload Spec Drawings / CAD Blueprints
                </label>
                <div className="relative border border-dashed border-industrial-border/80 rounded-lg p-6 flex flex-col items-center justify-center bg-industrial-charcoal/50 hover:bg-industrial-charcoal transition-all">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.dwg,.png,.jpg,.jpeg"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <FileUp className="h-10 w-10 text-industrial-orange mb-2" />
                  <p className="text-sm text-industrial-light font-semibold">
                    {file ? file.name : 'Select or drag your blueprints file'}
                  </p>
                  <p className="text-[11px] text-industrial-muted mt-1">
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
                className="w-full flex items-center justify-center gap-2 py-4 rounded-md bg-industrial-orange hover:bg-industrial-orange-hover text-industrial-charcoal font-black text-sm tracking-wider uppercase transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01]"
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
