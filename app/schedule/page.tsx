'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import StatusBanner from '@/components/StatusBanner';
import {
  CalendarClock,
  Building2,
  Calendar,
  Save,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  ArrowRight,
  Sparkles,
  Milestone,
} from 'lucide-react';
import { Project, ProjectTask, SchedulePhase } from '@/lib/types';
import { generateConstructionSchedule } from '@/lib/schedule-engine';
import { getProjects, saveMultipleTasks } from '@/lib/data-store';
import { formatDate, getPriorityBadgeClass } from '@/lib/utils';

function ScheduleContent() {
  const searchParams = useSearchParams();

  // Generator Parameters
  const [builtUpArea, setBuiltUpArea] = useState<number>(3500);
  const [floors, setFloors] = useState<number>(3);
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [speed, setSpeed] = useState<'standard' | 'fast_track' | 'relaxed'>('standard');

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const pId = searchParams.get('projectId');
    const area = searchParams.get('area');
    const flrs = searchParams.get('floors');
    const sDate = searchParams.get('startDate');

    if (area) setBuiltUpArea(Number(area));
    if (flrs) setFloors(Number(flrs));
    if (sDate) setStartDate(sDate);

    getProjects().then((data) => {
      setProjects(data);
      if (pId) setSelectedProjectId(pId);
      else if (data.length > 0) setSelectedProjectId(data[0].id);
    });
  }, [searchParams]);

  // Generate schedule deterministically
  const schedule = generateConstructionSchedule({
    projectId: selectedProjectId || 'proj_draft',
    startDate,
    builtUpArea: builtUpArea > 0 ? builtUpArea : 2000,
    floors: floors > 0 ? floors : 1,
    speedPriority: speed,
  });

  const handleSaveToProject = async () => {
    if (!selectedProjectId) return;
    setIsSaving(true);
    await saveMultipleTasks(
      schedule.tasks.map((t) => ({
        ...t,
        project_id: selectedProjectId,
      }))
    );
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
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
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                <CalendarClock className="h-5 w-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Construction Schedule & Critical Path Generator
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Automated civil engineering CPM schedule with milestone dates, phase sequencing, and task dependencies
            </p>
          </div>

          {selectedProjectId && (
            <button
              type="button"
              onClick={handleSaveToProject}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md shadow-orange-600/20 disabled:opacity-50 transition-all hover:scale-105"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? 'Saving Tasks...' : 'Sync Schedule to Project'}</span>
            </button>
          )}
        </header>

        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
          {savedSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 flex items-center gap-2 text-sm font-semibold">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>
                All {schedule.tasks.length} construction tasks and milestones successfully synced to project workspace!
              </span>
            </div>
          )}

          {/* Configuration Controls Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">
              Schedule Duration Variables
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Linked Project */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Project</label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                  {projects.length === 0 && <option value="">Draft (No Projects)</option>}
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Site Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none"
                />
              </div>

              {/* Area */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Built-Up Area (sq.ft)</label>
                <input
                  type="number"
                  min="500"
                  step="100"
                  value={builtUpArea}
                  onChange={(e) => setBuiltUpArea(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none"
                />
              </div>

              {/* Floors */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Number of Floors</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={floors}
                  onChange={(e) => setFloors(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none"
                />
              </div>

              {/* Speed Priority */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pace / Work Priority</label>
                <select
                  value={speed}
                  onChange={(e) => setSpeed(e.target.value as 'standard' | 'fast_track' | 'relaxed')}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none"
                >
                  <option value="standard">Standard Speed (Normal Curing)</option>
                  <option value="fast_track">Fast Track (Early Formwork RMC)</option>
                  <option value="relaxed">Relaxed / Staggered Pours</option>
                </select>
              </div>
            </div>
          </div>

          {/* Schedule Summary Banner */}
          <div className="bg-gradient-to-tr from-slate-950 via-slate-900 to-[#101B38] rounded-2xl border border-slate-800 p-6 sm:p-8 text-white shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase">
                  Automated Critical Path Timeline
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  {schedule.totalWorkingDays} Calendar Days (~{Math.round(schedule.totalWorkingDays / 30)} Months)
                </h2>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Handover Projection</p>
                <p className="text-xl font-bold text-emerald-400">{formatDate(schedule.projectEndDate)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 text-xs">
              <div>
                <span className="text-slate-400">Groundbreaking</span>
                <p className="font-bold text-white mt-0.5">{formatDate(schedule.projectStartDate)}</p>
              </div>
              <div>
                <span className="text-slate-400">Total Sequential Phases</span>
                <p className="font-bold text-white mt-0.5">{schedule.phases.length} Construction Phases</p>
              </div>
              <div>
                <span className="text-slate-400">Generated Deliverables</span>
                <p className="font-bold text-white mt-0.5">{schedule.tasks.length} Detailed Activities</p>
              </div>
              <div>
                <span className="text-slate-400">Calculation Engine</span>
                <p className="font-bold text-emerald-400 mt-0.5">Civil CPM Heuristics</p>
              </div>
            </div>
          </div>

          {/* Phase-by-Phase Interactive Timeline View */}
          <div className="space-y-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Phase Sequence & Task Schedule</span>
              <span className="text-xs font-normal text-slate-500">
                (Preliminary automated durations subject to weather & municipal sanction lead times)
              </span>
            </h3>

            <div className="space-y-4">
              {schedule.phases.map((phase, pIndex) => (
                <div
                  key={pIndex}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-100 text-orange-700 font-bold text-xs">
                        {pIndex + 1}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900">{phase.name}</h4>
                        <p className="text-xs text-slate-500">{phase.description}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-800">
                        {formatDate(phase.startDate)} → {formatDate(phase.endDate)}
                      </span>
                      <span className="block text-[11px] text-orange-600 font-semibold">
                        {phase.durationDays} Days duration
                      </span>
                    </div>
                  </div>

                  {/* Tasks in Phase */}
                  <div className="space-y-2.5">
                    {phase.tasks.map((t, tIndex) => (
                      <div
                        key={tIndex}
                        className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <Milestone className="h-4 w-4 text-orange-500 shrink-0" />
                          <span className="font-semibold text-slate-900">{t.title}</span>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-slate-500">{t.durationDays} Working Days</span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${getPriorityBadgeClass(t.priority)}`}>
                            {t.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function SchedulePage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-sm text-slate-500">Loading Construction Schedule...</div>}>
      <ScheduleContent />
    </Suspense>
  );
}
