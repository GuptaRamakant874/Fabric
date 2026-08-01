const defaultEmail = 'admin@fabsteel.com';
const defaultPass = 'admin123';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Hammer, Lock, Mail, ShieldAlert, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // If already logged in, skip login page
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    setErrorMessage(null);
    try {
      await login(data.email, data.password);
      navigate('/admin/dashboard');
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-industrial-charcoal flex items-center justify-center px-4 relative overflow-hidden pt-12">
      {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 industrial-grid opacity-20 pointer-events-none"></div>

      <div className="max-w-md w-full z-10 space-y-8">
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex bg-industrial-orange text-industrial-charcoal p-3 rounded-xl mb-3 shadow-lg">
            <Hammer className="h-8 w-8" />
          </div>
          <h2 className="font-display font-black text-2xl tracking-wider text-industrial-light uppercase">
            VANCE METAL PORTAL
          </h2>
          <p className="text-xs text-industrial-muted uppercase tracking-widest mt-1">
            Administrative Access
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-panel p-8 rounded-xl shadow-2xl space-y-6">
          <h3 className="font-display font-bold text-lg text-industrial-light text-left">
            Sign In to Dashboard
          </h3>

          {errorMessage && (
            <div className="p-3.5 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick seeded instructions helper */}
          <div className="p-3 bg-industrial-steel/40 border border-industrial-border/60 rounded text-[11px] text-industrial-muted space-y-1 text-left">
            <p className="font-bold text-industrial-orange">Demo Credentials:</p>
            <p>Email: <span className="font-mono text-industrial-light">{defaultEmail}</span></p>
            <p>Password: <span className="font-mono text-industrial-light">{defaultPass}</span></p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email field */}
            <div className="text-left">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-industrial-muted mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  {...register('email')}
                  placeholder="admin@fabsteel.com"
                  className="w-full bg-industrial-charcoal border border-industrial-border/60 rounded pl-10 pr-4 py-2.5 text-sm text-industrial-light focus:border-industrial-orange focus:outline-none"
                />
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-industrial-muted" />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500 font-semibold">{errors.email.message}</p>
              )}
            </div>

            {/* Password field */}
            <div className="text-left">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-industrial-muted mb-1.5">
                Secret Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  {...register('password')}
                  placeholder="••••••••"
                  className="w-full bg-industrial-charcoal border border-industrial-border/60 rounded pl-10 pr-4 py-2.5 text-sm text-industrial-light focus:border-industrial-orange focus:outline-none"
                />
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-industrial-muted" />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500 font-semibold">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded bg-industrial-orange hover:bg-industrial-orange-hover text-industrial-charcoal font-black text-xs uppercase tracking-wider transition-all disabled:opacity-50 hover:scale-[1.01]"
            >
              {submitting ? 'Verifying...' : 'Authorize Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
