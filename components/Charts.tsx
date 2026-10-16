'use client';

import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import { formatCompactINR, formatINR } from '@/lib/utils';

// Construction-themed color palette
const CHART_COLORS = [
  '#f97316', // Orange
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#f59e0b', // Amber
  '#06b6d4', // Cyan
  '#64748b', // Slate
];

interface BudgetPieProps {
  data: { name: string; value: number }[];
}

export function BudgetDistributionChart({ data }: BudgetPieProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !data || data.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center text-sm text-slate-400">
        Loading chart...
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [formatINR(value), 'Allocated']}
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '0.75rem',
              color: '#f8fafc',
              fontSize: '12px',
            }}
          />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

interface ProgressAreaProps {
  data: { name: string; planned: number; actual: number }[];
}

export function ConstructionProgressChart({ data }: ProgressAreaProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !data || data.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center text-sm text-slate-400">
        Loading progress chart...
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="plannedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
          <YAxis
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            unit="%"
            domain={[0, 100]}
          />
          <Tooltip
            formatter={(value: number) => [`${value}%`, 'Progress']}
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '0.75rem',
              color: '#f8fafc',
              fontSize: '12px',
            }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
          />
          <Area
            type="monotone"
            dataKey="planned"
            name="Scheduled Target"
            stroke="#3b82f6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#plannedGradient)"
          />
          <Area
            type="monotone"
            dataKey="actual"
            name="Actual Completed"
            stroke="#f97316"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#actualGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

interface ProjectBudgetBarProps {
  data: { name: string; budget: number; spent?: number }[];
}

export function ProjectBudgetComparisonBar({ data }: ProjectBudgetBarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !data || data.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center text-sm text-slate-400">
        Loading budget comparisons...
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            angle={-15}
            textAnchor="end"
          />
          <YAxis
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            tickFormatter={(val) => formatCompactINR(val)}
          />
          <Tooltip
            formatter={(value: number) => [formatINR(value), 'Budget']}
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '0.75rem',
              color: '#f8fafc',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="budget" name="Approved Budget" fill="#f97316" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
