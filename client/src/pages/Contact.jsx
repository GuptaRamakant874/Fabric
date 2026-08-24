import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, ShieldAlert } from 'lucide-react';
import API from '../api';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

const Contact = () => {
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await API.submitContact(data);
      setSubmitSuccess(true);
      reset();
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to dispatch message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const contactDetails = [
    {
      icon: <Phone className="h-6 w-6 text-sky-400" />,
      title: 'Phone Consultation',
      value: '+91 63588 90888',
      action: 'tel:+916358890888',
      desc: 'Mon - Sat from 9:00 AM to 7:00 PM IST',
    },
    {
      icon: <Mail className="h-6 w-6 text-sky-400" />,
      title: 'Email Address',
      value: 'dg614768@gmail.com',
      action: 'mailto:dg614768@gmail.com',
      desc: 'Send drawings or inquiries anytime',
    },
    {
      icon: <MapPin className="h-6 w-6 text-sky-400" />,
      title: 'Plant Location',
      value: 'Ahmedabad, Gujarat, India',
      action: 'https://maps.google.com/?q=Ahmedabad,Gujarat',
      desc: 'Central manufacturing & fabrication unit',
    },
  ];

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* Header */}
      <section className="bg-slate-900 border-b border-slate-800 py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 industrial-grid opacity-15"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            Contact <span className="text-sky-400">Us</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Have questions about custom cleanroom furniture or industrial steel fabrication? Reach out to our technical team today.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-left">
          {/* Left Column: Direct Contacts */}
          <div className="space-y-8">
            <div>
              <h2 className="font-display font-black text-2xl text-white tracking-tight mb-6">
                Connect <span className="text-sky-400">Directly</span>
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {contactDetails.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.action}
                    target={item.action.startsWith('http') ? '_blank' : '_self'}
                    rel="noreferrer"
                    className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-start gap-4 hover:border-sky-500/40 transition-all group shadow-xl"
                  >
                    <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl group-hover:scale-105 transition-transform">
                      {item.icon}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-display font-bold text-sm text-white">
                        {item.title}
                      </h3>
                      <p className="text-sm font-bold text-sky-400">
                        {item.value}
                      </p>
                      <p className="text-xs text-slate-400">
                        {item.desc}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Operating Hours Card */}
            <div className="bg-slate-900/70 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
              <h3 className="font-display font-extrabold text-sm text-white flex items-center gap-2 tracking-wide">
                <Clock className="h-4 w-4 text-sky-400" /> Operational Hours
              </h3>
              <div className="space-y-2 text-xs sm:text-sm text-slate-300">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span>Monday – Friday:</span>
                  <span className="text-white font-bold">9:00 AM – 7:00 PM IST</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span>Saturday:</span>
                  <span className="text-white font-bold">9:00 AM – 5:00 PM IST</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday & Public Holidays:</span>
                  <span className="text-sky-400 font-bold">Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-md p-6 sm:p-10 rounded-2xl shadow-2xl space-y-6">
            {submitSuccess ? (
              <div className="text-center py-12 space-y-4 animate-pulse-glow">
                <CheckCircle2 className="h-16 w-16 text-sky-400 mx-auto" />
                <h2 className="font-display font-black text-2xl text-white">
                  Message Dispatched!
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                  Thank you for reaching out. A fabrication specialist will review your inquiry and follow up shortly.
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="mt-6 inline-flex px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-sky-500/25 transition-all"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <h2 className="font-display font-black text-2xl text-white tracking-tight">
                    Send Us A <span className="text-sky-400">Message</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Fill out the form below and we will respond promptly within 24 business hours.
                  </p>
                </div>

                {submitError && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-2">
                    Your Full Name <span className="text-sky-400">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('name')}
                    placeholder="Enter your name"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/25 focus:outline-none transition-colors"
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-xs text-red-400 font-semibold">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-2">
                    Email Address <span className="text-sky-400">*</span>
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="e.g. name@company.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/25 focus:outline-none transition-colors"
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-400 font-semibold">{errors.email.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="text"
                    {...register('phone')}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/25 focus:outline-none transition-colors"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-2">
                    Your Detailed Message <span className="text-sky-400">*</span>
                  </label>
                  <textarea
                    rows="4"
                    {...register('message')}
                    placeholder="Tell us about your project requirements, quantities, or requested specifications..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/25 focus:outline-none transition-colors resize-none"
                  ></textarea>
                  {errors.message && (
                    <p className="mt-1.5 text-xs text-red-400 font-semibold">{errors.message.message}</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs sm:text-sm tracking-wide transition-all shadow-xl shadow-sky-500/25 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01]"
                >
                  {submitting ? 'Sending Message...' : 'Send Message Now'}
                  {!submitting && <Send className="h-4 w-4" />}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Embedded Map Container */}
        <div className="mt-16 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-2">
          <iframe
            title="HPY Engineering Facility Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117502.87102604675!2d72.48834419999999!3d23.022505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fcedd11614f6516!2sAhmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            width="100%"
            height="360"
            style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-xl w-full"
          ></iframe>
        </div>
      </section>
    </div>
  );
};

export default Contact;
