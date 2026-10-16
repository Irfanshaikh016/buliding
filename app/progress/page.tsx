'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import StatusBanner from '@/components/StatusBanner';
import {
  CheckSquare,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Filter,
  Layers,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  FileEdit,
  Trash2,
} from 'lucide-react';
import { Project, ProjectTask, TaskPriority, TaskStatus } from '@/lib/types';
import {
  getProjects,
  getTasks,
  saveTask,
  deleteTask,
  calculateProjectProgressFromTasks,
} from '@/lib/data-store';
import { formatDate, getPriorityBadgeClass, getStatusBadgeClass } from '@/lib/utils';

export default function ProgressTrackingPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [loading, setLoading] = useState(true);

  // New Task Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPhase, setNewTaskPhase] = useState('Structural Frame');
  const [newTaskTargetProject, setNewTaskTargetProject] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('Medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );
  const [newTaskNotes, setNewTaskNotes] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [pList, tList] = await Promise.all([getProjects(), getTasks()]);
    setProjects(pList);
    setTasks(tList);
    if (pList.length > 0 && !newTaskTargetProject) {
      setNewTaskTargetProject(pList[0].id);
    }
    setLoading(false);
  }

  const filteredTasks = selectedProjectId === 'all'
    ? tasks
    : tasks.filter((t) => t.project_id === selectedProjectId);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const activeProgress = calculateProjectProgressFromTasks(filteredTasks);

  // Status Categorization for Kanban
  const pendingTasks = filteredTasks.filter((t) => t.status === 'Pending');
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'In Progress');
  const completedTasks = filteredTasks.filter((t) => t.status === 'Completed');

  const handleUpdateStatus = async (task: ProjectTask, newStatus: TaskStatus) => {
    const newPct = newStatus === 'Completed' ? 100 : newStatus === 'In Progress' ? 50 : 0;
    await saveTask({
      ...task,
      status: newStatus,
      progress_percentage: newPct,
    });
    await loadData();
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle || !newTaskTargetProject) return;

    await saveTask({
      project_id: newTaskTargetProject,
      title: newTaskTitle,
      phase: newTaskPhase,
      duration_days: 14,
      start_date: new Date().toISOString().split('T')[0],
      due_date: newTaskDueDate,
      status: 'Pending',
      priority: newTaskPriority,
      progress_percentage: 0,
      notes: newTaskNotes,
    });

    setNewTaskTitle('');
    setNewTaskNotes('');
    setIsModalOpen(false);
    await loadData();
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
    await loadData();
  };

  // Helper to check if task is overdue
  const isOverdue = (task: ProjectTask) => {
    if (task.status === 'Completed') return false;
    const due = new Date(task.due_date).getTime();
    return due < Date.now();
  };

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
                <CheckSquare className="h-5 w-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Site Progress & Task Tracking
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Kanban board, milestone verification, and real-time project progress calculation
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                Kanban Board
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                List View
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 transition-all hover:scale-105"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Site Task</span>
            </button>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Project Selector & Progress Bar Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Project:</span>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Projects Combined</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Dynamic Calculated Progress */}
            <div className="w-full md:w-96">
              <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                <span className="text-slate-700">Calculated Task Completion</span>
                <span className="text-orange-600">{activeProgress}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-orange-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${activeProgress}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Derived directly from {filteredTasks.length} verified site deliverables.
              </p>
            </div>
          </div>

          {/* KANBAN VIEW */}
          {viewMode === 'kanban' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Column 1: Pending */}
              <div className="bg-slate-100/70 rounded-2xl p-4 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between px-2 pb-1">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-400"></span>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Pending</h3>
                  </div>
                  <span className="text-xs font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                    {pendingTasks.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {pendingTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow transition-shadow space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {task.phase}
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${getPriorityBadgeClass(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 leading-snug">{task.title}</h4>
                      {task.notes && <p className="text-[11px] text-slate-500 leading-relaxed">{task.notes}</p>}

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                        <span className={`flex items-center gap-1 ${isOverdue(task) ? 'text-red-600 font-bold' : ''}`}>
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(task.due_date)}</span>
                          {isOverdue(task) && <span className="text-[9px] bg-red-100 text-red-700 px-1 rounded">Overdue</span>}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(task, 'In Progress')}
                          className="text-[10px] font-bold text-orange-600 hover:text-orange-700 bg-orange-50 px-2 py-1 rounded-md"
                        >
                          Start →
                        </button>
                      </div>
                    </div>
                  ))}

                  {pendingTasks.length === 0 && (
                    <div className="p-6 text-center text-xs text-slate-400">No pending tasks</div>
                  )}
                </div>
              </div>

              {/* Column 2: In Progress */}
              <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between px-2 pb-1">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                    <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">In Progress</h3>
                  </div>
                  <span className="text-xs font-bold text-amber-700 bg-amber-200 px-2 py-0.5 rounded-full">
                    {inProgressTasks.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {inProgressTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white rounded-xl p-4 border border-amber-200 shadow-sm hover:shadow transition-shadow space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                          {task.phase}
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${getPriorityBadgeClass(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 leading-snug">{task.title}</h4>
                      {task.notes && <p className="text-[11px] text-slate-500 leading-relaxed">{task.notes}</p>}

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                        <span className="flex items-center gap-1 text-slate-500">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(task.due_date)}</span>
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(task, 'Pending')}
                            className="text-[10px] text-slate-400 hover:text-slate-600 px-1"
                            title="Move back to pending"
                          >
                            ←
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(task, 'Completed')}
                            className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md"
                          >
                            Complete ✓
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {inProgressTasks.length === 0 && (
                    <div className="p-6 text-center text-xs text-amber-700/60">No tasks currently in progress</div>
                  )}
                </div>
              </div>

              {/* Column 3: Completed */}
              <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-200/80 space-y-3">
                <div className="flex items-center justify-between px-2 pb-1">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                    <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Completed</h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-200 px-2 py-0.5 rounded-full">
                    {completedTasks.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {completedTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white rounded-xl p-4 border border-emerald-200 shadow-sm hover:shadow transition-shadow space-y-3 opacity-90"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {task.phase}
                        </span>
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 leading-snug line-through text-slate-500">
                        {task.title}
                      </h4>
                      {task.notes && <p className="text-[11px] text-slate-500 leading-relaxed">{task.notes}</p>}

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                        <span className="text-emerald-700 font-semibold">100% Completed</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(task, 'In Progress')}
                          className="text-[10px] text-slate-400 hover:text-slate-600"
                        >
                          Reopen ↻
                        </button>
                      </div>
                    </div>
                  ))}

                  {completedTasks.length === 0 && (
                    <div className="p-6 text-center text-xs text-emerald-700/60">No tasks completed yet</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* LIST VIEW */}
          {viewMode === 'list' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Task Deliverable</th>
                    <th className="py-3 px-4">Phase</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Target Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTasks.map((task) => (
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
                      <td className="py-3.5 px-4">
                        <span className={isOverdue(task) ? 'text-red-600 font-bold' : 'text-slate-500'}>
                          {formatDate(task.due_date)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusBadgeClass(task.status)}`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-1 rounded text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete task"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredTasks.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                        No tasks found. Click &quot;Add Site Task&quot; to begin.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* New Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Create New Site Deliverable</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Project *</label>
                <select
                  required
                  value={newTaskTargetProject}
                  onChange={(e) => setNewTaskTargetProject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Waterproofing pond test for second floor balcony"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phase</label>
                  <select
                    value={newTaskPhase}
                    onChange={(e) => setNewTaskPhase(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                  >
                    <option value="Pre-Construction">Pre-Construction & Approvals</option>
                    <option value="Sub-structure">Sub-structure & Footings</option>
                    <option value="Structural Frame">Structural Frame & Slabs</option>
                    <option value="Masonry & Envelope">Masonry & Blockwork</option>
                    <option value="Services (MEP)">Services (MEP Chasing)</option>
                    <option value="Finishing & Tiling">Finishing & Tiling</option>
                    <option value="Testing & Handover">Testing & Handover</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notes / Instructions</label>
                <textarea
                  rows={2}
                  placeholder="Specific quality control benchmarks, mix ratio or supervisor notes..."
                  value={newTaskNotes}
                  onChange={(e) => setNewTaskNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md shadow-orange-600/20"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
