/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  ThumbsUp, 
  AlertCircle, 
  RefreshCw,
  Award,
  Zap,
  Target
} from "lucide-react";
import { ProductivitySummary, Task } from "../types";

interface ProductivityCoachProps {
  summary: ProductivitySummary;
  tasks: Task[];
  onTriggerCoaching: () => Promise<void>;
}

export default function ProductivityCoach({ summary, tasks, onTriggerCoaching }: ProductivityCoachProps) {
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await onTriggerCoaching();
    } finally {
      setLoading(false);
    }
  };

  const totalTasks = tasks.length;
  const completedTasksCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Dynamic Performance Metrics Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-sans font-bold text-base text-white">Performance Score</h3>
            <span className="p-1.5 rounded-xl bg-slate-800 text-indigo-400">
              <Award className="w-5 h-5" />
            </span>
          </div>

          {/* Large gauge representation */}
          <div className="py-4 flex flex-col items-center justify-center relative">
            <div className="relative flex items-center justify-center">
              {/* Radial background circle */}
              <svg className="w-36 h-36 transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="62"
                  className="stroke-slate-800 fill-transparent"
                  strokeWidth="8"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="62"
                  className="stroke-indigo-500 fill-transparent transition-all duration-1000"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 62}
                  strokeDashoffset={2 * Math.PI * 62 * (1 - summary.productivityScore / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-4xl font-mono font-black text-white">{summary.productivityScore}</span>
                <span className="text-xs text-slate-400 block font-mono">/ 100</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-800 text-xs">
          <div className="flex justify-between items-center text-slate-400">
            <span className="flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-indigo-400" /> Total Objectives
            </span>
            <span className="font-mono text-white font-semibold">{totalTasks} Operations</span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Completion Rate
            </span>
            <span className="font-mono text-emerald-400 font-semibold">{summary.completionRate}%</span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> Peak Cognitive Slot
            </span>
            <span className="font-mono text-amber-400 font-semibold">{summary.optimalWorkTime}</span>
          </div>
        </div>
      </div>

      {/* Narrative Advice / Feedback */}
      <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-md rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="bg-gradient-to-tr from-amber-500/20 to-rose-500/20 border border-amber-500/20 p-2 rounded-xl text-amber-400">
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-base text-white">
                  AI Coach Analysis
                </h3>
                <p className="text-[10px] text-slate-500 font-mono">Continuous feedback loop active</p>
              </div>
            </div>

            <button
              disabled={loading}
              onClick={handleRefresh}
              className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-950/40 hover:bg-slate-800/60 text-xs font-semibold text-slate-300 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? "Re-Analyzing..." : "Re-Analyze"}</span>
            </button>
          </div>

          {/* Verbal Coach feedback */}
          <div className="bg-slate-950/40 border border-slate-800 p-4 rounded-2xl relative">
            <Sparkles className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 text-amber-400 fill-amber-400/20" />
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              {summary.advice}
            </p>
          </div>

          {/* Strengths & Weaknesses Grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2.5">
              <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" /> Identified Strengths
              </h4>
              <ul className="space-y-1.5">
                {summary.strengths.map((item, idx) => (
                  <li key={idx} className="text-xs text-slate-350 flex items-start gap-2 bg-emerald-500/5 border border-emerald-500/10 p-2.5 rounded-xl">
                    <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2.5">
              <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" /> Areas of Improvement
              </h4>
              <ul className="space-y-1.5">
                {summary.improvementAreas.map((item, idx) => (
                  <li key={idx} className="text-xs text-slate-350 flex items-start gap-2 bg-rose-500/5 border border-rose-500/10 p-2.5 rounded-xl">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
