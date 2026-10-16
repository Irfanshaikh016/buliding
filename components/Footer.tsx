import React from 'react';
import Link from 'next/link';
import { Building2, Shield, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-12 text-slate-600 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 text-white font-bold">
                <Building2 className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">
                BuildSmart<span className="text-orange-500">.AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              AI-Based Building Construction Management Platform. Empowering civil engineers, project managers, and property developers with deterministic estimates and AI insights.
            </p>
          </div>

          {/* Core Tools */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Core Modules</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/estimator" className="hover:text-orange-600 transition-colors">Cost Estimator (Deterministic)</Link></li>
              <li><Link href="/materials" className="hover:text-orange-600 transition-colors">AI Material Recommendations</Link></li>
              <li><Link href="/schedule" className="hover:text-orange-600 transition-colors">CPM Construction Scheduler</Link></li>
              <li><Link href="/progress" className="hover:text-orange-600 transition-colors">Task Tracker & Kanban</Link></li>
            </ul>
          </div>

          {/* AI & Reporting */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">AI & Analytics</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/assistant" className="hover:text-orange-600 transition-colors">BuildSmart AI Assistant</Link></li>
              <li><Link href="/reports" className="hover:text-orange-600 transition-colors">Executive Project Audit Reports</Link></li>
              <li><Link href="/dashboard" className="hover:text-orange-600 transition-colors">Executive KPI Dashboard</Link></li>
              <li><Link href="/settings" className="hover:text-orange-600 transition-colors">Supabase RLS & Database Status</Link></li>
            </ul>
          </div>

          {/* Technical Compliance & Viva */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Compliance & Stack</h4>
            <div className="space-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                <Shield className="h-3.5 w-3.5 text-emerald-600" />
                <span>Next.js 14 App Router + TypeScript</span>
              </div>
              <p>Supabase PostgreSQL with RLS, OpenAI API, Recharts, and Tailwind CSS.</p>
              <p className="text-[11px] font-mono text-orange-700 bg-orange-50 p-2 rounded-lg border border-orange-200">
                Preliminary estimates are indicative for planning. Final works require licensed structural engineer approval.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} BuildSmart AI. College Mini-Project & Production Ready Demonstration.</p>
          <p className="flex items-center gap-1">
            Engineered for Civil Engineering & Construction Management Viva
          </p>
        </div>
      </div>
    </footer>
  );
}
