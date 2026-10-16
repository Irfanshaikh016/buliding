'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import StatusBanner from '@/components/StatusBanner';
import {
  FolderKanban,
  Building2,
  Calendar,
  IndianRupee,
  MapPin,
  Clock,
  ArrowLeft,
  Trash2,
  CheckCircle2,
  Calculator,
  CalendarClock,
  Layers,
  FileText,
  Bot,
  PlusCircle,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { Project, ProjectTask, CostEstimate } from '@/lib/types';
import {
  getProjectById,
  getTasks,
  getEstimates,
  deleteProject,
  saveProject,
  saveTask,
  calculateProjectProgressFromTasks,
} from '@/lib/data-store';
import {
  formatINR,
  formatCompactINR,
  formatDate,
  getStatusBadgeClass,
  getPriorityBadgeClass,
} from '@/lib/utils';
import { BudgetDistributionChart } from '@/components/Charts';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [estimates, setEstimates] = useState<CostEstimate[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'estimates' | 'schedule'>('overview');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // New task modal state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPhase, setNewTaskPhase] = useState('Structural Frame');
  const [newTaskDays, setNewTaskDays] = useState(14);
  const [newTaskPriority, setNewTaskPriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('Medium');
  const [addingTask, setAddingTask] = useState(false);

  useEffect(() => {
    if (projectId) {
      loadProjectData();
    }
  }, [projectId]);

  async function loadProjectData() {
    setLoading(true);
    const p = await getProjectById(projectId);
    if (p) {
      setProject(p);
      const [tList, eList] = await Promise.all([
        getTasks(p.id),
        getEstimates(p.id),
      ]);
      setTasks(tList);
      setEstimates(eList);
    }
    setLoading(false);
  }

  const handleStatusChange = async (newStatus: Project['status']) => {
    if (!project) return;
    const updated = await saveProject({
      ...project,
      status: newStatus,
    });
    setProject(updated);
  };

  const handleTaskStatusToggle = async (task: ProjectTask) => {
    const nextStatus =
      task.status === 'Pending'
        ? 'In Progress'
        : task.status === 'In Progress'
        ? 'Completed'
        : 'Pending';

    const nextPct = nextStatus === 'Completed' ? 100 : nextStatus === 'In Progress' ? 50 : 0;

    await saveTask({
      ...task,
      status: nextStatus,
      progress_percentage: nextPct,
    });
    await loadProjectData();
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle || !project) return;

    await saveTask({
      project_id: project.id,
      title: newTaskTitle,
      phase: newTaskPhase,
      duration_days: newTaskDays,
      start_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + newTaskDays * 86400000).toISOString().split('T')[0],
      status: 'Pending',
      priority: newTaskPriority,
      progress_percentage: 0,
    });

    setNewTaskTitle('');
    setAddingTask(false);
    await loadProjectData();
  };

  const handleDelete = async () => {
    if (!project) return;
    await deleteProject(project.id);
    router.push('/projects');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50 items-center justify-center">
        <p className="text-slate-500 text-sm">Loading project workspace...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen bg-slate-50 flex-col items-center justify-center p-4">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-3" />
        <h2 className="text-lg font-bold text-slate-800">Project Not Found</h2>
        <p className="text-xs text-slate-500 mb-4">The requested project may have been deleted.</p>
        <Link href="/projects" className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold">
          Return to Projects
        </Link>
      </div>
    );
  }

  const progressPercent = calculateProjectProgressFromTasks(tasks);

  // Breakdown chart data from estimates if available, or default
  const primaryEstimate = estimates[0];
  const chartBreakdownData = primaryEstimate
    ? primaryEstimate.breakdown.map(b => ({ name: b.name, value: b.amount }))
    : [
        { name: 'Structural Frame (24%)', value: Math.round(Number(project.budget) * 0.24) },
        { name: 'Foundation (13%)', value: Math.round(Number(project.budget) * 0.13) },
        { name: 'Masonry & Plaster (13%)', value: Math.round(Number(project.budget) * 0.13) },
        { name: 'Finishes & Tiling (11%)', value: Math.round(Number(project.budget) * 0.11) },
        { name: 'Electrical Works (9%)', value: Math.round(Number(project.budget) * 0.09) },
        { name: 'Plumbing Works (8%)', value: Math.round(Number(project.budget) * 0.08) },
        { name: 'Contingency (7%)', value: Math.round(Number(project.budget) * 0.07) },
      ];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Sidebar className="hidden md:flex" />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <StatusBanner />

        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                href="/projects"
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {project.project_type}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${getStatusBadgeClass(project.status)}`}>
                    {project.status}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                  {project.name}
                </h1>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span>{project.location}</span>
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Status Selector */}
              <select
                value={project.status}
                onChange={(e) => handleStatusChange(e.target.value as Project['status'])}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>

              <Link
                href={`/reports?project=${project.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                <FileText className="h-4 w-4 text-orange-600" />
                <span className="hidden sm:inline">Executive Audit</span>
              </Link>

              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Delete project"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Progress Bar & Sub-Metrics */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1 w-full max-w-lg">
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600">Actual Task Completion</span>
                <span className="text-orange-600">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-orange-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Approved Budget</span>
                <p className="font-extrabold text-slate-900">{formatINR(Number(project.budget))}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Area & Floors</span>
                <p className="font-bold text-slate-700">{project.built_up_area.toLocaleString('en-IN')} sq.ft (G+{project.floors - 1})</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Handover Target</span>
                <p className="font-semibold text-slate-700">{formatDate(project.expected_completion_date)}</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-6 flex space-x-6 border-b border-slate-100 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`pb-3 transition-colors ${
                activeTab === 'overview'
                  ? 'border-b-2 border-orange-600 text-orange-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Overview & Breakdown
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tasks')}
              className={`pb-3 transition-colors flex items-center gap-1.5 ${
                activeTab === 'tasks'
                  ? 'border-b-2 border-orange-600 text-orange-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Site Tasks & Milestones</span>
              <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded-full text-[10px]">
                {tasks.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('estimates')}
              className={`pb-3 transition-colors flex items-center gap-1.5 ${
                activeTab === 'estimates'
                  ? 'border-b-2 border-orange-600 text-orange-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Cost Estimates</span>
              <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded-full text-[10px]">
                {estimates.length}
              </span>
            </button>
          </div>
        </header>

        {/* Tab Content */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Col: Scope & Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Description Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                    Project Scope & Engineering Specifications
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {project.description || 'No detailed scope notes added. You can update project scope in settings.'}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400">Finish Level</span>
                      <p className="font-bold text-slate-800">{project.finish_level}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Rate per Sq.Ft</span>
                      <p className="font-bold text-slate-800">₹{Math.round(Number(project.budget) / project.built_up_area)}/sq.ft</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Start Date</span>
                      <p className="font-bold text-slate-800">{formatDate(project.start_date)}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Created On</span>
                      <p className="font-bold text-slate-800">{formatDate(project.created_at)}</p>
                    </div>
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Link
                    href={`/estimator?projectId=${project.id}&area=${project.built_up_area}&location=${encodeURIComponent(project.location)}&finish=${project.finish_level}`}
                    className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-orange-500 transition-colors group"
                  >
                    <Calculator className="h-6 w-6 text-orange-600 mb-2 group-hover:scale-110 transition-transform" />
                    <h4 className="text-sm font-bold text-slate-900">Run Cost Estimator</h4>
                    <p className="text-xs text-slate-500 mt-1">Itemised calculation with IS 456 formulas</p>
                  </Link>

                  <Link
                    href={`/schedule?projectId=${project.id}&area=${project.built_up_area}&floors=${project.floors}&startDate=${project.start_date}`}
                    className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-blue-500 transition-colors group"
                  >
                    <CalendarClock className="h-6 w-6 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                    <h4 className="text-sm font-bold text-slate-900">Generate Schedule</h4>
                    <p className="text-xs text-slate-500 mt-1">Automated CPM timeline from plinth to handover</p>
                  </Link>

                  <Link
                    href={`/assistant?projectId=${project.id}`}
                    className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-purple-500 transition-colors group"
                  >
                    <Bot className="h-6 w-6 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                    <h4 className="text-sm font-bold text-slate-900">Consult AI Assistant</h4>
                    <p className="text-xs text-slate-500 mt-1">Ask questions with this project&apos;s context injected</p>
                  </Link>
                </div>
              </div>

              {/* Right Col: Cost Breakdown Chart */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Budget Distribution
                  </h3>
                  <span className="text-xs font-bold text-orange-600">Allocated</span>
                </div>
                <BudgetDistributionChart data={chartBreakdownData} />
              </div>
            </div>
          )}

          {/* TAB 2: TASKS */}
          {activeTab === 'tasks' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Site Tasks & Work Breakdown Structure (WBS)</h3>
                  <p className="text-xs text-slate-500">Click any status pill to cycle between Pending, In Progress, and Completed</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAddingTask(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Add Site Task</span>
                </button>
              </div>

              {/* Add Task Quick Form */}
              {addingTask && (
                <form onSubmit={handleAddTask} className="p-4 bg-orange-50/60 rounded-2xl border border-orange-200 space-y-4">
                  <h4 className="text-xs font-bold text-orange-900 uppercase">Create Site Deliverable</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        required
                        placeholder="Task title (e.g. Deshuttering of 2nd Floor Beam Formwork)"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-orange-200 bg-white text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <select
                        value={newTaskPhase}
                        onChange={(e) => setNewTaskPhase(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-orange-200 bg-white text-xs focus:outline-none"
                      >
                        <option value="Pre-Construction">Pre-Construction & Soil Test</option>
                        <option value="Sub-structure">Sub-structure & Footings</option>
                        <option value="Structural Frame">Structural Frame & Slabs</option>
                        <option value="Masonry & Envelope">Masonry & Blockwork</option>
                        <option value="Services (MEP)">Services (MEP Rough-in)</option>
                        <option value="Finishing & Tiling">Finishing & Tiling</option>
                        <option value="Testing & Handover">Testing & Handover</option>
                      </select>
                    </div>
                    <div>
                      <select
                        value={newTaskPriority}
                        onChange={(e) => setNewTaskPriority(e.target.value as ProjectTask['priority'])}
                        className="w-full px-3 py-2 rounded-xl border border-orange-200 bg-white text-xs focus:outline-none"
                      >
                        <option value="Low">Low Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="High">High Priority</option>
                        <option value="Urgent">Urgent Priority</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setAddingTask(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs bg-orange-600 text-white font-bold rounded-lg shadow-sm"
                    >
                      Save Task
                    </button>
                  </div>
                </form>
              )}

              {/* Tasks Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Deliverable Title</th>
                      <th className="py-3 px-4">Phase</th>
                      <th className="py-3 px-4">Priority</th>
                      <th className="py-3 px-4">Due Date</th>
                      <th className="py-3 px-4">Progress</th>
                      <th className="py-3 px-4 text-right">Status (Click to toggle)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tasks.map((task) => (
                      <tr key={task.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          {task.title}
                          {task.notes && <span className="block text-[10px] text-slate-400 font-normal">{task.notes}</span>}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">{task.phase}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${getPriorityBadgeClass(task.priority)}`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">{formatDate(task.due_date)}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-700 w-8">{task.progress_percentage}%</span>
                            <div className="w-20 bg-slate-100 rounded-full h-1.5">
                              <div
                                className="bg-orange-600 h-1.5 rounded-full"
                                style={{ width: `${task.progress_percentage}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleTaskStatusToggle(task)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold transition-transform hover:scale-105 cursor-pointer ${getStatusBadgeClass(task.status)}`}
                          >
                            {task.status} ↻
                          </button>
                        </td>
                      </tr>
                    ))}
                    {tasks.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                          No tasks recorded for this project. Click &quot;Add Site Task&quot; or generate a schedule.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ESTIMATES */}
          {activeTab === 'estimates' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Saved Cost Estimates for {project.name}</h3>
                  <p className="text-xs text-slate-500">Deterministic civil rates and itemised bill of quantities</p>
                </div>
                <Link
                  href={`/estimator?projectId=${project.id}&area=${project.built_up_area}&location=${encodeURIComponent(project.location)}&finish=${project.finish_level}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Generate New Estimate</span>
                </Link>
              </div>

              {estimates.map((est) => (
                <div key={est.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
                    <div>
                      <span className="text-[10px] font-bold text-orange-600 uppercase">Deterministic Benchmark</span>
                      <h4 className="text-lg font-bold text-slate-900">
                        {formatINR(est.estimated_total)}
                        <span className="text-xs font-normal text-slate-500 ml-2">(@ ₹{est.base_rate}/sq.ft)</span>
                      </h4>
                    </div>
                    <div className="text-xs text-slate-400">
                      Generated on {formatDate(est.created_at)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {est.breakdown.map((item, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                        <div className="flex justify-between font-bold text-slate-800 mb-1">
                          <span>{item.name}</span>
                          <span className="text-orange-600">{item.percentage}%</span>
                        </div>
                        <p className="font-extrabold text-slate-900">{formatINR(item.amount)}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {estimates.length === 0 && (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                  <Calculator className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">No formal estimates saved yet for this project.</p>
                  <Link
                    href={`/estimator?projectId=${project.id}&area=${project.built_up_area}&location=${encodeURIComponent(project.location)}&finish=${project.finish_level}`}
                    className="mt-3 inline-block px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold"
                  >
                    Run Cost Estimator
                  </Link>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2.5 rounded-xl bg-red-100">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Delete Project?</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-900">&quot;{project.name}&quot;</strong>? All associated tasks, schedules, and cost estimates will be erased.
            </p>
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/20"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
