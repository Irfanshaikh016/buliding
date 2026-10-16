'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { Database, ShieldCheck, AlertCircle, ArrowUpRight } from 'lucide-react';

export default function StatusBanner() {
  const [configured, setConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    setConfigured(isSupabaseConfigured());
  }, []);

  if (configured === null) return null;

  return (
    <div className={`w-full py-2 px-4 sm:px-6 border-b text-xs flex flex-wrap items-center justify-between gap-2 transition-all ${
      configured 
        ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300' 
        : 'bg-amber-950/25 border-amber-900/40 text-amber-200'
    }`}>
      <div className="flex items-center gap-2">
        {configured ? (
          <>
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>
              <strong className="font-semibold text-emerald-300">Live Supabase Database:</strong> Connected with Row Level Security (RLS) enforcement.
            </span>
          </>
        ) : (
          <>
            <Database className="h-4 w-4 text-amber-400 shrink-0" />
            <span>
              <strong className="font-semibold text-amber-300">Local Demonstration Mode:</strong> All CRUD, AI cost estimates, and schedules persist in active browser storage. Connect your Supabase project in <Link href="/settings" className="underline font-semibold hover:text-white">Settings</Link> for remote Postgres sync.
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Link 
          href="/settings"
          className="inline-flex items-center gap-1 font-medium underline hover:text-white transition-colors"
        >
          <span>Connection Setup</span>
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
