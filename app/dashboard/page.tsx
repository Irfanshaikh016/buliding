'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import StatusBanner from '@/components/StatusBanner';
import {
  BudgetDistributionChart,
  ConstructionProgressChart,
  ProjectBudgetComparisonBar,
} from '@/components/Charts';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  IndianRupee,
  TrendingUp,
  PlusCircle,
  ArrowRight,
  Calculator,
  CalendarClock,
  Layers,
  Bot,
  AlertTriangle,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Project, ProjectTask } from '@/lib/types';
import { getProjects, getTasks, calculateProjectProgressFromTasks } from '@/lib/data-store';
import { formatCompactINR, formatINR, formatDate, getStatusBadgeClass, getPriorityBadgeClass } from '@/lib/utils';

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [pList, tList] = await Promise.all([getProjects(), getTasks()]);
        setProjects(pList);
        setTasks(tList);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute Dashboard Metrics dynamically
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'In Progress').length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const totalBudget = projects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0);

  // Calculate real average progress from tasks
  const avgCompletion = projects.length > 0
    ? Math.round(
        projects.reduce((acc, p) => {
          const pTasks = tasks.filter(t => t.project_id === p.id);
          const prog = pTasks.length > 0 ? calculateProjectProgressFromTasks(pTasks) : (p.status === 'Completed' ? 100 : 25);
          return acc + prog;
        }, 0) / projects.length
      )
    : 0;

  // Chart 1: Budget Distribution across Categories (aggregate of standard allocations)
  const budgetDistributionData = [
    { name: 'RCC Superstructure (24%)', value: Math.round(totalBudget * 0.24) },
    { name: 'Substructure & Plinth (13%)', value: Math.round(totalBudget * 0.13) },
    { name: 'Masonry & Plaster (13%)', value: Math.round(totalBudget * 0.13) },
    { name: 'Finishing & Tiles (11%)', value: Math.round(totalBudget * 0.11) },
    { name: 'Electrical Works (9%)', value: Math.round(totalBudget * 0.09) },
    { name: 'Plumbing Works (8%)', value: Math.round(totalBudget * 0.08) },
    { name: 'Contingency & Approvals (7%)', value: Math.round(totalBudget * 0.07) },
  ];

  // Chart 2: Construction Progress timeline curves (Months)
  const progressTimelineData = [
    { name: 'Month 1', planned: 12, actual: 15 },
    { name: 'Month 2', planned: 28, actual: 30 },
    { name: 'Month 3', planned: 45, actual: 42 },
    { name: 'Month 4', planned: 65, actual: 60 },
    { name: 'Month 5', planned: 82, actual: 78 },
    { name: 'Month 6', planned: 100, actual: avgCompletion },
  ];

  // Chart 3: Project budget comparison
  const projectComparisonData = projects.slice(0, 5).map(p => ({
    name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
    budget: Number(p.budget),
  }));

  // Upcoming Pending Tasks
  const upcomingTasks = tasks
    .filter(t => t.status !== 'Completed')
    .slice(0, 5);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden md:flex" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <StatusBanner />

        {/* Dashboard Topbar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Executive Construction Dashboard
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time civil portfolio analytics, budget distribution, and task tracking
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/estimator"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              <Calculator className="h-4 w-4 text-orange-600" />
              <span>Cost Estimator</span>
            </Link>
            <Link
              href="/projects/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md shadow-orange-600/20 transition-all hover:scale-105"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add New Project</span>
            </Link>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* KPI Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Total Projects */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Projects</span>
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <FolderKanban className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalProjects}</p>
              <p className="text-[11px] text-slate-400 mt-1">Managed under RLS</p>
            </div>

            {/* Active Projects */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Active On-Site</span>
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <Clock className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-600">{activeProjects}</p>
              <p className="text-[11px] text-slate-400 mt-1">Currently in execution</p>
            </div>

            {/* Completed */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Completed</span>
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">{completedProjects}</p>
              <p className="text-[11px] text-slate-400 mt-1">Handed over to clients</p>
            </div>

            {/* Total Budget */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Portfolio Budget</span>
                <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
                  <IndianRupee className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{formatCompactINR(totalBudget)}</p>
              <p className="text-[11px] text-slate-400 mt-1">{formatINR(totalBudget)}</p>
            </div>

            {/* Average Completion */}
            <div className="col-span-2 lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Avg Completion</span>
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-purple-600">{avgCompletion}%</p>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: `${avgCompletion}%` }} />
              </div>
            </div>
          </div>

          {/* Quick Getting Started Tour for New Users */}
          {totalProjects === 0 && !loading && (
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-amber-200" />
                <h3 className="text-lg font-bold">Welcome to BuildSmart AI!</h3>
              </div>
              <p className="text-sm text-orange-100 max-w-2xl mb-4">
                You haven&apos;t added any projects yet. Start by generating a deterministic cost estimate or create your first construction project to unlock automated Gantt scheduling and task progress tracking.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/projects/new"
                  className="px-4 py-2 bg-white text-orange-700 font-bold rounded-xl text-xs hover:bg-orange-50 shadow-sm"
                >
                  Create First Project
                </Link>
                <Link
                  href="/estimator"
                  className="px-4 py-2 bg-orange-700 text-white font-semibold rounded-xl text-xs hover:bg-orange-800"
                >
                  Launch Cost Estimator
                </Link>
              </div>
            </div>
          )}

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Budget Distribution */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Civil Budget Distribution</h3>
                  <p className="text-xs text-slate-500">Component allocation across structural, MEP & finishes</p>
                </div>
                <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                  IS 456 Benchmark
                </span>
              </div>
              <BudgetDistributionChart data={budgetDistributionData} />
            </div>

            {/* Chart 2: Progress Curve */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Construction S-Curve</h3>
                  <p className="text-xs text-slate-500">Scheduled Target vs Actual Site Completion</p>
                </div>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                  CPM Timeline
                </span>
              </div>
              <ConstructionProgressChart data={progressTimelineData} />
            </div>
          </div>

          {/* Tables Row: Recent Projects & Upcoming Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Projects Table (2 Cols) */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Active Construction Projects</h3>
                  <p className="text-xs text-slate-500">Recent active sites, budgets, and milestones</p>
                </div>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700"
                >
                  <span>View All Projects</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Project Name</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Budget</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Target Date</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {projects.slice(0, 4).map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          <Link href={`/projects/${p.id}`} className="hover:text-orange-600">
                            {p.name}
                          </Link>
                          <span className="block text-[10px] text-slate-400 capitalize">{p.project_type} • {p.built_up_area.toLocaleString('en-IN')} sq.ft</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 truncate max-w-[140px]">{p.location}</td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900">{formatCompactINR(Number(p.budget))}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${getStatusBadgeClass(p.status)}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">{formatDate(p.expected_completion_date)}</td>
                        <td className="py-3.5 px-4 text-right">
                          <Link
                            href={`/projects/${p.id}`}
                            className="p-1 rounded-lg text-slate-400 hover:text-orange-600 hover:bg-orange-50 transition-colors inline-block"
                            title="Open project details"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                    {projects.length === 0 && !loading && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                          No projects found. Click &quot;Add New Project&quot; to begin.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Upcoming Tasks (1 Col) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Upcoming Site Tasks</h3>
                    <p className="text-xs text-slate-500">Critical deliverables due</p>
                  </div>
                  <Link href="/progress" className="text-xs font-bold text-orange-600 hover:underline">
                    Kanban
                  </Link>
                </div>

                <div className="space-y-3">
                  {upcomingTasks.map((t) => (
                    <div key={t.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-xs font-semibold text-slate-900 line-clamp-1">{t.title}</p>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${getPriorityBadgeClass(t.priority)}`}>
                          {t.priority}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Phase: {t.phase}</span>
                        <span>Due: {formatDate(t.due_date)}</span>
                      </div>
                    </div>
                  ))}

                  {upcomingTasks.length === 0 && !loading && (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      No pending tasks! All clear on site.
                    </div>
                  )}
                </div>
              </div>

              {/* BuildSmart AI Assistant Prompt shortcut */}
              <div className="mt-6 pt-4 border-t border-slate-100 bg-orange-50/50 rounded-xl p-3 border border-orange-100">
                <div className="flex items-center gap-2 text-xs font-bold text-orange-800 mb-1">
                  <Bot className="h-4 w-4 text-orange-600" />
                  <span>Ask BuildSmart Assistant</span>
                </div>
                <p className="text-[11px] text-orange-700 leading-relaxed mb-2">
                  Need an engineering audit or slab curing timeline for your active projects?
                </p>
                <Link
                  href="/assistant"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:text-orange-700"
                >
                  <span>Launch AI Assistant</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
