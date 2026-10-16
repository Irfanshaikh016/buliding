'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Building2, 
  Menu, 
  X, 
  Calculator, 
  Layers, 
  CalendarClock, 
  Bot, 
  LayoutDashboard, 
  FileText,
  CheckSquare,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isAuthOrApp = pathname.startsWith('/dashboard') || 
                      pathname.startsWith('/projects') || 
                      pathname.startsWith('/estimator') || 
                      pathname.startsWith('/materials') || 
                      pathname.startsWith('/schedule') || 
                      pathname.startsWith('/progress') || 
                      pathname.startsWith('/assistant') || 
                      pathname.startsWith('/reports') || 
                      pathname.startsWith('/settings');

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Cost Estimator', href: '/estimator', icon: Calculator },
    { name: 'AI Materials', href: '/materials', icon: Layers },
    { name: 'Schedule', href: '/schedule', icon: CalendarClock },
    { name: 'Progress', href: '/progress', icon: CheckSquare },
    { name: 'AI Assistant', href: '/assistant', icon: Bot },
    { name: 'Reports', href: '/reports', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors">
              BuildSmart<span className="text-orange-500">.AI</span>
            </span>
            <span className="hidden sm:block text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
              Construction SaaS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-orange-50 text-orange-600 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-orange-600' : 'text-slate-400'}`} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 transition-all"
          >
            <Sparkles className="h-4 w-4 text-amber-400" />
            Launch App
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-700 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-1 shadow-lg">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                  isActive
                    ? 'bg-orange-50 text-orange-600 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="h-5 w-5 text-orange-500" />
                {link.name}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 py-2.5 text-center text-sm font-semibold text-white shadow-md hover:bg-orange-700"
            >
              Enter Dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
