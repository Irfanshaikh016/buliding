'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import StatusBanner from '@/components/StatusBanner';
import {
  FolderKanban,
  Search,
  Filter,
  PlusCircle,
  Building2,
  Calendar,
  IndianRupee,
  MapPin,
  Trash2,
  ExternalLink,
  SlidersHorizontal,
  Layers,
  ArrowUpDown,
  AlertTriangle,
} from 'lucide-react';
import { Project } from '@/lib/types';
import { getProjects, deleteProject } from '@/lib/data-store';
import { formatCompactINR, formatINR, formatDate, getStatusBadgeClass } from '@/lib/utils';

export default function ProjectsListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'created_at' | 'budget' | 'name'>('created_at');
  const [deleteCandidate, setDeleteCandidate] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    setLoading(true);
    const data = await getProjects();
    setProjects(data);
    setLoading(false);
  }

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    await deleteProject(deleteCandidate.id);
    setDeleteCandidate(null);
    await loadProjects();
  };

  // Filter & Search Logic
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'all' || p.project_type === typeFilter;
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'budget') return Number(b.budget) - Number(a.budget);
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Sidebar className="hidden md:flex" />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <StatusBanner />

        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                <FolderKanban className="h-5 w-5" />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Construction Projects Directory
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Manage all residential, commercial, industrial builds and associated estimates
            </p>
          </div>

          <Link
            href="/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold shadow-md shadow-orange-600/20 transition-all hover:scale-105"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Create New Project</span>
          </Link>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Search & Filter Controls */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects, location, keywords..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Type Filter */}
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <Filter className="h-3.5 w-3.5 text-slate-400" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-orange-500"
                >
                  <option value="all">All Types</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                  <option value="infrastructure">Infrastructure</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-orange-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>

              {/* Sort Order */}
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'created_at' | 'budget' | 'name')}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-orange-500"
                >
                  <option value="created_at">Latest Created</option>
                  <option value="budget">Highest Budget</option>
                  <option value="name">Alphabetical</option>
                </select>
              </div>
            </div>
          </div>

          {/* Projects Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-6">
                  {/* Status & Type Bar */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {project.project_type}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusBadgeClass(project.status)}`}>
                      {project.status}
                    </span>
                  </div>

                  {/* Project Name */}
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                    <Link href={`/projects/${project.id}`}>
                      {project.name}
                    </Link>
                  </h3>

                  {/* Location */}
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 line-clamp-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>{project.location}</span>
                  </p>

                  {/* Description */}
                  {project.description && (
                    <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  )}

                  {/* Quick Specs Grid */}
                  <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Approved Budget</span>
                      <p className="font-extrabold text-slate-900">{formatCompactINR(Number(project.budget))}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Built-up Area</span>
                      <p className="font-bold text-slate-700">{project.built_up_area.toLocaleString('en-IN')} sq.ft ({project.floors} flr)</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Finish Grade</span>
                      <p className="font-semibold text-slate-700">{project.finish_level}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Target Delivery</span>
                      <p className="font-semibold text-slate-700">{formatDate(project.expected_completion_date)}</p>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => setDeleteCandidate(project)}
                    className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete project"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <Link
                    href={`/projects/${project.id}`}
                    className="inline-flex items-center gap-1 font-bold text-orange-600 hover:text-orange-700"
                  >
                    <span>View Workspace</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && !loading && (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No projects match criteria</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Try adjusting your search keywords, clear active filters, or create a new project.
              </p>
              <Link
                href="/projects/new"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-500 shadow-md"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Create New Project</span>
              </Link>
            </div>
          )}
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2.5 rounded-xl bg-red-100">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Confirm Project Deletion</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-slate-900">&quot;{deleteCandidate.name}&quot;</strong>? This action will remove all linked tasks, schedules, and cost estimates.
            </p>
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/20"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
