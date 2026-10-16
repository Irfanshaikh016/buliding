'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, HardHat, Mail, Lock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const supabase = createClient();

    if (supabase && isSupabaseConfigured()) {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }

        setSuccessMsg('Authentication successful. Redirecting to dashboard...');
        setTimeout(() => router.push('/dashboard'), 800);
      } catch (err: unknown) {
        setErrorMsg(err instanceof Error ? err.message : 'Login failed');
        setLoading(false);
      }
    } else {
      // Local Viva / Demo Mode login
      setSuccessMsg('Logged in via Local Demonstration Session. Redirecting...');
      setTimeout(() => router.push('/dashboard'), 800);
    }
  };

  const handleQuickDemo = () => {
    setEmail('rajesh.sharma@buildsmart.ai');
    setPassword('demo-construction-2026');
    setSuccessMsg('Demo credentials applied! Logging in...');
    setTimeout(() => router.push('/dashboard'), 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/25">
            <Building2 className="h-5 w-5" />
          </div>
          <span className="text-2xl font-extrabold text-white tracking-tight">
            BuildSmart<span className="text-orange-500">.AI</span>
          </span>
        </Link>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-white">
          Sign in to your Construction Workspace
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Or{' '}
          <Link href="/signup" className="font-semibold text-orange-400 hover:text-orange-300">
            register a new contractor/engineer account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900/90 py-8 px-6 shadow-2xl rounded-2xl border border-slate-800 sm:px-10 backdrop-blur-xl">
          {errorMsg && (
            <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-400">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-400">
              {successMsg}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-medium text-slate-300">Work Email Address</label>
              <div className="mt-1 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="engineer@company.com"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">Security Password</label>
              <div className="mt-1 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-800 text-orange-600 focus:ring-orange-500" />
                Remember this device
              </label>
              <span className="text-slate-500">Supabase RLS Protected</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl shadow-lg shadow-orange-600/30 text-sm font-bold text-white bg-orange-600 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 transition-all"
            >
              {loading ? 'Authenticating...' : 'Sign In to Workspace'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Quick Demo Access for Evaluators */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-orange-400 border border-orange-500/30 hover:border-orange-500/60 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>1-Click Viva / Evaluation Demo Login</span>
            </button>
            <p className="mt-2 text-center text-[11px] text-slate-500">
              Instant access with preloaded civil engineering project records.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
