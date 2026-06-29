/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Target, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Calendar, 
  Cpu, 
  Layers, 
  AlertCircle,
  Play,
  Check,
  RefreshCw,
  BookOpen,
  User,
  Award,
  ChevronRight,
  Compass,
  Zap,
  Activity,
  ShieldCheck
} from "lucide-react";
import { Task, WeeklyTimeBlock } from "../types";
import { AppTheme } from "../lib/themes";

interface GoalBasedCalendarProps {
  tasks: Task[];
  schedule: WeeklyTimeBlock[];
  theme: AppTheme;
  onApplyGoalPlan: (goalName: string, generatedTasks: Task[], generatedSchedule: WeeklyTimeBlock[]) => void;
  triggerAlert: (message: string, type: "success" | "info" | "warning") => void;
}

interface GeneratedGoalPlan {
  goal: string;
  durationDays: number;
  tasks: Task[];
  schedule: WeeklyTimeBlock[];
}

interface CommandCenterGoal {
  id: string;
  title: string;
  timeframe: string;
  priority: 'high' | 'medium' | 'low';
}

interface CommandCenterPlan {
  goals: CommandCenterGoal[];
  tasks: Task[];
  schedule: WeeklyTimeBlock[];
  roadmapText: string;
}

export default function GoalBasedCalendar({
  tasks,
  schedule,
  theme,
  onApplyGoalPlan,
  triggerAlert
}: GoalBasedCalendarProps) {
  // Navigation Mode
  const [activeMode, setActiveMode] = useState<"command" | "strategy">("command");

  // State: Strategic Goal Builder (Classic Mode)
  const [goalInput, setGoalInput] = useState("Crack placement interview in 30 days");
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(false);
  const [activePlan, setActivePlan] = useState<GeneratedGoalPlan | null>(() => {
    const saved = localStorage.getItem("lifeos_active_goal_plan");
    return saved ? JSON.parse(saved) : null;
  });
  const [isApplied, setIsApplied] = useState(() => {
    return localStorage.getItem("lifeos_goal_plan_applied") === "true";
  });

  // State: LifeOS Command Center (Premium Mode)
  const [commandInput, setCommandInput] = useState(
    "I have an AI exam in 10 days, a hackathon in 3 days, and placement preparation."
  );
  const [commandLoading, setCommandLoading] = useState(false);
  const [commandPlan, setCommandPlan] = useState<CommandCenterPlan | null>(() => {
    const saved = localStorage.getItem("lifeos_active_command_plan");
    return saved ? JSON.parse(saved) : null;
  });
  const [isCommandApplied, setIsCommandApplied] = useState(() => {
    return localStorage.getItem("lifeos_command_applied") === "true";
  });
  
  const [logs, setLogs] = useState<string[]>([
    "[System] Goal-Based Strategy Console initialized.",
    "[Ready] Command Center is primed. Enter commitments to auto-orchestrate."
  ]);

  // Presets for Classic Strategic Goal Builder
  const presetGoals = [
    {
      title: "Crack placement interview in 30 days",
      duration: 30,
      badge: "Placement Prep",
      desc: "Creates Aptitude practice, DSA sessions, Mock interviews, Resume reviews"
    },
    {
      title: "Learn Advanced Machine Learning from scratch",
      duration: 30,
      badge: "Data Science",
      desc: "Creates Mathematics, Neural Network tutorials, PyTorch coding, Project build"
    },
    {
      title: "Launch a SaaS MVP with full-stack Node & React",
      duration: 21,
      badge: "SaaS Builder",
      desc: "Creates API routing, Database setup, Stripe checkout, Landing page, Deployment"
    },
    {
      title: "Prepare for AWS Solutions Architect certification",
      duration: 15,
      badge: "Cloud Architecture",
      desc: "Creates Video lectures, Cheat-sheet summaries, Practice exams, Hands-on labs"
    }
  ];

  // Presets for Premium LifeOS Command Center
  const commandPresets = [
    {
      text: "I have an AI exam in 10 days, a hackathon in 3 days, and placement preparation.",
      badge: "Peak Workload",
      desc: "Auto-balances high-urgency hackathon sprint, exam preparation deadlines, and continuous career routines."
    },
    {
      text: "AWS Architect certification on July 15th, an ML research paper due in 5 days, and daily gym routines.",
      badge: "Skill & Health",
      desc: "Allocates strict AWS mock test blocks, focused writing periods, and dynamic physical training slots."
    },
    {
      text: "Launch a SaaS MVP in 15 days, prepare for final year presentation, and learn System Design basics.",
      badge: "Tech Sprint",
      desc: "Maps full-stack development phases, presentation rehearsals, and distributed computing topics."
    }
  ];

  const handleSelectPreset = (preset: typeof presetGoals[0]) => {
    setGoalInput(preset.title);
    setDuration(preset.duration);
    setLogs((prev) => [
      `[Select] Selected goal template: "${preset.title}" (${preset.duration} days)`,
      ...prev
    ]);
  };

  const handleSelectCommandPreset = (preset: typeof commandPresets[0]) => {
    setCommandInput(preset.text);
    setLogs((prev) => [
      `[Command Center] Command prompt selected: "${preset.badge}"`,
      ...prev
    ]);
  };

  // Strategic Goal Builder (Classic Mode Generation)
  const handleGenerateStrategy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalInput.trim()) {
      triggerAlert("Please specify an ambitious goal.", "warning");
      return;
    }

    setLoading(true);
    setLogs((prev) => [
      `[AI Agent] Analyzing target vectors for: "${goalInput}"`,
      `[NLP Parsing] Extracting duration constraints (${duration} days)`,
      `[AI Agent] Connecting to Gemini LLM for structural curriculum synthesis...`,
      ...prev
    ]);

    try {
      const response = await fetch("/api/ai/goal-calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: goalInput, duration })
      });

      if (response.ok) {
        const data = await response.json();
        setActivePlan(data);
        setIsApplied(false);
        localStorage.setItem("lifeos_active_goal_plan", JSON.stringify(data));
        localStorage.setItem("lifeos_goal_plan_applied", "false");

        setLogs((prev) => [
          `[Success] Mapped ${data.tasks.length} strategic milestones.`,
          `[Success] Scheduled ${data.schedule.length} calendar focus blocks.`,
          `[System] Compilation successful. Awaiting operator confirmation.`,
          ...prev
        ]);
        triggerAlert("AI has successfully compiled your Goal-Based Calendar!", "success");
      } else {
        throw new Error("Failed to compile strategy");
      }
    } catch (err) {
      console.error(err);
      triggerAlert("Could not connect to AI Strategy planner. Please try again.", "warning");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!activePlan) return;
    onApplyGoalPlan(activePlan.goal, activePlan.tasks, activePlan.schedule);
    setIsApplied(true);
    localStorage.setItem("lifeos_goal_plan_applied", "true");
    setLogs((prev) => [
      `[Applied] Successfully deployed tasks to Operations Board.`,
      `[Applied] Mapped calendar slots to Weekly Planner.`,
      `[System] Operational roadmap is now ACTIVE.`,
      ...prev
    ]);
  };

  const handleReset = () => {
    setActivePlan(null);
    setIsApplied(false);
    localStorage.removeItem("lifeos_active_goal_plan");
    localStorage.setItem("lifeos_goal_plan_applied", "false");
    setLogs((prev) => [
      `[Reset] Erased current strategy roadmap.`,
      `[System] System back to IDLE status.`,
      ...prev
    ]);
  };

  // LifeOS Command Center (Premium Mode Generation)
  const handleGenerateCommandPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) {
      triggerAlert("Please enter your current schedule commitments.", "warning");
      return;
    }

    setCommandLoading(true);
    setLogs((prev) => [
      `[Command Center] Activating LifeOS Orchestrator protocols...`,
      `[Command Center] Analyzing commitments: "${commandInput}"`,
      `[AI Reasoning] Resolving timeline constraints and prioritizing overlap tracks...`,
      `[AI Reasoning] Synthesizing Goals, Task boards, and calendar blocks...`,
      ...prev
    ]);

    try {
      const response = await fetch("/api/ai/command-center", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: commandInput })
      });

      if (response.ok) {
        const data = await response.json();
        setCommandPlan(data);
        setIsCommandApplied(false);
        localStorage.setItem("lifeos_active_command_plan", JSON.stringify(data));
        localStorage.setItem("lifeos_command_applied", "false");

        // Format system parsing updates for the CLI console
        const goalTitles = data.goals.map((g: any) => `"${g.title}"`).join(", ");
        setLogs((prev) => [
          `[Deconstructed] Identified core goals: ${goalTitles}.`,
          `[Success] Synthesized ${data.tasks.length} optimized milestone tasks.`,
          `[Success] Scheduled ${data.schedule.length} custom focus time-blocks.`,
          `[Command Center] Unified roadmap generated. Ready to apply protocols.`,
          ...prev
        ]);
        triggerAlert("Command Center plan parsed and prioritized successfully!", "success");
      } else {
        throw new Error("Failed to orchestrate life plan");
      }
    } catch (err) {
      console.error(err);
      triggerAlert("Could not parse schedule. Please try again.", "warning");
    } finally {
      setCommandLoading(false);
    }
  };

  const handleApplyCommand = () => {
    if (!commandPlan) return;
    const combinedGoalTitle = commandPlan.goals.map(g => g.title).join(" & ");
    onApplyGoalPlan(combinedGoalTitle, commandPlan.tasks, commandPlan.schedule);
    setIsCommandApplied(true);
    localStorage.setItem("lifeos_command_applied", "true");
    setLogs((prev) => [
      `[Applied] Successfully deployed ${commandPlan.tasks.length} tasks to Operations Board.`,
      `[Applied] Synced ${commandPlan.schedule.length} scheduled sessions to Weekly Planner.`,
      `[System] Multi-objective protocols are fully synchronized.`,
      ...prev
    ]);
  };

  const handleResetCommand = () => {
    setCommandPlan(null);
    setIsCommandApplied(false);
    localStorage.removeItem("lifeos_active_command_plan");
    localStorage.setItem("lifeos_command_applied", "false");
    setLogs((prev) => [
      `[Reset] Discarded Command Center active roadmap.`,
      `[System] Operational center cleared to IDLE.`,
      ...prev
    ]);
  };

  // Helper: Simple Markdown-to-React Converter (No dependencies)
  function renderMarkdown(text: string) {
    if (!text) return null;
    const lines = text.split("\n");
    
    return (
      <div className="space-y-3 font-sans text-xs leading-relaxed text-slate-350">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          
          if (trimmed.startsWith("#### ")) {
            return (
              <h5 key={idx} className="font-bold text-xs mt-4 mb-2 uppercase font-mono tracking-wider text-teal-400">
                {trimmed.replace("#### ", "")}
              </h5>
            );
          }
          if (trimmed.startsWith("### ")) {
            return (
              <h4 key={idx} className="font-bold text-sm text-white mt-5 mb-3 border-b border-slate-800 pb-1.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                {trimmed.replace("### ", "")}
              </h4>
            );
          }
          if (trimmed.startsWith("## ")) {
            return (
              <h3 key={idx} className="font-bold text-base text-white mt-6 mb-4 font-mono">
                {trimmed.replace("## ", "")}
              </h3>
            );
          }
          if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
            const content = trimmed.substring(2);
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="text-teal-500 mt-1.5 select-none shrink-0">•</span>
                <span className="text-slate-300">{parseBoldText(content)}</span>
              </div>
            );
          }
          if (trimmed === "") {
            return <div key={idx} className="h-2" />;
          }
          return (
            <p key={idx} className="text-slate-300 leading-relaxed pl-1">
              {parseBoldText(trimmed)}
            </p>
          );
        })}
      </div>
    );
  }

  function parseBoldText(text: string) {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} className="text-white font-bold">{part}</strong>;
      }
      return part;
    });
  }

  // Classic Completion Stats
  const goalTaskIds = activePlan ? activePlan.tasks.map(t => t.id) : [];
  const activePlanTasksInLive = tasks.filter(t => goalTaskIds.includes(t.id));
  const completedCount = activePlanTasksInLive.filter(t => t.completed).length;
  const totalCount = activePlanTasksInLive.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Command Center Completion Stats
  const commandTaskIds = commandPlan ? commandPlan.tasks.map(t => t.id) : [];
  const commandTasksInLive = tasks.filter(t => commandTaskIds.includes(t.id));
  const commandCompletedCount = commandTasksInLive.filter(t => t.completed).length;
  const commandTotalCount = commandTasksInLive.length;
  const commandCompletionRate = commandTotalCount > 0 ? Math.round((commandCompletedCount / commandTotalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Dynamic Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-950 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-slate-800 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/10 text-teal-300 font-mono text-xs rounded-full border border-teal-500/20 shadow-[0_0_15px_rgba(20,184,166,0.15)] animate-pulse">
            <Cpu className="w-3.5 h-3.5 text-teal-400" />
            <span>AI Operations Orchestrator Active</span>
          </div>
          <h2 className="font-sans font-bold text-2xl md:text-3xl text-white tracking-tight">
            LifeOS AI Command & Strategic Workspace
          </h2>
          <p className="text-sm text-slate-300 font-sans leading-relaxed">
            Deconstruct complex overlapping life events, school exams, coding sprints, and career plans. Generate immediate schedules, prioritized milestone lists, and comprehensive roadmaps in a single click.
          </p>
        </div>

        {/* Global Reset Button */}
        {activeMode === "command" && commandPlan && (
          <button
            onClick={handleResetCommand}
            className="px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/50 hover:bg-slate-800/40 text-slate-300 text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 shrink-0 shadow-lg hover:border-slate-700"
          >
            <RefreshCw className="w-3.5 h-3.5 text-teal-400" />
            <span>Erase Command Board</span>
          </button>
        )}
        {activeMode === "strategy" && activePlan && (
          <button
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/50 hover:bg-slate-800/40 text-slate-300 text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 shrink-0 shadow-lg hover:border-slate-700"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
            <span>Erase Goal Strategy</span>
          </button>
        )}
      </div>

      {/* Mode Navigation Toggle */}
      <div className="flex bg-slate-950/80 border border-slate-850 p-1 rounded-2xl max-w-md shadow-inner">
        <button
          onClick={() => setActiveMode("command")}
          className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
            activeMode === "command"
              ? "bg-slate-900 border border-slate-800 text-teal-400 shadow-[0_0_12px_rgba(20,184,166,0.1)]"
              : "text-slate-450 hover:text-slate-300"
          }`}
        >
          <Sparkles className="w-4 h-4 text-teal-400 animate-pulse" />
          <span>LifeOS Command Center</span>
        </button>
        <button
          onClick={() => setActiveMode("strategy")}
          className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
            activeMode === "strategy"
              ? "bg-slate-900 border border-slate-800 text-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.1)]"
              : "text-slate-450 hover:text-slate-300"
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Strategic Goal Builder</span>
        </button>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Input Console & Presets */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* RENDER MODE: COMMAND CENTER INPUT */}
          {activeMode === "command" && (
            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400" /> Natural Input Console
              </h4>

              <form onSubmit={handleGenerateCommandPlan} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] font-bold text-slate-500 uppercase">Multi-Goal Commitments</label>
                  <textarea
                    value={commandInput}
                    onChange={(e) => setCommandInput(e.target.value)}
                    placeholder="e.g., I have an AI exam in 10 days, a hackathon in 3 days, and placement preparation."
                    rows={4}
                    className="w-full px-3.5 py-3 rounded-xl border border-slate-800 bg-slate-950/80 text-slate-200 text-xs focus:outline-none focus:border-teal-500/50 resize-none font-sans leading-relaxed shadow-inner"
                  />
                </div>

                <button
                  type="submit"
                  disabled={commandLoading}
                  className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg shadow-teal-600/15 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {commandLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Deconstructing & Prioritizing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-teal-300" />
                      <span>One-Click Life Planning</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* RENDER MODE: CLASSIC GOAL BUILDER INPUT */}
          {activeMode === "strategy" && (
            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Cpu className={`w-4 h-4 ${theme.textAccent}`} /> Strategy Creator
              </h4>

              <form onSubmit={handleGenerateStrategy} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] font-bold text-slate-500 uppercase">Target Objective</label>
                  <textarea
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    placeholder="e.g. Crack placement interview in 30 days"
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-800 bg-slate-950/80 text-slate-200 text-xs focus:outline-none focus:border-indigo-500/50 resize-none font-sans leading-relaxed shadow-inner"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] font-bold text-slate-500 uppercase">Strategy Horizon (Days)</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[15, 21, 30, 60].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDuration(d)}
                        className={`py-2 rounded-lg font-mono text-xs font-bold border transition-all cursor-pointer ${
                          duration === d
                            ? `${theme.bgAccentAlpha} ${theme.textAccent} ${theme.borderAccentAlpha}`
                            : "bg-slate-950/50 text-slate-400 border-slate-850 hover:bg-slate-800/40"
                        }`}
                      >
                        {d}d
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 mt-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/15 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>AI Compiling Roadmap...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Generate AI Goal Calendar</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* PRESETS CONTAINER */}
          {activeMode === "command" ? (
            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-teal-400" /> Multi-Goal Presets
              </h4>
              <div className="space-y-3">
                {commandPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectCommandPreset(preset)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer hover:border-slate-700 flex flex-col gap-1.5 ${
                      commandInput === preset.text
                        ? "bg-teal-950/15 border-teal-500/30"
                        : "bg-slate-950/30 border-slate-850"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-sans font-bold text-white text-[11px] leading-snug">Preset {idx + 1}</span>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800/80 text-teal-400 uppercase tracking-wider border border-slate-750 shrink-0">
                        {preset.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                      "{preset.text}"
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-400" /> Strategic Templates
              </h4>
              <div className="space-y-3">
                {presetGoals.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectPreset(preset)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer hover:border-slate-700 flex flex-col gap-1.5 ${
                      goalInput === preset.title
                        ? `${theme.bgAccentAlpha2} border-indigo-500/30`
                        : "bg-slate-950/30 border-slate-850"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-sans font-bold text-white text-xs leading-snug">{preset.title}</span>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 uppercase tracking-wider border border-slate-750 shrink-0">
                        {preset.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                      {preset.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Results Plan Dashboard & Terminal */}
        <div className="space-y-6 lg:col-span-2 flex flex-col">
          
          {/* RESULTS: COMMAND CENTER ACTIVE PLAN */}
          {activeMode === "command" && (
            commandPlan ? (
              <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 flex-1">
                
                {/* Applied Stat Banner */}
                {isCommandApplied && (
                  <div className="bg-teal-500/5 border border-teal-500/20 rounded-2xl p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-xs font-bold text-teal-400 font-sans">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Command Center Roadmap Deployed & Active</span>
                      </div>
                      <span className="font-mono text-xs text-teal-400 font-bold">{commandCompletionRate}% Completed</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-teal-500 transition-all duration-500" 
                        style={{ width: `${commandCompletionRate}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Section A: Extracted Goals */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold text-slate-450 uppercase tracking-wider flex items-center gap-2">
                    <Compass className="w-4 h-4 text-teal-400" /> 1. Extracted Strategic Core Goals
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {commandPlan.goals.map((g, idx) => (
                      <div key={idx} className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-2xl space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wider border ${
                            g.priority === "high" 
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}>
                            {g.priority} priority
                          </span>
                          <span className="text-[9px] font-mono text-slate-500 font-semibold">{g.timeframe}</span>
                        </div>
                        <h5 className="font-sans font-bold text-white text-xs leading-snug">{g.title}</h5>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section B: Optimized Milestone Tasks */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold text-slate-450 uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-4 h-4 text-indigo-400" /> 2. Prioritized Milestones & Tasks
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {commandPlan.tasks.map((task, idx) => (
                      <div 
                        key={idx}
                        className="bg-slate-950/40 border border-slate-850 hover:border-slate-750 rounded-2xl p-4 space-y-2.5 transition-all"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wider border ${
                            task.priority === "high"
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/15"
                              : "bg-indigo-500/10 text-indigo-400 border-indigo-500/15"
                          }`}>
                            {task.priority} Priority
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 font-medium">
                            {task.estimatedEffort} hrs/week
                          </span>
                        </div>

                        <div className="space-y-1">
                          <h5 className="font-sans font-bold text-white text-xs leading-snug">{task.title}</h5>
                          <p className="text-[10.5px] text-slate-400 font-sans leading-relaxed">{task.description}</p>
                        </div>

                        <div className="pt-2 border-t border-slate-850 flex justify-between items-center text-[9.5px] font-mono text-slate-500">
                          <span>Target Deadline</span>
                          <span className="text-slate-300 font-bold">{task.deadline}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section C: Weekly Focus Schedule */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold text-slate-450 uppercase tracking-wider flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-400" /> 3. Automated Weekly Calendar Slots
                  </h4>
                  <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 max-h-[220px] overflow-y-auto space-y-2.5">
                    {commandPlan.schedule.map((block, idx) => (
                      <div 
                        key={idx}
                        className="p-3 bg-slate-900/40 rounded-xl border border-slate-850 flex items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[9px] font-bold text-slate-200 bg-slate-850 px-1.5 py-0.5 rounded border border-slate-750 uppercase">
                              {block.day}
                            </span>
                            <span className="text-slate-500 font-mono text-[9px]">{block.time}</span>
                          </div>
                          <h6 className="font-bold text-white text-[11px]">{block.taskTitle}</h6>
                          <p className="text-[10px] text-slate-400 leading-normal">{block.activity}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section D: AI Master Strategic Roadmap */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold text-slate-450 uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-teal-400" /> 4. AI Strategic Master Roadmap
                  </h4>
                  <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-2xl">
                    {renderMarkdown(commandPlan.roadmapText)}
                  </div>
                </div>

                {/* Deploy Button */}
                {!isCommandApplied ? (
                  <div className="bg-slate-950 border border-slate-850 rounded-2xl p-5 text-center space-y-3.5">
                    <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto font-sans">
                      Deploy this prioritized, multi-goal roadmap to automatically populate your live <span className="text-white font-bold font-mono">Operations Board</span> and sync scheduled focus sessions.
                    </p>
                    <button
                      onClick={handleApplyCommand}
                      className="px-6 py-3.5 mx-auto bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-teal-600/10 flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer transform hover:scale-[1.01]"
                    >
                      <Play className="w-4 h-4 fill-white text-white" />
                      <span>One-Click Life Planning</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <p className="text-xs text-slate-500 font-mono">
                      Unified Command Center protocols successfully synchronized.
                    </p>
                  </div>
                )}

              </div>
            ) : (
              <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 border-dashed rounded-3xl p-12 text-center text-slate-500 flex-1 flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-slate-950 rounded-full border border-slate-850 shadow-inner">
                  <Sparkles className="w-12 h-12 stroke-[1.2] text-slate-600" />
                </div>
                <div className="space-y-1.5 max-w-sm">
                  <h5 className="font-sans font-bold text-slate-300 text-sm">Awaiting Multi-Goal Directive</h5>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans">
                    Enter your commitments or click a preset on the left. The orchestrator will parse all parallel timelines, build dedicated milestones, schedule focus slots, and compose a master balance roadmap.
                  </p>
                </div>
              </div>
            )
          )}

          {/* RESULTS: STRATEGIC GOAL BUILDER ACTIVE PLAN */}
          {activeMode === "strategy" && (
            activePlan ? (
              <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 flex-1">
                
                {/* Goal Metadata Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-800">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">Active Operational Directive</span>
                    <h3 className="font-sans font-bold text-lg text-white leading-tight flex items-center gap-2">
                      <Target className="w-5 h-5 text-emerald-400" />
                      {activePlan.goal}
                    </h3>
                  </div>

                  <div className="flex gap-2 text-xs">
                    <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-center">
                      <span className="block text-[9px] font-mono font-bold text-slate-500 uppercase">Duration</span>
                      <span className="font-mono font-bold text-slate-200">{activePlan.durationDays} Days</span>
                    </div>
                  </div>
                </div>

                {/* Status Section */}
                {isApplied && (
                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 font-sans">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Roadmap Active in Workspace</span>
                      </div>
                      <span className="font-mono text-xs text-emerald-400 font-bold">{completionRate}% Completed</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 transition-all duration-500" 
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 font-sans">
                      Track details and complete your subtasks directly inside the <span className="text-indigo-400 font-semibold font-mono">Operations Board</span> or check daily routines in the <span className="text-indigo-400 font-semibold font-mono">Weekly Planner</span>.
                    </p>
                  </div>
                )}

                {/* Generated Milestone Objectives */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold text-slate-450 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-400" /> 1. Strategic Milestones Created
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {activePlan.tasks.map((task, idx) => (
                      <div 
                        key={idx}
                        className="bg-slate-950/60 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-4 space-y-2 transition-all relative group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 uppercase tracking-wider border border-indigo-500/15">
                            {task.priority} Priority
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 font-medium">
                            {task.estimatedEffort}h/week
                          </span>
                        </div>

                        <div className="space-y-1">
                          <h5 className="font-sans font-bold text-white text-xs leading-snug flex items-center gap-1.5">
                            {task.title}
                          </h5>
                          <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                            {task.description}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-850 flex justify-between items-center text-[10px] font-mono text-slate-500">
                          <span>Target Deadline</span>
                          <span className="text-slate-300 font-bold">{task.deadline}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Generated Schedule Preview */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold text-slate-450 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-indigo-400" /> 2. Automatically Mapped Schedule Slots
                  </h4>

                  <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3 max-h-[220px] overflow-y-auto space-y-2 font-sans text-xs">
                    {activePlan.schedule.map((block, idx) => (
                      <div 
                        key={idx}
                        className="p-3 bg-slate-900/40 rounded-xl border border-slate-850 flex items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold text-slate-200 bg-slate-850 px-1.5 py-0.5 rounded border border-slate-750 uppercase">
                              {block.day}
                            </span>
                            <span className="text-slate-400 font-mono text-[10px]">{block.time}</span>
                          </div>
                          <h6 className="font-bold text-white text-[11px]">{block.taskTitle}</h6>
                          <p className="text-[10px] text-slate-400 leading-normal">{block.activity}</p>
                        </div>

                        <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Apply Trigger */}
                {!isApplied ? (
                  <div className="bg-slate-950 border border-slate-850 rounded-2xl p-5 space-y-4 pt-4 text-center">
                    <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
                      Confirm compilation of this AI roadmap to automatically populate your live <span className="text-white font-bold font-mono">Operations Board</span> and schedule focus windows.
                    </p>

                    <button
                      onClick={handleApply}
                      className="px-6 py-3.5 mx-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer transform hover:scale-[1.01]"
                    >
                      <Play className="w-4 h-4 fill-white text-white" />
                      <span>Apply AI Goal Plan to Live Workspace</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <p className="text-xs text-slate-500 font-mono">
                      System directives running. Operator audit fully synchronized.
                    </p>
                  </div>
                )}

              </div>
            ) : (
              <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 border-dashed rounded-3xl p-12 text-center text-slate-500 flex-1 flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-slate-950 rounded-full border border-slate-850 shadow-inner">
                  <Target className="w-12 h-12 stroke-[1.2] text-slate-600" />
                </div>
                <div className="space-y-1.5 max-w-sm">
                  <h5 className="font-sans font-bold text-slate-300 text-sm">Awaiting Strategic Directive</h5>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans">
                    Select a template on the left or enter a custom goal. The AI agent will decompose it into structural milestones and automatically schedule them on your calendar.
                  </p>
                </div>
              </div>
            )
          )}

          {/* Sync Terminal Logs (Aesthetic & Practical) */}
          <div className="bg-slate-950 text-slate-200 border border-slate-800 rounded-3xl p-5 shadow-sm space-y-3 mt-6 flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-850 pb-2.5">
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Cpu className={`w-4 h-4 shrink-0 ${activeMode === "command" ? "text-teal-400 animate-pulse" : "text-indigo-400"}`} /> 
                <span>Strategy Compiling Terminal</span>
              </h4>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${activeMode === "command" ? "bg-teal-400" : "bg-indigo-400"}`} />
                <span className="text-[10px] font-mono text-slate-400 uppercase">Core Online</span>
              </div>
            </div>

            <div className="flex-1 min-h-[90px] max-h-[140px] bg-slate-900/40 p-3.5 rounded-xl font-mono text-[10px] text-slate-450 space-y-1.5 overflow-y-auto">
              {logs.map((log, idx) => (
                <div key={idx} className="leading-relaxed">
                  <span className={activeMode === "command" ? "text-teal-400 font-semibold" : "text-indigo-400 font-semibold"}>
                    [LifeOS]
                  </span>{" "}
                  {log}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
