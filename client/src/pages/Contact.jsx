import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Phone, Mail, MapPin, Send, CheckCircle2, Clock, ShieldAlert } from 'lucide-react';
import API from '../api';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
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
      const response = await API.submitContact(data);
      if (response.data && response.data.success) {
        setSubmitSuccess(true);
        reset();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send message. Please try again.';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const contactDetails = [
    {
      icon: <Phone className="h-6 w-6 text-industrial-orange" />,
      title: 'Phone Number',
      value: '+91 63588 90888',
      link: 'tel:+916358890888',
      desc: 'Monday - Saturday, 8 AM - 6 PM IST'
    },
    {
      icon: <Mail className="h-6 w-6 text-industrial-orange" />,
      title: 'Email Address',
      value: 'info@hpyengineering.com',
      link: 'mailto:info@hpyengineering.com',
      desc: 'Request quotes, drawings, and product support'
    },
    {
      icon: <MapPin className="h-6 w-6 text-industrial-orange" />,
      title: 'Office & Shop',
      value: 'GIDC, Gandhinagar – 382021',
      link: 'https://www.google.com/maps?q=GIDC+Gandhinagar&output=embed',
      desc: 'Manufacturing and customer service headquarters'
    }
  ];

  return (
    <div className="pt-20">
      {/* Page Header */}
      <section className="bg-industrial-gray border-b border-industrial-border/60 py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 industrial-grid opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display font-black text-3xl sm:text-5xl text-industrial-light uppercase tracking-tight">
            Contact <span className="text-industrial-orange">Us</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-industrial-muted max-w-2xl mx-auto">
            Get in touch with HPY Engineering. Visit our shop, call our project managers, or send general inquiries below.
          </p>
        </div>
      </section>

      {/* Grid of contact details & form */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Details (Left) */}
          <div className="lg:col-span-1 space-y-8 text-left">
            <h2 className="font-display font-black text-2xl text-industrial-light uppercase tracking-tight mb-6">
              Connect <span className="text-industrial-orange">Directly</span>
            </h2>

            <div className="space-y-6">
              {contactDetails.map((detail, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-lg bg-industrial-gray border border-industrial-border/60 hover:border-industrial-orange/30 transition-all">
                  <div className="p-3 bg-industrial-charcoal border border-industrial-border text-industrial-orange rounded-lg shrink-0 h-fit">
                    {detail.icon}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-base text-industrial-light">{detail.title}</h4>
                    <a href={detail.link} className="block mt-1 font-bold text-sm text-industrial-orange hover:underline">
                      {detail.value}
                    </a>
                    <p className="text-xs text-industrial-muted mt-0.5">{detail.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Hours card */}
            <div className="p-6 rounded-lg border border-industrial-border/60 bg-industrial-gray/40 space-y-4">
              <h3 className="font-display font-extrabold text-sm text-industrial-light flex items-center gap-2 uppercase tracking-wider">
                <Clock className="h-4.5 w-4.5 text-industrial-orange" /> Operational Hours
              </h3>
              <div className="text-xs sm:text-sm text-industrial-muted space-y-2">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>7:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between border-t border-industrial-border/30 pt-2">
                  <span>Saturday</span>
                  <span>8:00 AM - 1:00 PM</span>
                </div>
                <div className="flex justify-between border-t border-industrial-border/30 pt-2">
                  <span>Sunday</span>
                  <span className="text-industrial-orange font-bold uppercase">Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Message Form (Right) */}
          <div className="lg:col-span-2">
            <div className="glass-panel p-6 sm:p-10 rounded-xl shadow-2xl">
              {submitSuccess ? (
                <div className="text-center py-12 space-y-4">
                  <CheckCircle2 className="h-16 w-16 text-industrial-orange mx-auto" />
                  <h2 className="font-display font-black text-2xl text-industrial-light uppercase">
                    Message Dispatched!
                  </h2>
                  <p className="text-sm text-industrial-muted max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out. We have logged your submission in our system. A project supervisor will contact you at your email address shortly.
                  </p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="mt-6 inline-flex px-6 py-2 rounded bg-industrial-orange hover:bg-industrial-orange-hover text-industrial-charcoal font-bold text-xs uppercase tracking-wider"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <h2 className="font-display font-black text-2xl text-industrial-light uppercase tracking-tight text-left">
                    Send a <span className="text-industrial-orange">Message</span>
                  </h2>

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
                        Your Name <span className="text-industrial-orange">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('name')}
                        placeholder="Enter full name"
                        className="w-full bg-industrial-charcoal border border-industrial-border/60 rounded px-4 py-3 text-sm text-industrial-light focus:border-industrial-orange focus:outline-none"
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-red-500 font-semibold">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="text-left">
                      <label className="block text-xs font-bold uppercase tracking-wider text-industrial-muted mb-2">
                        Email Address <span className="text-industrial-orange">*</span>
                      </label>
                      <input
                        type="email"
                        {...register('email')}
                        placeholder="name@example.com"
                        className="w-full bg-industrial-charcoal border border-industrial-border/60 rounded px-4 py-3 text-sm text-industrial-light focus:border-industrial-orange focus:outline-none"
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-500 font-semibold">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="text-left sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-industrial-muted mb-2">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        {...register('phone')}
                        placeholder="e.g. +1 (555) 000-0000 (optional)"
                        className="w-full bg-industrial-charcoal border border-industrial-border/60 rounded px-4 py-3 text-sm text-industrial-light focus:border-industrial-orange focus:outline-none"
                      />
                    </div>

                    {/* Message */}
                    <div className="text-left sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-industrial-muted mb-2">
                        Message Content <span className="text-industrial-orange">*</span>
                      </label>
                      <textarea
                        rows="5"
                        {...register('message')}
                        placeholder="Type details of your inquiry here..."
                        className="w-full bg-industrial-charcoal border border-industrial-border/60 rounded px-4 py-3 text-sm text-industrial-light focus:border-industrial-orange focus:outline-none resize-none"
                      ></textarea>
                      {errors.message && (
                        <p className="mt-1 text-xs text-red-500 font-semibold">{errors.message.message}</p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded bg-industrial-orange hover:bg-industrial-orange-hover text-industrial-charcoal font-black text-sm tracking-wider uppercase transition-all shadow-lg disabled:opacity-50 hover:scale-[1.01]"
                  >
                    {submitting ? 'Transmitting...' : 'Send Message'}
                    {!submitting && <Send className="h-4 w-4" />}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Map Section */}
      <section className="h-[400px] border-t border-industrial-border/60 relative">
        <iframe
          title="HPY Engineering Shop Location Map"
          src="https://www.google.com/maps?q=GIDC+Gandhinagar&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(110%)' }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>
    </div>
  );
};

export default Contact;
