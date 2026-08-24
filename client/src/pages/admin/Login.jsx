const defaultEmail = 'admin@fabsteel.com';
const defaultPass = 'admin123';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Hammer, Lock, Mail, ShieldAlert } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden text-slate-100">
      {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 industrial-grid opacity-20 pointer-events-none"></div>

      <div className="max-w-md w-full z-10 space-y-8 py-12">
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex bg-sky-500 text-slate-950 p-3.5 rounded-2xl mb-3 shadow-xl shadow-sky-500/25">
            <Hammer className="h-8 w-8" />
          </div>
          <h2 className="font-display font-black text-2xl tracking-wide text-white">
            HPY Engineering Portal
          </h2>
          <p className="text-xs text-sky-400 font-bold tracking-wider mt-1">
            Administrative Control Panel
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6 text-left">
          <h3 className="font-display font-bold text-lg text-white">
            Sign In To Dashboard
          </h3>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick seeded instructions helper */}
          {/* <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-1.5">
            <p className="font-bold text-sky-400">Demo Credentials:</p>
            <p>Email: <span className="font-mono text-white font-semibold">{defaultEmail}</span></p>
            <p>Password: <span className="font-mono text-white font-semibold">{defaultPass}</span></p>
          </div> */}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email field */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  {...register('email')}
                  placeholder="admin@fabsteel.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/25 focus:outline-none transition-colors"
                />
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-400 font-semibold">{errors.email.message}</p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5">
                Secret Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  {...register('password')}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/25 focus:outline-none transition-colors"
                />
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-400 font-semibold">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs tracking-wide transition-all shadow-xl shadow-sky-500/25 disabled:opacity-50 hover:scale-[1.01]"
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
