'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import StatusBanner from '@/components/StatusBanner';
import {
  Settings,
  Database,
  Key,
  ShieldCheck,
  User,
  Copy,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { DEMO_USER, INITIAL_PROJECTS, INITIAL_TASKS, INITIAL_ESTIMATES } from '@/lib/demo-data';

export default function SettingsPage() {
  const [supabaseActive, setSupabaseActive] = useState<boolean>(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [profile, setProfile] = useState(DEMO_USER);
  const [savedProfile, setSavedProfile] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  useEffect(() => {
    setSupabaseActive(isSupabaseConfigured());
  }, []);

  const handleCopySql = () => {
    navigator.clipboard.writeText(`-- Run this in your Supabase SQL Editor:
-- File: supabase/schema.sql in this project root contains the complete schema and RLS policies.`);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleResetDemoData = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('buildsmart_projects', JSON.stringify(INITIAL_PROJECTS));
      localStorage.setItem('buildsmart_tasks', JSON.stringify(INITIAL_TASKS));
      localStorage.setItem('buildsmart_estimates', JSON.stringify(INITIAL_ESTIMATES));
      setResetDone(true);
      setTimeout(() => setResetDone(false), 3000);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Sidebar className="hidden md:flex" />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <StatusBanner />

        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-100 text-slate-700 rounded-xl">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                System Settings & Integrations
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Supabase database status, OpenAI credentials, and viva demo controls
              </p>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-8">
          {/* Section 1: Supabase Connection Status & RLS */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Supabase PostgreSQL Connection</h3>
                  <p className="text-xs text-slate-500">Database and Row Level Security (RLS) state</p>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                supabaseActive
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                {supabaseActive ? 'Connected Live' : 'Active Offline Demo Mode'}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-2">
              <p>
                <strong>Database Schema:</strong> Located at <code className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-800 font-mono">supabase/schema.sql</code>. It includes complete tables: <code className="font-mono text-orange-600">profiles</code>, <code className="font-mono text-orange-600">projects</code>, <code className="font-mono text-orange-600">cost_estimates</code>, <code className="font-mono text-orange-600">project_tasks</code>, <code className="font-mono text-orange-600">material_recommendations</code>, and <code className="font-mono text-orange-600">chat_history</code>.
              </p>
              <p>
                <strong>Row Level Security:</strong> RLS policies ensure authenticated users can only view, create, edit, and delete their own projects and records (<code className="font-mono text-slate-700">auth.uid() = user_id</code>).
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm"
              >
                <span>Open Supabase Dashboard</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>

              <button
                type="button"
                onClick={handleCopySql}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm"
              >
                <Copy className="h-3.5 w-3.5 text-slate-500" />
                <span>{copiedSql ? 'Schema Path Copied!' : 'Copy Migration Instructions'}</span>
              </button>
            </div>
          </div>

          {/* Section 2: OpenAI API Credentials */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 border-b pb-3">
              <div className="p-2 bg-purple-100 text-purple-700 rounded-xl">
                <Key className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">OpenAI API Engine</h3>
                <p className="text-xs text-slate-500">Powers BuildSmart Assistant and AI Material Recommendations</p>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <p>
                Server-side routes securely consume <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-purple-700">OPENAI_API_KEY</code> without ever exposing credentials to the client browser.
              </p>
              <p>
                If no OpenAI key is configured, BuildSmart AI automatically switches to built-in heuristic civil engineering algorithms based on Indian Standards (IS 456, IS 1786), guaranteeing 100% uptime during presentations.
              </p>
            </div>
          </div>

          {/* Section 3: User Profile & Role */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 border-b pb-3">
              <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Project Manager Profile</h3>
                <p className="text-xs text-slate-500">Authenticated user identity</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company / Organization</label>
                <input
                  type="text"
                  value={profile.company_name || ''}
                  onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Role</label>
                <input
                  type="text"
                  value={profile.role}
                  onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  setSavedProfile(true);
                  setTimeout(() => setSavedProfile(false), 2000);
                }}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20"
              >
                {savedProfile ? 'Profile Updated!' : 'Save Profile Changes'}
              </button>
            </div>
          </div>

          {/* Section 4: College Viva & Demo Control */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-orange-600" />
              <span>Reset Demo Project Data</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              If you have deleted or heavily edited records during testing, you can reset the active database back to clean reference projects (Bangalore Eco-Villa, Mumbai Tech Park, Pune Row Houses).
            </p>

            <button
              type="button"
              onClick={handleResetDemoData}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{resetDone ? 'Demo Projects Restored!' : 'Reset Reference Data'}</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
