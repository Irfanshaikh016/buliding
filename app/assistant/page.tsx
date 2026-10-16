'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import StatusBanner from '@/components/StatusBanner';
import {
  Bot,
  Send,
  Sparkles,
  Building2,
  HelpCircle,
  ShieldAlert,
  FolderKanban,
  CheckCircle2,
  RefreshCw,
  User,
  ArrowRight,
} from 'lucide-react';
import { Project, ChatMessage } from '@/lib/types';
import { getProjects } from '@/lib/data-store';

function AssistantContent() {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init_1',
      role: 'assistant',
      content: `Hello! I am **BuildSmart Assistant**, your AI civil engineering and construction management advisor.\n\nI can help you with:\n- **Deterministic Cost Analysis & BOQ Verification**\n- **Indian Standards (IS 456, IS 1786, IS 1489)**\n- **Cement & Rebar Selection (OPC vs PPC, Fe 500D vs CRS)**\n- **CPM Critical Path Scheduling & Curing Delays**\n- **Analyzing your active project data**\n\nHow can I assist your construction planning today?`,
      created_at: new Date().toISOString(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pId = searchParams.get('projectId');
    getProjects().then((data) => {
      setProjects(data);
      if (pId) setSelectedProjectId(pId);
      else if (data.length > 0) setSelectedProjectId(data[0].id);
    });
  }, [searchParams]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const presetPrompts = [
    'How do I calculate reinforcement steel quantity for a G+2 residential slab?',
    'What is the practical difference between PPC and OPC 53 cement under IS codes?',
    'Explain the recommended curing protocol for M25 grade RCC columns.',
    'Suggest a foundation design strategy for expansive Black Cotton soil.',
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      role: 'user',
      content: text.trim(),
      created_at: new Date().toISOString(),
      project_id: selectedProjectId || undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          history: messages.slice(-5),
          projectContext: selectedProject || null,
        }),
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `msg_a_${Date.now()}`,
        role: 'assistant',
        content: data.content || 'I encountered an issue generating a response. Please try again.',
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `msg_err_${Date.now()}`,
        role: 'assistant',
        content: 'Unable to reach the assistant service. Please check your internet connection or verify OPENAI_API_KEY.',
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Sidebar className="hidden md:flex" />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <StatusBanner />

        {/* Chat Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/20">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>BuildSmart Assistant</span>
                <span className="text-[10px] font-semibold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full border border-orange-200">
                  Civil Engineering AI
                </span>
              </h1>
              <p className="text-xs text-slate-500">
                Advisory engineering assistant conditioned on Indian Standards & active project specs
              </p>
            </div>
          </div>

          {/* Project Context Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">Active Context:</span>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-orange-500"
            >
              <option value="">General (No Project Linked)</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.location})
                </option>
              ))}
            </select>
          </div>
        </header>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-w-4xl mx-auto w-full">
          {/* Active project context pill */}
          {selectedProject && (
            <div className="p-3 bg-orange-50/70 border border-orange-200/80 rounded-2xl flex items-center justify-between text-xs text-orange-900">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-orange-600 shrink-0" />
                <span>
                  Context Injected: <strong className="font-bold">{selectedProject.name}</strong> ({selectedProject.built_up_area} sq.ft • {selectedProject.location} • Budget: ₹{Number(selectedProject.budget).toLocaleString('en-IN')})
                </span>
              </div>
              <span className="text-[10px] font-semibold text-orange-700 uppercase bg-orange-200/60 px-2 py-0.5 rounded-md">
                Active
              </span>
            </div>
          )}

          {/* Messages list */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="h-8 w-8 rounded-xl bg-orange-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-slate-900 text-white rounded-tr-none'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none space-y-2'
                }`}
              >
                <div className="prose prose-xs max-w-none text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                  {msg.content}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="h-8 w-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 shrink-0 shadow-sm mt-1">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-slate-400">
              <div className="h-8 w-8 rounded-xl bg-orange-600 flex items-center justify-center text-white shrink-0 shadow-sm animate-pulse">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl flex items-center gap-2 shadow-sm">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-orange-600" />
                <span>BuildSmart Assistant is synthesizing civil specifications...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Preset Prompt Suggestions */}
        {messages.length <= 2 && (
          <div className="px-4 py-2 border-t border-slate-100 bg-white/80 shrink-0 max-w-4xl mx-auto w-full">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Recommended Civil Queries
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {presetPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 border border-slate-200 rounded-xl text-[11px] text-slate-600 font-medium shrink-0 transition-colors text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="max-w-4xl mx-auto flex items-center gap-3"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about cost rates, IS 456 rules, curing cycles, or your active project..."
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="px-5 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-orange-600/20 disabled:opacity-50 transition-all flex items-center gap-1.5"
            >
              <span>Send</span>
              <Send className="h-4 w-4" />
            </button>
          </form>
          <p className="text-center text-[10px] text-slate-400 mt-2">
            Advisory planning responses only. Final structural drawings require certified licensed engineer sign-off.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AssistantPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-sm text-slate-500">Loading BuildSmart Assistant...</div>}>
      <AssistantContent />
    </Suspense>
  );
}
