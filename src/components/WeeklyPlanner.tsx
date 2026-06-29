/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  CalendarDays, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  BookOpen, 
  Briefcase, 
  RefreshCw,
  Info
} from "lucide-react";
import { WeeklyTimeBlock, Task } from "../types";

interface WeeklyPlannerProps {
  schedule: WeeklyTimeBlock[];
  tasks: Task[];
  onGenerateSchedule: () => Promise<void>;
  onResetSchedule: () => void;
}

export default function WeeklyPlanner({
  schedule,
  tasks,
  onGenerateSchedule,
  onResetSchedule
}: WeeklyPlannerProps) {
  const [loading, setLoading] = useState(false);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handleGenerate = async () => {
    setLoading(true);
    try {
      await onGenerateSchedule();
    } finally {
      setLoading(false);
    }
  };

  // Group schedule items by day
  const scheduleByDay = daysOfWeek.reduce((acc, day) => {
    acc[day] = schedule.filter(item => item.day.toLowerCase() === day.toLowerCase());
    return acc;
  }, {} as Record<string, WeeklyTimeBlock[]>);

  const activeTaskCount = tasks.filter(t => !t.completed).length;

  return (
    <div className="space-y-6">
      {/* Banner / Header */}
      <div className="bg-gradient-to-r from-indigo-950/80 to-slate-950/80 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-slate-800 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 text-indigo-300 font-mono text-xs rounded-full border border-indigo-500/20 shadow-[0_0_15px_rgba(79,70,229,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Chief of Staff Weekly Planner</span>
          </div>
          <h2 className="font-sans font-bold text-2xl md:text-3xl text-white tracking-tight">
            Weekly Hyper-Focus Allocator
          </h2>
          <p className="text-sm text-indigo-200/80 font-sans leading-relaxed">
            The weekly planning agent analyzes your uncompleted tasks, deadlines, and estimated efforts to synthesize an optimized 7-day schedule with dedicated focus blocks.
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={onResetSchedule}
            className="px-4 py-3 rounded-xl border border-slate-800 bg-slate-950/40 hover:bg-slate-800/60 text-slate-300 text-sm font-semibold transition-all cursor-pointer flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Schedule</span>
          </button>
          <button
            disabled={loading || activeTaskCount === 0}
            onClick={handleGenerate}
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/15 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>AI Organizing Week...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate My Week</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Task Warning Banner */}
      {activeTaskCount === 0 && (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1 text-sm text-amber-300">
            <p className="font-bold">No Pending Operations Available</p>
            <p className="text-xs text-amber-400/80">Create or uncheck a task in the Operations Board before requesting an optimized schedule. The AI requires active objectives to perform resource scheduling.</p>
          </div>
        </div>
      )}

      {/* Grid Calendars */}
      <div className="grid grid-cols-1 xl:grid-cols-7 gap-4">
        {daysOfWeek.map((day) => {
          const blocks = scheduleByDay[day];
          const isWeekend = day === "Saturday" || day === "Sunday";
          
          return (
            <div 
              key={day} 
              className={`border border-slate-800 rounded-3xl p-4 flex flex-col min-h-[300px] bg-slate-900/30 backdrop-blur-md shadow-sm transition-all hover:shadow-md hover:border-slate-700 ${
                isWeekend ? "bg-slate-950/40 border-dashed" : ""
              }`}
            >
              {/* Day Header */}
              <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
                <span className="font-sans font-bold text-sm text-white">{day}</span>
                <span className="text-[10px] font-mono text-slate-500 font-semibold uppercase">
                  {blocks.length} {blocks.length === 1 ? "Block" : "Blocks"}
                </span>
              </div>

              {/* Time Blocks list */}
              <div className="flex-1 mt-3 space-y-3">
                {loading ? (
                  // Skeleton state
                  <div className="space-y-2 animate-pulse">
                    <div className="h-20 bg-slate-800 rounded-2xl" />
                    <div className="h-10 bg-slate-850 rounded-2xl" />
                  </div>
                ) : blocks.length > 0 ? (
                  blocks.map((block) => (
                    <div 
                      key={block.id}
                      className="group relative bg-slate-950/50 hover:bg-indigo-950/20 border border-slate-800/80 rounded-2xl p-3.5 space-y-2.5 transition-all text-xs"
                    >
                      {/* Time Slot badge */}
                      <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-indigo-400">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{block.time}</span>
                      </div>

                      {/* Associated Task */}
                      <div className="space-y-1">
                        <p className="font-sans font-bold text-white leading-tight">
                          {block.taskTitle}
                        </p>
                        <p className="text-slate-400 leading-normal">
                          {block.activity}
                        </p>
                      </div>

                      {/* Task Anchor */}
                      {block.taskId !== "none" && (
                        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500">
                          <span>Target Active</span>
                          <span className="bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider scale-95 border border-indigo-500/15">
                            Focus Block
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center py-12 text-center text-slate-500">
                    <CalendarDays className="w-8 h-8 stroke-1 text-slate-600 mb-2" />
                    <p className="text-[11px] font-sans">No operations allocated</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
