'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Building2,
  Calculator,
  Layers,
  CalendarClock,
  CheckSquare,
  Bot,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  TrendingUp,
  HardHat,
  Compass,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { calculateConstructionEstimate } from '@/lib/estimator-engine';

export default function LandingPage() {
  // Quick interactive cost estimator preview right on hero
  const [previewArea, setPreviewArea] = useState(2500);
  const [previewCity, setPreviewCity] = useState('Bengaluru');
  const [previewFinish, setPreviewFinish] = useState<'Standard' | 'Premium'>('Standard');

  const previewEstimate = calculateConstructionEstimate({
    project_type: 'residential',
    location: previewCity,
    built_up_area: previewArea,
    floors: 2,
    finish_level: previewFinish,
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-orange-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-[#0A1020] text-white pt-20 pb-28">
        {/* Construction Grid Background Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b20_1px,transparent_1px),linear-gradient(to_bottom,#1e293b20_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-4 py-1.5 text-xs font-semibold text-orange-400 border border-orange-500/20 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Next-Generation Civil Construction Management SaaS</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Build Smarter with <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">Deterministic Math</span> & Construction AI
            </h1>

            <p className="text-base sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
              Eliminate budget overruns, material wastage, and project delays. Calculate itemised civil estimates in INR, generate automated schedules, and manage construction tasks with AI precision.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-7 py-3.5 text-base font-bold text-white shadow-xl shadow-orange-600/30 hover:bg-orange-500 hover:scale-105 transition-all"
              >
                <HardHat className="h-5 w-5" />
                <span>Launch Construction Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/estimator"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800/90 px-7 py-3.5 text-base font-semibold text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all"
              >
                <Calculator className="h-5 w-5 text-orange-400" />
                <span>Interactive Cost Estimator</span>
              </Link>
            </div>
          </div>

          {/* Interactive Calculator Quick Widget */}
          <div className="mt-16 max-w-4xl mx-auto bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <span className="text-xs font-semibold text-orange-400 tracking-wider uppercase">Live Interactive Benchmark</span>
                <h3 className="text-xl font-bold text-white">Instant Construction Cost Estimator</h3>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Deterministic Total (INR)</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-orange-400">{formatINR(previewEstimate.estimated_total)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
              {/* Area Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium text-slate-300">
                  <span>Built-up Area</span>
                  <span className="text-orange-400 font-bold">{previewArea.toLocaleString('en-IN')} sq.ft</span>
                </div>
                <input
                  type="range"
                  min="600"
                  max="12000"
                  step="100"
                  value={previewArea}
                  onChange={(e) => setPreviewArea(Number(e.target.value))}
                  className="w-full accent-orange-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* City Selector */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">Location Index</label>
                <select
                  value={previewCity}
                  onChange={(e) => setPreviewCity(e.target.value)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="Bengaluru">Bengaluru (Tier 1 Metro)</option>
                  <option value="Mumbai">Mumbai (Tier 1 Metro)</option>
                  <option value="Delhi">Delhi NCR (Tier 1 Metro)</option>
                  <option value="Pune">Pune (Tier 2 Urban)</option>
                  <option value="Ahmedabad">Ahmedabad (Tier 2 Urban)</option>
                  <option value="Bhopal">Bhopal (Tier 3 Regional)</option>
                </select>
              </div>

              {/* Finish Level */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">Finish Specification</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewFinish('Standard')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                      previewFinish === 'Standard'
                        ? 'bg-orange-600 border-orange-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Standard
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewFinish('Premium')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                      previewFinish === 'Premium'
                        ? 'bg-orange-600 border-orange-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Premium
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-4">
              <div className="flex items-center gap-4">
                <span>Unit Rate: <strong className="text-white">₹{previewEstimate.base_rate}/sq.ft</strong></span>
                <span>Includes: <strong>RCC, Masonry, MEP & Finishes</strong></span>
              </div>
              <Link
                href={`/estimator?area=${previewArea}&location=${previewCity}&finish=${previewFinish}`}
                className="inline-flex items-center gap-1.5 text-orange-400 font-semibold hover:text-orange-300"
              >
                <span>View Full Itemised Breakdown</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Benchmarks Bar */}
      <section className="border-y border-slate-200 bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">100%</p>
              <p className="text-xs font-medium text-slate-500 uppercase mt-1">Deterministic Cost Math</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-orange-600">IS 456 & 1786</p>
              <p className="text-xs font-medium text-slate-500 uppercase mt-1">Indian Standards Compliant</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">PostgreSQL</p>
              <p className="text-xs font-medium text-slate-500 uppercase mt-1">Supabase Row Level Security</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-orange-600">GPT-4o Mini</p>
              <p className="text-xs font-medium text-slate-500 uppercase mt-1">OpenAI Assistant & Materials</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">Complete SaaS Architecture</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
              Engineered Specifically for Building Construction
            </h2>
            <p className="text-base text-slate-600 mt-3">
              Replace fragmented spreadsheets and guesswork with an integrated platform built on civil engineering principles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm hover:shadow-md transition-shadow group">
              <div className="h-12 w-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Calculator className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Deterministic Cost Estimator</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Calculates sub-structure, RCC frame, masonry, MEP, flooring, and finishes using verified civil engineering formulas. Never hallucinates prices.
              </p>
              <Link href="/estimator" className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 mt-4 group-hover:translate-x-1 transition-transform">
                Explore Estimator <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm hover:shadow-md transition-shadow group">
              <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">AI Material Recommender</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Comprehensive comparison for cement grades (PPC vs OPC 53), ductile rebar (Fe 500D vs CRS), AAC blocks, and waterproofing membranes.
              </p>
              <Link href="/materials" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 mt-4 group-hover:translate-x-1 transition-transform">
                Browse Materials <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm hover:shadow-md transition-shadow group">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <CalendarClock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Construction Schedule Generator</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Auto-generates phase breakdown from site excavation to handover. Calculates critical path durations based on built-up area and floor counts.
              </p>
              <Link href="/schedule" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 mt-4 group-hover:translate-x-1 transition-transform">
                Generate Schedule <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm hover:shadow-md transition-shadow group">
              <div className="h-12 w-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <CheckSquare className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Task Tracker & Kanban</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Track Pending, In Progress, and Completed milestones. Automatically aggregates real project progress percentages from verified task data.
              </p>
              <Link href="/progress" className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 mt-4 group-hover:translate-x-1 transition-transform">
                Manage Tasks <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm hover:shadow-md transition-shadow group">
              <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">BuildSmart AI Assistant</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Interactive chatbot trained on civil engineering safety, curing standards, soil SBC, and tender analysis. Ingests your active project context.
              </p>
              <Link href="/assistant" className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 mt-4 group-hover:translate-x-1 transition-transform">
                Chat with Assistant <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm hover:shadow-md transition-shadow group">
              <div className="h-12 w-12 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Executive Reports & PDF</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Generate print-ready client audit summaries. Integrates budget variance, schedule critical milestones, and risk mitigation matrices.
              </p>
              <Link href="/reports" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 mt-4 group-hover:translate-x-1 transition-transform">
                View Reports <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">Why BuildSmart AI</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              Traditional Spreadsheets vs BuildSmart AI Platform
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6 font-semibold">Capability</th>
                  <th className="py-4 px-6 font-semibold text-slate-400">Traditional Methods / Excel</th>
                  <th className="py-4 px-6 font-semibold text-orange-400">BuildSmart AI Platform</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                <tr>
                  <td className="py-4 px-6 font-semibold text-slate-900">Cost Calculation</td>
                  <td className="py-4 px-6 text-slate-500">Prone to broken formulas and outdated lump-sum guesses</td>
                  <td className="py-4 px-6 text-emerald-600 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    Deterministic multi-tiered civil breakdown
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-slate-900">Schedule Management</td>
                  <td className="py-4 px-6 text-slate-500">Manual static gantt charts requiring frequent updates</td>
                  <td className="py-4 px-6 text-emerald-600 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    Automated CPM phases scaled by area and floors
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-slate-900">Material Recommendations</td>
                  <td className="py-4 px-6 text-slate-500">Vendor bias, speculative prices, informal advice</td>
                  <td className="py-4 px-6 text-emerald-600 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    IS code specifications + OpenAI intelligence
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-slate-900">Security & Isolation</td>
                  <td className="py-4 px-6 text-slate-500">Files emailed or shared insecurely on drives</td>
                  <td className="py-4 px-6 text-emerald-600 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    Supabase Row Level Security (RLS) authentication
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="bg-slate-950 py-16 text-white text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to streamline your construction projects?
          </h2>
          <p className="text-slate-400 text-base max-w-2xl mx-auto">
            Experience complete deterministic cost analysis, automated CPM schedules, and AI-driven civil engineering insights today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-8 py-3.5 text-base font-bold text-white shadow-xl hover:bg-orange-500 transition-all"
            >
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
