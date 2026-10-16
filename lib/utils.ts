import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format numbers into Indian Rupee currency format (e.g. ₹ 1,25,00,000)
 */
export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format compact INR for charts (e.g. ₹ 1.25 Cr, ₹ 45 Lakhs)
 */
export function formatCompactINR(amount: number): string {
  if (isNaN(amount) || amount === 0) return '₹0';
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}k`;
  }
  return `₹${amount.toFixed(0)}`;
}

/**
 * Format date string (YYYY-MM-DD) to friendly format
 */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Status badge styling utility
 */
export function getStatusBadgeClass(status: string): string {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30';
    case 'in progress':
      return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30';
    case 'planning':
      return 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30';
    case 'on hold':
      return 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30';
    default:
      return 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-500/30';
  }
}

/**
 * Priority badge styling utility
 */
export function getPriorityBadgeClass(priority: string): string {
  switch (priority.toLowerCase()) {
    case 'urgent':
      return 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30';
    case 'high':
      return 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30';
    case 'medium':
      return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30';
    case 'low':
      return 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-500/30';
    default:
      return 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-500/30';
  }
}
