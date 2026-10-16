'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  Calculator,
  Layers,
  CalendarClock,
  CheckSquare,
  Bot,
  FileText,
  Settings,
  PlusCircle,
  Building2,
  HardHat,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className = '' }: SidebarProps) {
  const pathname = usePathname();

  const mainNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/projects', icon: FolderKanban },
    { name: 'Cost Estimator', href: '/estimator', icon: Calculator, badge: 'Deterministic' },
    { name: 'AI Materials', href: '/materials', icon: Layers, badge: 'AI' },
    { name: 'Schedule Generator', href: '/schedule', icon: CalendarClock },
    { name: 'Progress & Tasks', href: '/progress', icon: CheckSquare },
    { name: 'AI Assistant', href: '/assistant', icon: Bot, badge: 'GPT-4' },
    { name: 'Reports & Export', href: '/reports', icon: FileText },
    { name: 'Settings & Supabase', href: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={`flex flex-col w-64 bg-[#090D16] border-r border-slate-800/80 text-slate-300 min-h-screen shrink-0 ${className}`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800/80 gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 shadow-md shadow-orange-500/20">
          <HardHat className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="text-base font-bold text-white tracking-tight flex items-center gap-1">
            BuildSmart<span className="text-orange-500">.AI</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">Civil & Project OS</p>
        </div>
      </div>

      {/* Quick Action Button */}
      <div className="p-4">
        <Link
          href="/projects/new"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-500 text-white font-medium text-sm rounded-xl shadow-lg shadow-orange-600/20 transition-all hover:scale-[1.02]"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Project</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
          Main Modules
        </div>
        {mainNavigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-orange-500/15 text-orange-400 font-semibold border border-orange-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`h-4 w-4 transition-colors ${
                    isActive ? 'text-orange-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                    item.badge === 'AI' || item.badge === 'GPT-4'
                      ? 'bg-purple-900/60 text-purple-300 border border-purple-700/50'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* System Status & Viva Tag */}
      <div className="p-4 mx-3 mb-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            System Engine
          </span>
          <span className="text-[10px] text-orange-400 font-mono">v1.0 Ready</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Deterministic IS 456 rules & OpenAI integration active.
        </p>
      </div>

      {/* User Profile Mini Bar */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center gap-3 px-2 py-1.5">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center font-bold text-white text-xs shadow-sm">
            RS
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">Er. Rajesh Sharma</p>
            <p className="text-[10px] text-slate-400 truncate">Project Lead</p>
          </div>
          <Link
            href="/settings"
            className="text-slate-500 hover:text-slate-300 p-1 rounded-md hover:bg-slate-800 transition-colors"
            title="Settings"
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
