'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import StatusBanner from '@/components/StatusBanner';
import {
  Building2,
  ArrowLeft,
  Calendar,
  IndianRupee,
  MapPin,
  Layers,
  Save,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { projectSchema, ProjectFormData } from '@/lib/validations';
import { saveProject } from '@/lib/data-store';
import { ProjectType, FinishLevel, ProjectStatus } from '@/lib/types';

export default function NewProjectPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<ProjectFormData>>({
    name: '',
    project_type: 'residential',
    location: '',
    built_up_area: 2500,
    floors: 2,
    budget: 5000000, // ₹ 50 Lakhs
    start_date: new Date().toISOString().split('T')[0],
    expected_completion_date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    finish_level: 'Standard',
    description: '',
    status: 'Planning',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'built_up_area' || name === 'floors' || name === 'budget' ? Number(value) : value,
    }));
    // Clear error for field
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      const validated = projectSchema.parse(formData);
      const created = await saveProject({
        user_id: 'usr_demo_buildsmart_01',
        name: validated.name,
        project_type: validated.project_type as ProjectType,
        location: validated.location,
        built_up_area: validated.built_up_area,
        floors: validated.floors,
        budget: validated.budget,
        start_date: validated.start_date,
        expected_completion_date: validated.expected_completion_date,
        finish_level: validated.finish_level as FinishLevel,
        description: validated.description,
        status: validated.status as ProjectStatus,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push(`/projects/${created.id}`);
      }, 700);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'errors' in err) {
        const zodErrors = (err as { errors: { path: (string | number)[]; message: string }[] }).errors;
        const mapped: Record<string, string> = {};
        zodErrors.forEach(zErr => {
          if (zErr.path[0]) mapped[zErr.path[0].toString()] = zErr.message;
        });
        setErrors(mapped);
      }
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Sidebar className="hidden md:flex" />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <StatusBanner />

        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/projects"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Create New Construction Project
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Set baseline scope, built-up specifications, and budget in INR
              </p>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">
          {success && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 flex items-center gap-2 text-sm font-semibold">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>Project created successfully! Redirecting to workspace...</span>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section 1: Core Details */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">
                  1. Project Identity & Location
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Project Title / Building Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name || ''}
                      onChange={handleChange}
                      placeholder="e.g. Royal Crest Residency (G+3)"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        errors.name ? 'border-red-500 bg-red-50/30' : 'border-slate-200 bg-slate-50/50'
                      }`}
                    />
                    {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Project Classification *
                    </label>
                    <select
                      name="project_type"
                      value={formData.project_type}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="residential">Residential (Apartments, Villas, Row Houses)</option>
                      <option value="commercial">Commercial (Office Spaces, Retail, Tech Parks)</option>
                      <option value="industrial">Industrial (Warehouses, PEB Structures)</option>
                      <option value="infrastructure">Infrastructure (Roads, Utilities, Drainage)</option>
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Location / City *
                    </label>
                    <div className="relative">
                      <MapPin className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        name="location"
                        required
                        value={formData.location || ''}
                        onChange={handleChange}
                        placeholder="e.g. Whitefield, Bengaluru"
                        className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                          errors.location ? 'border-red-500 bg-red-50/30' : 'border-slate-200 bg-slate-50/50'
                        }`}
                      />
                    </div>
                    {errors.location && <p className="text-xs text-red-600 mt-1">{errors.location}</p>}
                  </div>
                </div>
              </div>

              {/* Section 2: Civil Dimensions & Budget */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">
                  2. Architectural Dimensions & Budget
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Built-up area */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Built-Up Area (sq.ft) *
                    </label>
                    <input
                      type="number"
                      name="built_up_area"
                      min={100}
                      required
                      value={formData.built_up_area || ''}
                      onChange={handleChange}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        errors.built_up_area ? 'border-red-500 bg-red-50/30' : 'border-slate-200 bg-slate-50/50'
                      }`}
                    />
                    {errors.built_up_area && <p className="text-xs text-red-600 mt-1">{errors.built_up_area}</p>}
                  </div>

                  {/* Floors */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Number of Floors *
                    </label>
                    <input
                      type="number"
                      name="floors"
                      min={1}
                      max={100}
                      required
                      value={formData.floors || 1}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {errors.floors && <p className="text-xs text-red-600 mt-1">{errors.floors}</p>}
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Approved Budget (INR ₹) *
                    </label>
                    <div className="relative">
                      <IndianRupee className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="number"
                        name="budget"
                        min={10000}
                        required
                        value={formData.budget || ''}
                        onChange={handleChange}
                        className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                          errors.budget ? 'border-red-500 bg-red-50/30' : 'border-slate-200 bg-slate-50/50'
                        }`}
                      />
                    </div>
                    {errors.budget && <p className="text-xs text-red-600 mt-1">{errors.budget}</p>}
                  </div>
                </div>
              </div>

              {/* Section 3: Timeline & Finish Level */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">
                  3. Timeline, Finish Grade & Status
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Start Date */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Groundbreaking / Start Date *
                    </label>
                    <input
                      type="date"
                      name="start_date"
                      required
                      value={formData.start_date || ''}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {errors.start_date && <p className="text-xs text-red-600 mt-1">{errors.start_date}</p>}
                  </div>

                  {/* Completion Date */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Expected Handover Date *
                    </label>
                    <input
                      type="date"
                      name="expected_completion_date"
                      required
                      value={formData.expected_completion_date || ''}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {errors.expected_completion_date && <p className="text-xs text-red-600 mt-1">{errors.expected_completion_date}</p>}
                  </div>

                  {/* Finish Level */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Specification & Finish Level *
                    </label>
                    <select
                      name="finish_level"
                      value={formData.finish_level}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="Economy">Economy (Standard AAC, 2x2 vitrified, basic emulsion)</option>
                      <option value="Standard">Standard (Premium Vitrified, Asian Paints Apex, Jaquar)</option>
                      <option value="Premium">Premium (Granite touches, UPVC windows, Kohler fittings)</option>
                      <option value="Luxury">Luxury (Imported Marble, Home Automation, Concealed HVAC)</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Initial Project Status *
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="Planning">Planning</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="On Hold">On Hold</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Scope Summary / Engineering Notes
                    </label>
                    <textarea
                      name="description"
                      rows={3}
                      value={formData.description || ''}
                      onChange={handleChange}
                      placeholder="Outline key structural requirements, soil conditions, rainwater harvesting, or contractor notes..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <Link
                  href="/projects"
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold shadow-lg shadow-orange-600/30 disabled:opacity-50 transition-all hover:scale-[1.02]"
                >
                  <Save className="h-4 w-4" />
                  <span>{submitting ? 'Saving Project...' : 'Save & Initialize Project'}</span>
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
