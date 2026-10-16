'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import StatusBanner from '@/components/StatusBanner';
import {
  Calculator,
  Building2,
  MapPin,
  Layers,
  IndianRupee,
  Printer,
  Download,
  Save,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { Project, CostEstimate, ProjectType, FinishLevel } from '@/lib/types';
import { calculateConstructionEstimate } from '@/lib/estimator-engine';
import { getProjects, saveEstimate } from '@/lib/data-store';
import { formatINR, formatCompactINR } from '@/lib/utils';
import { BudgetDistributionChart } from '@/components/Charts';

function CostEstimatorContent() {
  const searchParams = useSearchParams();

  // Inputs
  const [projectType, setProjectType] = useState<ProjectType>('residential');
  const [location, setLocation] = useState('Bengaluru');
  const [builtUpArea, setBuiltUpArea] = useState<number>(3000);
  const [floors, setFloors] = useState<number>(2);
  const [finishLevel, setFinishLevel] = useState<FinishLevel>('Standard');
  const [budget, setBudget] = useState<number>(6000000);
  const [customRate, setCustomRate] = useState<string>('');

  // Projects list for saving
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync with URL params if passed from project page
  useEffect(() => {
    const pType = searchParams.get('type') as ProjectType;
    const loc = searchParams.get('location');
    const area = searchParams.get('area');
    const flrs = searchParams.get('floors');
    const finish = searchParams.get('finish') as FinishLevel;
    const projId = searchParams.get('projectId');

    if (pType) setProjectType(pType);
    if (loc) setLocation(loc);
    if (area) setBuiltUpArea(Number(area));
    if (flrs) setFloors(Number(flrs));
    if (finish) setFinishLevel(finish);
    if (projId) setSelectedProjectId(projId);

    getProjects().then((data) => {
      setProjects(data);
      if (projId) setSelectedProjectId(projId);
      else if (data.length > 0) setSelectedProjectId(data[0].id);
    });
  }, [searchParams]);

  // Compute estimate deterministically via calculation engine
  const parsedCustomRate = customRate.trim() ? Number(customRate) : undefined;
  const estimate: CostEstimate = calculateConstructionEstimate({
    project_type: projectType,
    location,
    built_up_area: builtUpArea > 0 ? builtUpArea : 1000,
    floors: floors > 0 ? floors : 1,
    finish_level: finishLevel,
    budget: budget > 0 ? budget : undefined,
    custom_rate_per_sqft: parsedCustomRate,
  });

  const chartData = estimate.breakdown.map((item) => ({
    name: item.name,
    value: item.amount,
  }));

  const handleSaveToProject = async () => {
    if (!selectedProjectId) return;
    setIsSaving(true);
    await saveEstimate({
      ...estimate,
      project_id: selectedProjectId,
    });
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Sidebar className="hidden md:flex no-print" />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="no-print">
          <StatusBanner />
        </div>

        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-5 flex flex-wrap items-center justify-between gap-4 no-print">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                <Calculator className="h-5 w-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Deterministic Cost Estimator
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Deterministic civil rate engine with itemised Bill of Quantities (BOQ) in INR
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-sm transition-colors"
            >
              <Printer className="h-4 w-4 text-slate-500" />
              <span>Print / Export PDF</span>
            </button>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Form and Preview Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 5 Cols: Input Controls */}
            <div className="lg:col-span-5 space-y-6 no-print">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b pb-2">
                  Building Dimensions & Parameters
                </h3>

                {/* Project Classification */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Building Classification
                  </label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value as ProjectType)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="residential">Residential (Villas, Apartments, Flats)</option>
                    <option value="commercial">Commercial (Office, IT Park, Retail)</option>
                    <option value="industrial">Industrial (Warehouses, PEB Workshops)</option>
                    <option value="infrastructure">Infrastructure & Utilities</option>
                  </select>
                </div>

                {/* City Location */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Location Index (City / Region)
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Bengaluru">Bengaluru (Tier 1 Metro)</option>
                    <option value="Mumbai">Mumbai (Tier 1 Metro)</option>
                    <option value="Delhi">Delhi NCR / Gurugram (Tier 1 Metro)</option>
                    <option value="Hyderabad">Hyderabad (Tier 1 Metro)</option>
                    <option value="Chennai">Chennai (Tier 1 Metro)</option>
                    <option value="Pune">Pune (Tier 2 Urban)</option>
                    <option value="Ahmedabad">Ahmedabad (Tier 2 Urban)</option>
                    <option value="Lucknow">Lucknow (Tier 2 Urban)</option>
                    <option value="Jaipur">Jaipur (Tier 2 Urban)</option>
                    <option value="Kochi">Kochi (Tier 2 Urban)</option>
                    <option value="Regional / Tier 3">Tier 3 / Regional Urban Area</option>
                  </select>
                </div>

                {/* Built-up area slider & input */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-700">Built-Up Area</label>
                    <span className="text-xs font-bold text-orange-600">{builtUpArea.toLocaleString('en-IN')} sq.ft</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="30000"
                    step="100"
                    value={builtUpArea}
                    onChange={(e) => setBuiltUpArea(Number(e.target.value))}
                    className="w-full accent-orange-500 h-2 bg-slate-100 rounded-lg cursor-pointer"
                  />
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="number"
                      min="100"
                      value={builtUpArea}
                      onChange={(e) => setBuiltUpArea(Number(e.target.value))}
                      className="w-32 px-2.5 py-1 text-xs border border-slate-200 rounded-lg"
                    />
                    <span className="text-[11px] text-slate-400">sq.ft gross slab footprint</span>
                  </div>
                </div>

                {/* Floors */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Number of Floors (G + {floors - 1})
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={floors}
                    onChange={(e) => setFloors(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Multi-storey staging and crane pumping index auto-applies above 2 floors.
                  </p>
                </div>

                {/* Finish Level */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Finish Specification Tier
                  </label>
                  <select
                    value={finishLevel}
                    onChange={(e) => setFinishLevel(e.target.value as FinishLevel)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Economy">Economy (Standard AAC, 2x2 vitrified, basic fittings)</option>
                    <option value="Standard">Standard (Premium Vitrified, Apex paint, Jaquar basic)</option>
                    <option value="Premium">Premium (Granite touches, UPVC windows, Kohler)</option>
                    <option value="Luxury">Luxury (Imported Italian Marble, Automation, Concealed HVAC)</option>
                  </select>
                </div>

                {/* Custom Rate Override */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Optional Custom Rate Override (₹ / sq.ft)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 2100 (Leave blank for benchmark rate)"
                    value={customRate}
                    onChange={(e) => setCustomRate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    {customRate ? 'Using user-configured rate.' : 'Using deterministic multi-variable Indian benchmark.'}
                  </p>
                </div>
              </div>

              {/* Save To Project Card */}
              {projects.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <h4 className="text-xs font-bold text-slate-900 uppercase">Save Estimate to Project</h4>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.location})
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={handleSaveToProject}
                    disabled={isSaving}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 disabled:opacity-50 transition-all"
                  >
                    <Save className="h-4 w-4" />
                    <span>{isSaving ? 'Saving...' : 'Attach Estimate to Project'}</span>
                  </button>

                  {savedSuccess && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>Estimate successfully attached to project record!</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right 7 Cols: Output Bill of Quantities (BOQ) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Grand Total Card */}
              <div className="bg-gradient-to-tr from-slate-950 via-slate-900 to-[#141C33] rounded-2xl border border-slate-800 p-6 sm:p-8 text-white shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
                  <div>
                    <span className="text-[10px] font-bold text-orange-400 tracking-wider uppercase">
                      Preliminary Bill of Quantities (BOQ)
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                      {formatINR(estimate.estimated_total)}
                    </h2>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Effective Unit Rate</p>
                    <p className="text-xl font-bold text-orange-400">₹{estimate.base_rate} / sq.ft</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 text-xs">
                  <div>
                    <span className="text-slate-400">Total Built-Up Area</span>
                    <p className="font-bold text-white mt-0.5">{estimate.built_up_area.toLocaleString('en-IN')} sq.ft</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Vertical Floors</span>
                    <p className="font-bold text-white mt-0.5">{estimate.floors} Storey (G+{estimate.floors - 1})</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Specification</span>
                    <p className="font-bold text-white mt-0.5">{estimate.finish_level}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Calculation Source</span>
                    <p className="font-bold text-orange-400 mt-0.5 capitalize">
                      {estimate.assumptions.rateSource.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Itemised Breakdown Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Itemised Component Allocation
                  </h3>
                  <span className="text-xs font-semibold text-slate-500">9 Core Civil Phases</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Work Package</th>
                        <th className="py-3 px-4">Allocation</th>
                        <th className="py-3 px-4">Rate / sq.ft</th>
                        <th className="py-3 px-4 text-right">Subtotal (INR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {estimate.breakdown.map((item, index) => (
                        <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-900 block">{item.name}</span>
                            <span className="text-[10px] text-slate-400">{item.description}</span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-orange-600">{item.percentage}%</td>
                          <td className="py-3 px-4 font-mono text-slate-700">₹{item.ratePerSqFt}</td>
                          <td className="py-3 px-4 text-right font-extrabold text-slate-900">{formatINR(item.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50/80 font-bold text-slate-900 border-t border-slate-200">
                      <tr>
                        <td className="py-3.5 px-4" colSpan={3}>Aggregate Estimated Construction Cost</td>
                        <td className="py-3.5 px-4 text-right text-sm text-orange-600">{formatINR(estimate.estimated_total)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Chart Breakdown */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm no-print">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
                  Component Allocation Visualisation
                </h4>
                <BudgetDistributionChart data={chartData} />
              </div>

              {/* Engineering Assumptions & Notice */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-950">
                  <Info className="h-4 w-4 text-amber-600" />
                  <span>Engineering Methodology & Professional Disclaimer</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 text-[11px] leading-relaxed">
                  {estimate.assumptions.notes.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function CostEstimatorPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-sm text-slate-500">Loading Cost Estimator...</div>}>
      <CostEstimatorContent />
    </Suspense>
  );
}
