/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Trash2, 
  Edit3, 
  ListTodo,
  CheckSquare,
  Square,
  ShieldCheck,
  Zap,
  HelpCircle
} from "lucide-react";
import { Task, Subtask, RiskLevel, RecoveryPlan } from "../types";

interface RiskCardProps {
  key?: string | number;
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onTriggerBreakdown: (id: string) => Promise<void>;
  onTriggerRecovery: (id: string) => Promise<void>;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

export default function RiskCard({
  task,
  onToggleComplete,
  onDelete,
  onEdit,
  onTriggerBreakdown,
  onTriggerRecovery,
  onToggleSubtask
}: RiskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [loadingBreakdown, setLoadingBreakdown] = useState(false);
  const [loadingRecovery, setLoadingRecovery] = useState(false);

  const getRiskColors = (level?: RiskLevel) => {
    switch (level) {
      case "high":
        return {
          border: "border-rose-500/30 dark:border-rose-500/40",
          bg: "bg-rose-50/50 dark:bg-rose-950/10",
          text: "text-rose-700 dark:text-rose-400",
          badge: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20",
          glow: "shadow-rose-500/5"
        };
      case "medium":
        return {
          border: "border-amber-500/30 dark:border-amber-500/40",
          bg: "bg-amber-50/50 dark:bg-amber-950/10",
          text: "text-amber-700 dark:text-amber-400",
          badge: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
          glow: "shadow-amber-500/5"
        };
      case "safe":
      default:
        return {
          border: "border-emerald-500/30 dark:border-emerald-500/40",
          bg: "bg-emerald-50/50 dark:bg-emerald-950/10",
          text: "text-emerald-700 dark:text-emerald-400",
          badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
          glow: "shadow-emerald-500/5"
        };
    }
  };

  const risk = getRiskColors(task.riskLevel);
  const subtasksCompleted = task.subtasks?.filter(s => s.completed).length || 0;
  const subtasksTotal = task.subtasks?.length || 0;
  const subtaskPercentage = subtasksTotal > 0 ? Math.round((subtasksCompleted / subtasksTotal) * 100) : 0;

  const handleBreakdown = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoadingBreakdown(true);
    try {
      await onTriggerBreakdown(task.id);
      setIsExpanded(true);
    } finally {
      setLoadingBreakdown(false);
    }
  };

  const handleRecovery = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoadingRecovery(true);
    try {
      await onTriggerRecovery(task.id);
      setIsExpanded(true);
    } finally {
      setLoadingRecovery(false);
    }
  };

  return (
    <div 
      className={`bg-slate-900/40 backdrop-blur-md border ${task.completed ? 'border-slate-800 opacity-60' : risk.border} rounded-3xl transition-all duration-300 shadow-md ${risk.glow} hover:shadow-xl hover:border-slate-700`}
    >
      {/* Top Banner for Risk State */}
      {!task.completed && (task.riskLevel === "high" || task.riskLevel === "medium") && (
        <div className={`px-5 py-2.5 rounded-t-3xl border-b ${risk.border} ${risk.bg} flex items-center justify-between gap-3 text-xs`}>
          <div className="flex items-center gap-2 font-sans font-medium text-slate-300">
            <AlertTriangle className={`w-4 h-4 ${risk.text} shrink-0 animate-pulse`} />
            <span className="font-semibold capitalize text-slate-250 dark:text-slate-200">{task.riskLevel} Risk Horizon Detected</span>
          </div>
          <span className={`font-mono text-[10px] ${risk.text} bg-slate-950/80 px-2 py-0.5 rounded-full border border-current/10`}>
            {task.riskLevel === "high" ? "CRITICAL" : "CAUTION"}
          </span>
        </div>
      )}

      {/* Main card body */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5 flex-1">
            {/* Complete Checkbox */}
            <button 
              onClick={() => onToggleComplete(task.id)}
              className="mt-1 shrink-0 p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-indigo-400 transition-colors"
            >
              {task.completed ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-500/10" />
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-slate-600 hover:border-indigo-500 transition-colors" />
              )}
            </button>

            {/* Content text */}
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className={`font-sans font-bold text-base ${task.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                  {task.title}
                </h4>

                {/* Priority Badge */}
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  task.priority === 'high' 
                    ? 'bg-rose-500/10 text-rose-600 border border-rose-500/15'
                    : task.priority === 'medium'
                    ? 'bg-amber-500/10 text-amber-600 border border-amber-500/15'
                    : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/15'
                }`}>
                  {task.priority} Priority
                </span>

                {/* Risk Level Badge */}
                {!task.completed && (
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${risk.badge}`}>
                    {task.riskLevel || 'safe'} Risk
                  </span>
                )}
              </div>

              <p className={`text-sm ${task.completed ? 'text-slate-500' : 'text-slate-300'}`}>
                {task.description || "No further details provided."}
              </p>
            </div>
          </div>

          {/* Quick operations */}
          <div className="flex items-center gap-1 shrink-0">
            <button 
              onClick={() => onEdit(task)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800/50 transition-all"
              title="Edit Task"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onDelete(task.id)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-95/20 dark:hover:bg-rose-950/20 transition-all"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Info Grid (Deadline / Effort) */}
        <div className="mt-5 grid grid-cols-2 md:grid-cols-3 gap-4 py-4 border-t border-b border-slate-800 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <div>
              <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Target Deadline</p>
              <p className="font-semibold text-slate-200 mt-0.5">
                {new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ListTodo className="w-4 h-4 text-slate-500" />
            <div>
              <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Scoped Effort</p>
              <p className="font-semibold text-slate-200 mt-0.5">{task.estimatedEffort} Hours</p>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-slate-500" />
            <div>
              <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Subtask Progress</p>
              <p className="font-semibold text-slate-200 mt-0.5">
                {subtasksTotal > 0 ? `${subtasksCompleted}/${subtasksTotal} (${subtaskPercentage}%)` : "No breakdown"}
              </p>
            </div>
          </div>
        </div>

        {/* AI Analysis and Warning Reasons */}
        {!task.completed && task.riskReason && (
          <div className="mt-4 p-3 bg-slate-950/40 border border-slate-800 rounded-xl flex gap-2.5 text-xs text-slate-300">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-sans">
              <span className="font-bold text-white">AI Risk Analysis:</span> {task.riskReason}
            </p>
          </div>
        )}

        {/* Interactive Action Bar (Breakdown / Recovery trigger) */}
        {!task.completed && (
          <div className="mt-4 flex flex-wrap gap-2 pt-1">
            {/* Breakdown Button */}
            {subtasksTotal === 0 ? (
              <button
                disabled={loadingBreakdown}
                onClick={handleBreakdown}
                className="px-3 py-2 text-xs font-semibold rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/20 dark:hover:bg-indigo-900/30 dark:text-indigo-400 border border-indigo-200/40 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5 animate-pulse text-indigo-500" />
                <span>{loadingBreakdown ? "AI Breakdown Working..." : "AI Breakdown"}</span>
              </button>
            ) : (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/30 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ListTodo className="w-3.5 h-3.5" />
                <span>{isExpanded ? "Hide Subtasks" : "Review Subtasks"}</span>
                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            )}

            {/* Recovery Button */}
            {(task.riskLevel === "high" || task.riskLevel === "medium") && (
              <button
                disabled={loadingRecovery}
                onClick={handleRecovery}
                className="px-3 py-2 text-xs font-semibold rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 dark:text-rose-400 border border-rose-200/40 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                <span>{loadingRecovery ? "Creating Catch-up Plan..." : task.recoveryPlan ? "Review Catch-up Plan" : "Generate Recovery Plan"}</span>
                {!isExpanded && task.recoveryPlan && <ChevronDown className="w-3 h-3" />}
              </button>
            )}
          </div>
        )}

        {/* Expanded panel for AI Subtasks & Recovery Plans */}
        {isExpanded && !task.completed && (
          <div className="mt-5 pt-5 border-t border-slate-800 space-y-5 animate-fadeIn">
            {/* Inline Subtasks List */}
            {subtasksTotal > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <ListTodo className="w-3.5 h-3.5 text-indigo-400" />
                    AI Actionable Milestones ({subtasksCompleted}/{subtasksTotal})
                  </h5>
                  <span className="text-xs font-mono font-bold text-indigo-400">{subtaskPercentage}%</span>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${subtaskPercentage}%` }}
                  />
                </div>
                {/* Checklist */}
                <div className="space-y-1.5 bg-slate-950/40 p-3 rounded-2xl border border-slate-800">
                  {task.subtasks?.map((subtask) => (
                    <button
                      key={subtask.id}
                      onClick={() => onToggleSubtask(task.id, subtask.id)}
                      className="w-full text-left flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-900/60 transition-colors text-xs text-slate-300"
                    >
                      <span className="mt-0.5 text-slate-500 hover:text-indigo-400 transition-colors shrink-0">
                        {subtask.completed ? (
                          <CheckSquare className="w-4 h-4 text-indigo-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-600" />
                        )}
                      </span>
                      <div className="flex-1">
                        <span className={`${subtask.completed ? 'line-through text-slate-500' : 'text-slate-300 font-medium'}`}>
                          {subtask.title}
                        </span>
                        <span className="ml-2 text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded-md">
                          {subtask.estimatedEffort}h
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recovery Blueprint Panel */}
            {task.recoveryPlan && (
              <div className="border border-rose-500/20 bg-rose-500/5 p-4 rounded-2xl space-y-3.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-rose-400" />
                  <h5 className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                    AI Recovery Blueprint
                  </h5>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <p className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider">Revised Timeline milestones</p>
                    <p className="text-slate-300 font-medium mt-0.5 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                      {task.recoveryPlan.revisedSchedule}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider">Immediate Catch-up steps</p>
                    <ul className="space-y-1 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                      {task.recoveryPlan.catchUpActions.map((action, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-300">
                          <ArrowRight className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider">Coach Strategic Tips</p>
                    <p className="text-slate-400 leading-relaxed italic bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                      &ldquo;{task.recoveryPlan.recommendations}&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
