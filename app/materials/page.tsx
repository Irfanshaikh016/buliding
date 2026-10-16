'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import StatusBanner from '@/components/StatusBanner';
import {
  Layers,
  Sparkles,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShieldCheck,
  Building2,
  Filter,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { MaterialRecommendation } from '@/lib/types';
import { COMPREHENSIVE_MATERIALS_DATABASE } from '@/lib/materials-data';

export default function MaterialsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [projectType, setProjectType] = useState<string>('Residential Building');
  const [location, setLocation] = useState<string>('Urban India');
  const [budgetTier, setBudgetTier] = useState<string>('Moderate');
  const [durability, setDurability] = useState<string>('High Durability');
  const [climate, setClimate] = useState<string>('Moderate');

  const [recommendations, setRecommendations] = useState<MaterialRecommendation[]>(COMPREHENSIVE_MATERIALS_DATABASE);
  const [loading, setLoading] = useState(false);
  const [aiDataSource, setAiDataSource] = useState<string>('BuildSmart Standard Civil Database (IS Codes)');
  const [isAiGenerated, setIsAiGenerated] = useState(false);

  const categories = [
    'All',
    'Cement',
    'Steel Reinforcement',
    'Bricks & Blocks',
    'Flooring',
    'Paint',
    'Roofing & Waterproofing',
    'Insulation',
  ];

  const handleRunAiAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/materials/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory === 'All' ? undefined : selectedCategory,
          projectType,
          location,
          budgetTier,
          durabilityPriority: durability,
          climate,
        }),
      });

      const data = await res.json();
      if (data.recommendations && data.recommendations.length > 0) {
        setRecommendations(data.recommendations);
        setAiDataSource(data.source || 'OpenAI Analysis');
        setIsAiGenerated(Boolean(data.isAiGenerated));
      }
    } catch (err) {
      console.error('Failed to fetch AI material recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMaterials = selectedCategory === 'All'
    ? recommendations
    : recommendations.filter(m => m.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Sidebar className="hidden md:flex" />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <StatusBanner />

        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-xl">
                <Layers className="h-5 w-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                AI Construction Material Selector
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Civil engineering material specifications, IS code benchmarks, and comparative durability analysis
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 font-semibold flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-purple-600" />
              <span>IS Standards & OpenAI Engine</span>
            </span>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Query Filter Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <form onSubmit={handleRunAiAnalysis} className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Filter className="h-4 w-4 text-orange-600" />
                  <span>Configure Site & Environmental Parameters</span>
                </span>
                <span className="text-[11px] text-slate-400">Contextual recommendation generator</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Project Classification */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Building Type</label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Residential Villa / G+2">Residential Villa / G+2</option>
                    <option value="Multi-Storey Apartment">Multi-Storey Apartment</option>
                    <option value="Commercial Complex">Commercial Tech Complex</option>
                    <option value="Industrial Warehouse">Industrial PEB Warehouse</option>
                  </select>
                </div>

                {/* Location / Climate */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Climate & Region</label>
                  <select
                    value={climate}
                    onChange={(e) => setClimate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Moderate">Moderate (Bangalore, Pune)</option>
                    <option value="Tropical Coastal (Saline)">Coastal / High Salinity (Mumbai, Chennai)</option>
                    <option value="Hot & Arid (Thermal swings)">Hot & Arid (Delhi NCR, Jaipur)</option>
                    <option value="Heavy Rainfall">Heavy Monsoon (Kochi, Goa, Assam)</option>
                  </select>
                </div>

                {/* Budget Suitability */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Budget Target</label>
                  <select
                    value={budgetTier}
                    onChange={(e) => setBudgetTier(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Economy">Economy (Cost-optimized)</option>
                    <option value="Moderate">Moderate (Value for money)</option>
                    <option value="Premium">Premium (Long design life)</option>
                    <option value="Luxury">Luxury (Highest Grade)</option>
                  </select>
                </div>

                {/* Durability Priority */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Durability Priority</label>
                  <select
                    value={durability}
                    onChange={(e) => setDurability(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Standard">Standard Civil Code</option>
                    <option value="High Durability">High Seismic & Thermal Performance</option>
                    <option value="Maximum Longevity">Maximum Longevity (50+ Years)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <p className="text-[11px] text-slate-400">
                  Active Intelligence: <strong className="text-slate-700">{aiDataSource}</strong>
                </p>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md shadow-orange-600/20 disabled:opacity-50 transition-all hover:scale-105"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{loading ? 'Evaluating Materials...' : 'Run AI Recommendation'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Material Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredMaterials.map((mat) => (
              <div
                key={mat.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Category & Standard Code */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                      {mat.category}
                    </span>
                    {mat.standard_spec && (
                      <span className="text-[10px] font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {mat.standard_spec}
                      </span>
                    )}
                  </div>

                  {/* Material Name */}
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {mat.material_type}
                  </h3>

                  {/* Technical Reasons */}
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {mat.reasons}
                  </p>

                  {/* Pros & Cons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {/* Advantages */}
                    <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-[11px]">
                      <span className="font-bold text-emerald-800 flex items-center gap-1 mb-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        Advantages
                      </span>
                      <ul className="space-y-1 text-slate-600">
                        {mat.advantages.map((adv, idx) => (
                          <li key={idx} className="leading-snug">• {adv}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Limitations */}
                    <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 text-[11px]">
                      <span className="font-bold text-rose-800 flex items-center gap-1 mb-1">
                        <XCircle className="h-3.5 w-3.5 text-rose-600" />
                        Limitations
                      </span>
                      <ul className="space-y-1 text-slate-600">
                        {mat.disadvantages.map((dis, idx) => (
                          <li key={idx} className="leading-snug">• {dis}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Important Considerations */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] mb-3">
                    <strong className="text-slate-800 block mb-0.5">Execution & Curing Guidelines:</strong>
                    <span className="text-slate-600">{mat.important_considerations}</span>
                  </div>
                </div>

                {/* Footer notes */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Budget: <strong className="text-slate-700">{mat.budget_suitability}</strong></span>
                  {mat.supplier_notes && (
                    <span className="truncate max-w-[220px]" title={mat.supplier_notes}>
                      Suppliers: {mat.supplier_notes}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredMaterials.length === 0 && (
            <div className="py-16 text-center bg-white rounded-2xl border border-slate-200">
              <Layers className="h-10 w-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">No materials match this category</p>
              <p className="text-xs text-slate-500 mt-1">Select &apos;All&apos; or run the AI recommendation generator above.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
