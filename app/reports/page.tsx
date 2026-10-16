'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import StatusBanner from '@/components/StatusBanner';
import {
  FileText,
  Printer,
  Download,
  Building2,
  Calendar,
  IndianRupee,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { Project, ProjectTask, CostEstimate } from '@/lib/types';
import {
  getProjects,
  getTasks,
  getEstimates,
  calculateProjectProgressFromTasks,
} from '@/lib/data-store';
import { formatINR, formatCompactINR, formatDate, getStatusBadgeClass } from '@/lib/utils';
import { COMPREHENSIVE_MATERIALS_DATABASE } from '@/lib/materials-data';

function ReportsContent() {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [estimate, setEstimate] = useState<CostEstimate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const pList = await getProjects();
      setProjects(pList);

      const targetId = searchParams.get('project') || (pList.length > 0 ? pList[0].id : '');
      setSelectedProjectId(targetId);

      if (targetId) {
        await loadProjectReport(targetId, pList);
      }
      setLoading(false);
    }
    loadData();
  }, [searchParams]);

  const loadProjectReport = async (projId: string, currentProjects = projects) => {
    const proj = currentProjects.find((p) => p.id === projId) || null;
    setSelectedProject(proj);
    if (proj) {
      const [tList, eList] = await Promise.all([getTasks(proj.id), getEstimates(proj.id)]);
      setTasks(tList);
      setEstimate(eList.length > 0 ? eList[0] : null);
    }
  };

  const handleProjectSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    setSelectedProjectId(newId);
    loadProjectReport(newId);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const progressPercent = calculateProjectProgressFromTasks(tasks);
  const pendingTasks = tasks.filter((t) => t.status !== 'Completed');
  const completedTasks = tasks.filter((t) => t.status === 'Completed');

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Sidebar className="hidden md:flex no-print" />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="no-print">
          <StatusBanner />
        </div>

        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-5 flex flex-wrap items-center justify-between gap-4 no-print">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-slate-900 text-white rounded-xl">
                <FileText className="h-5 w-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Executive Construction Project Audit Report
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Comprehensive client-ready audit report with BOQ breakdowns, schedule milestones, and verified specs
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Project Picker */}
            <select
              value={selectedProjectId}
              onChange={handleProjectSelect}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md shadow-orange-600/20 transition-all hover:scale-105"
            >
              <Printer className="h-4 w-4" />
              <span>Print / Export PDF</span>
            </button>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-8">
          {selectedProject ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-12 space-y-10 print:border-none print:shadow-none print:p-0">
              {/* Document Header */}
              <div className="border-b-2 border-slate-900 pb-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-orange-600 font-extrabold text-lg">
                    <Building2 className="h-6 w-6" />
                    <span>BuildSmart AI Systems</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                    Project Audit & Status Dossier
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Document Ref: BSA-{selectedProject.id.toUpperCase().substring(0, 10)} • Date:{' '}
                    {formatDate(new Date().toISOString())}
                  </p>
                </div>

                <div className="text-right text-xs space-y-1">
                  <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${getStatusBadgeClass(selectedProject.status)}`}>
                    Status: {selectedProject.status}
                  </span>
                  <p className="text-slate-500 mt-2">Certified for Engineering Planning Review</p>
                </div>
              </div>

              {/* 1. Project Specifications */}
              <section className="space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b pb-1 text-orange-600">
                  1. Project Identification & Scope
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Project Name</span>
                    <strong className="text-slate-900 text-sm">{selectedProject.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Classification</span>
                    <strong className="text-slate-900 text-sm capitalize">{selectedProject.project_type}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Location</span>
                    <strong className="text-slate-900 text-sm">{selectedProject.location}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Approved Budget</span>
                    <strong className="text-slate-900 text-sm">{formatINR(Number(selectedProject.budget))}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Gross Built-Up Area</span>
                    <strong className="text-slate-900 text-sm">{selectedProject.built_up_area.toLocaleString('en-IN')} sq.ft</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Vertical Floors</span>
                    <strong className="text-slate-900 text-sm">{selectedProject.floors} Storey (G+{selectedProject.floors - 1})</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Start Date</span>
                    <strong className="text-slate-900 text-sm">{formatDate(selectedProject.start_date)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Target Delivery</span>
                    <strong className="text-slate-900 text-sm">{formatDate(selectedProject.expected_completion_date)}</strong>
                  </div>
                </div>

                {selectedProject.description && (
                  <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 leading-relaxed border border-slate-100 mt-2">
                    <strong className="text-slate-900 block mb-1">Executive Scope Description:</strong>
                    {selectedProject.description}
                  </div>
                )}
              </section>

              {/* 2. Cost Analysis & Breakdown */}
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b pb-1">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-orange-600">
                    2. Bill of Quantities (BOQ) & Cost Analysis
                  </h3>
                  <span className="text-[10px] font-semibold text-slate-500">
                    Source: {estimate ? 'Deterministic Calculation' : 'Allocated Benchmarks'}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200">
                    <thead className="bg-slate-100 text-slate-800 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3 border-b">Civil Package</th>
                        <th className="py-2.5 px-3 border-b">Allocation %</th>
                        <th className="py-2.5 px-3 border-b">Rate / sq.ft</th>
                        <th className="py-2.5 px-3 border-b text-right">Amount (INR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(estimate ? estimate.breakdown : []).map((b, idx) => (
                        <tr key={idx}>
                          <td className="py-2 px-3 font-semibold text-slate-800">{b.name}</td>
                          <td className="py-2 px-3 text-slate-600">{b.percentage}%</td>
                          <td className="py-2 px-3 font-mono text-slate-700">₹{b.ratePerSqFt}</td>
                          <td className="py-2 px-3 text-right font-bold text-slate-900">{formatINR(b.amount)}</td>
                        </tr>
                      ))}
                      {!estimate && (
                        <tr>
                          <td colSpan={4} className="py-4 text-center text-slate-400">
                            Approved Budget: {formatINR(Number(selectedProject.budget))} (~₹
                            {Math.round(Number(selectedProject.budget) / selectedProject.built_up_area)}/sq.ft)
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                      <tr>
                        <td colSpan={3} className="py-2.5 px-3">Total Estimated Civil Outlay</td>
                        <td className="py-2.5 px-3 text-right text-orange-600">
                          {formatINR(estimate ? estimate.estimated_total : Number(selectedProject.budget))}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </section>

              {/* 3. Progress & Task Status */}
              <section className="space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b pb-1 text-orange-600">
                  3. Construction Milestones & Task Progress Summary
                </h3>

                <div className="flex items-center gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400">Aggregate Progress:</span>
                    <strong className="text-base text-orange-600 ml-2">{progressPercent}% Completed</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Verified Completed:</span>
                    <strong className="text-slate-800 ml-1">{completedTasks.length} Deliverables</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">In Pipeline:</span>
                    <strong className="text-slate-800 ml-1">{pendingTasks.length} Deliverables</strong>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-800">Key Deliverables:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {tasks.slice(0, 6).map((t) => (
                      <div key={t.id} className="p-2.5 rounded-lg border border-slate-100 bg-white flex justify-between items-center">
                        <span className="font-medium text-slate-800 line-clamp-1">{t.title}</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${getStatusBadgeClass(t.status)}`}>
                          {t.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* 4. Verified Materials & Standards */}
              <section className="space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b pb-1 text-orange-600">
                  4. Recommended Material Specifications (Indian Standards)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-900 block">Cement Specification</span>
                    <p className="text-[11px] text-slate-600 mt-1">
                      PPC (IS 1489 Part 1) for slab & foundation masonry; OPC 53 (IS 269) for high-strength columns.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-900 block">Structural Rebar</span>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Fe 500D High Ductility (IS 1786) with min 16% elongation for seismic vibration dissipation.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-900 block">Masonry Units</span>
                    <p className="text-[11px] text-slate-600 mt-1">
                      AAC Lightweight Blocks (IS 2185 Part 3) with thin-bed polymer adhesive to minimize dead load.
                    </p>
                  </div>
                </div>
              </section>

              {/* 5. Risks, Limitations & Certification */}
              <section className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <AlertTriangle className="h-4 w-4 text-amber-700" />
                  <span>Technical Risks, Contingency & Engineering Verification Notice</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-900">
                  This report has been compiled deterministically via the BuildSmart AI construction platform based on user-provided built-up parameters and Indian market benchmarks. Figures stated are preliminary for budgetary allocation. Soil borehole safe bearing capacity (SBC) investigation and signed structural CAD drawings are legally required before commencing foundation excavation.
                </p>
              </section>

              {/* Signatures Footer */}
              <div className="pt-8 border-t border-slate-200 flex justify-between items-end text-xs text-slate-500">
                <div>
                  <p className="font-semibold text-slate-800">Generated by BuildSmart AI</p>
                  <p>Certified Project Management Suite</p>
                </div>
                <div className="text-right">
                  <div className="w-48 border-b border-slate-400 mb-1"></div>
                  <p className="font-semibold text-slate-800">Er. Rajesh Sharma</p>
                  <p>Lead Civil Construction Manager</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center bg-white rounded-2xl border border-slate-200">
              <FileText className="h-10 w-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">No project selected. Select a project to compile report.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-sm text-slate-500">Loading Project Report...</div>}>
      <ReportsContent />
    </Suspense>
  );
}
