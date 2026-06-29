/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Clock, 
  Award,
  BookOpen,
  Calendar,
  Layers,
  Search,
  Bell,
  CheckCircle2,
  Brain,
  ShieldCheck,
  Cpu,
  RefreshCw,
  X,
  ArrowRight
} from "lucide-react";
import Sidebar from "./components/Sidebar";
import TaskForm from "./components/TaskForm";
import RiskCard from "./components/RiskCard";
import WeeklyPlanner from "./components/WeeklyPlanner";
import ProductivityCoach from "./components/ProductivityCoach";
import AnalyticsPanel from "./components/AnalyticsPanel";
import GoalBasedCalendar from "./components/GoalBasedCalendar";
import AuthScreen from "./components/AuthScreen";
import { AppTheme, APP_THEMES } from "./lib/themes";

// Firebase imports
import { auth, db } from "./lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  setDoc, 
  deleteDoc, 
  writeBatch,
  getDocFromServer
} from "firebase/firestore";

import { 
  Task, 
  WeeklyTimeBlock, 
  AIInsight, 
  ProductivitySummary,
  Subtask
} from "./types";

import { 
  INITIAL_TASKS, 
  INITIAL_SCHEDULE, 
  INITIAL_INSIGHTS, 
  INITIAL_COACH_SUMMARY 
} from "./data";

export default function App() {
  // Authentication states
  const [user, setUser] = useState<{ email: string } | null>(() => {
    const saved = localStorage.getItem("lifeos_current_user");
    return saved ? { email: saved } : null;
  });
  const [authLoading, setAuthLoading] = useState(false);

  // Current Tab selection
  const [currentTab, setCurrentTab] = useState<string>("dashboard");

  // Aesthetic Theme State
  const [themeId, setThemeId] = useState<string>(() => {
    return localStorage.getItem("lifeos_theme") || "midnight";
  });

  const theme = APP_THEMES.find((t) => t.id === themeId) || APP_THEMES[0];

  const handleThemeChange = (id: string) => {
    localStorage.setItem("lifeos_theme", id);
    setThemeId(id);
    const chosenTheme = APP_THEMES.find((t) => t.id === id) || APP_THEMES[0];
    triggerAlert(`Aesthetic protocol recalibrated to ${chosenTheme.name}.`, "success");
  };

  // Core App states
  const [tasks, setTasks] = useState<Task[]>(() => {
    const currentUser = localStorage.getItem("lifeos_current_user");
    const key = currentUser ? `lifeos_tasks_${currentUser}` : "lifeos_tasks";
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [schedule, setSchedule] = useState<WeeklyTimeBlock[]>(() => {
    const currentUser = localStorage.getItem("lifeos_current_user");
    const key = currentUser ? `lifeos_schedule_${currentUser}` : "lifeos_schedule";
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULE;
  });

  const [insights, setInsights] = useState<AIInsight[]>(() => {
    const currentUser = localStorage.getItem("lifeos_current_user");
    const key = currentUser ? `lifeos_insights_${currentUser}` : "lifeos_insights";
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : INITIAL_INSIGHTS;
  });

  const [coachSummary, setCoachSummary] = useState<ProductivitySummary>(() => {
    const currentUser = localStorage.getItem("lifeos_current_user");
    const key = currentUser ? `lifeos_coach_${currentUser}` : "lifeos_coach";
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : INITIAL_COACH_SUMMARY;
  });

  // Modal / Notifications
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "info" | "warning" } | null>(null);
  const [loadingRisks, setLoadingRisks] = useState(false);
  const [loadingInsights, setLoadingInsights] = useState(false);

  // Persistence triggers with client-side sandbox isolation
  const saveTasksToLocalStorage = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    const key = user ? `lifeos_tasks_${user.email}` : "lifeos_tasks";
    localStorage.setItem(key, JSON.stringify(updatedTasks));
  };

  const saveScheduleToLocalStorage = (updatedSchedule: WeeklyTimeBlock[]) => {
    setSchedule(updatedSchedule);
    const key = user ? `lifeos_schedule_${user.email}` : "lifeos_schedule";
    localStorage.setItem(key, JSON.stringify(updatedSchedule));
  };

  const saveInsightsToLocalStorage = (updatedInsights: AIInsight[]) => {
    setInsights(updatedInsights);
    const key = user ? `lifeos_insights_${user.email}` : "lifeos_insights";
    localStorage.setItem(key, JSON.stringify(updatedInsights));
  };

  const saveCoachToLocalStorage = (updatedCoach: ProductivitySummary) => {
    setCoachSummary(updatedCoach);
    const key = user ? `lifeos_coach_${user.email}` : "lifeos_coach";
    localStorage.setItem(key, JSON.stringify(updatedCoach));
  };

  // Helper to trigger floating alert notifications
  const triggerAlert = (message: string, type: "success" | "info" | "warning" = "success") => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert(null);
    }, 4500);
  };

  /**
   * Recalculates risk levels for all tasks using backend AI risk analysis
   */
  const recalculateRiskLevels = async (currentTasks: Task[]) => {
    setLoadingRisks(true);
    try {
      const response = await fetch("/api/ai/risk-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks: currentTasks })
      });

      if (response.ok) {
        const riskAssessments = await response.json();
        const updated = currentTasks.map(task => {
          const match = riskAssessments.find((r: any) => r.id === task.id);
          if (match) {
            return {
              ...task,
              riskLevel: match.riskLevel,
              riskReason: match.riskReason
            };
          }
          return task;
        });
        saveTasksToLocalStorage(updated);
        console.log("AI Risk calculation complete.");
      }
    } catch (e) {
      console.error("Failed to run AI risk calculation:", e);
    } finally {
      setLoadingRisks(false);
    }
  };

  /**
   * Recalculates high-level Insights from the task workload
   */
  const recalculateInsights = async (currentTasks: Task[]) => {
    setLoadingInsights(true);
    try {
      const response = await fetch("/api/ai/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks: currentTasks })
      });

      if (response.ok) {
        const freshInsights = await response.json();
        saveInsightsToLocalStorage(freshInsights);
        console.log("AI Insights updated.");
      }
    } catch (e) {
      console.error("Failed to fetch fresh AI Insights:", e);
    } finally {
      setLoadingInsights(false);
    }
  };

  // Listen to changes in the active user and load/initialize their workspace
  useEffect(() => {
    if (user) {
      const email = user.email;
      
      // 1. Load tasks
      const savedTasks = localStorage.getItem(`lifeos_tasks_${email}`);
      const loadedTasks = savedTasks ? JSON.parse(savedTasks) : INITIAL_TASKS;
      setTasks(loadedTasks);
      if (!savedTasks) {
        localStorage.setItem(`lifeos_tasks_${email}`, JSON.stringify(INITIAL_TASKS));
      }

      // 2. Load schedule
      const savedSchedule = localStorage.getItem(`lifeos_schedule_${email}`);
      const loadedSchedule = savedSchedule ? JSON.parse(savedSchedule) : INITIAL_SCHEDULE;
      setSchedule(loadedSchedule);
      if (!savedSchedule) {
        localStorage.setItem(`lifeos_schedule_${email}`, JSON.stringify(INITIAL_SCHEDULE));
      }

      // 3. Load insights
      const savedInsights = localStorage.getItem(`lifeos_insights_${email}`);
      const loadedInsights = savedInsights ? JSON.parse(savedInsights) : INITIAL_INSIGHTS;
      setInsights(loadedInsights);
      if (!savedInsights) {
        localStorage.setItem(`lifeos_insights_${email}`, JSON.stringify(INITIAL_INSIGHTS));
      }

      // 4. Load coach summary
      const savedCoach = localStorage.getItem(`lifeos_coach_${email}`);
      const loadedCoach = savedCoach ? JSON.parse(savedCoach) : INITIAL_COACH_SUMMARY;
      setCoachSummary(loadedCoach);
      if (!savedCoach) {
        localStorage.setItem(`lifeos_coach_${email}`, JSON.stringify(INITIAL_COACH_SUMMARY));
      }

      // Trigger AI calculations for this specific user's loaded tasks
      recalculateRiskLevels(loadedTasks);
      recalculateInsights(loadedTasks);
    } else {
      setTasks([]);
      setSchedule([]);
      setInsights([]);
      setCoachSummary(INITIAL_COACH_SUMMARY);
    }
  }, [user]);

  /**
   * Task Management Handlers
   */
  const handleSaveTask = async (taskData: Omit<Task, "id" | "createdAt" | "completed">) => {
    let updated: Task[];
    if (editingTask) {
      // Edit operation
      updated = tasks.map((t) => 
        t.id === editingTask.id 
          ? { ...t, ...taskData } 
          : t
      );
      triggerAlert(`Operation "${taskData.title}" parameters refined successfully.`);
    } else {
      // Create new operation
      const newTask: Task = {
        ...taskData,
        id: `task-${Date.now()}`,
        completed: false,
        createdAt: new Date().toISOString().split('T')[0]
      };
      updated = [newTask, ...tasks];
      triggerAlert(`New operation "${taskData.title}" deployed.`);
    }

    saveTasksToLocalStorage(updated);
    setEditingTask(null);
    setIsFormOpen(false);

    // Asynchronously call AI Agents to update risk models and insights
    await recalculateRiskLevels(updated);
    await recalculateInsights(updated);
  };

  const handleToggleComplete = async (id: string) => {
    const updated = tasks.map((t) => {
      if (t.id === id) {
        const isCompleting = !t.completed;
        return {
          ...t,
          completed: isCompleting,
          completedAt: isCompleting ? new Date().toISOString() : undefined,
          // complete resets risk level to safe
          riskLevel: isCompleting ? "safe" : t.riskLevel,
          riskReason: isCompleting ? "Operation completed on-schedule." : t.riskReason
        } as Task;
      }
      return t;
    });

    saveTasksToLocalStorage(updated);
    const target = tasks.find((t) => t.id === id);
    if (target) {
      triggerAlert(
        target.completed 
          ? `Operation "${target.title}" re-activated.` 
          : `Operation "${target.title}" successfully accomplished!`,
        "success"
      );
    }

    await recalculateRiskLevels(updated);
    await recalculateInsights(updated);
  };

  const handleDeleteTask = async (id: string) => {
    const target = tasks.find((t) => t.id === id);
    const updated = tasks.filter((t) => t.id !== id);
    saveTasksToLocalStorage(updated);
    
    // Also remove from weekly schedule if exists
    const updatedSchedule = schedule.filter(b => b.taskId !== id);
    saveScheduleToLocalStorage(updatedSchedule);

    if (target) {
      triggerAlert(`Operation "${target.title}" deleted from systems.`, "info");
    }

    await recalculateRiskLevels(updated);
    await recalculateInsights(updated);
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  /**
   * AI Task Breakdown Agent trigger (Feature 3)
   */
  const handleTriggerBreakdown = async (id: string) => {
    const target = tasks.find((t) => t.id === id);
    if (!target) return;

    try {
      const response = await fetch("/api/ai/breakdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: target.title,
          description: target.description,
          estimatedEffort: target.estimatedEffort
        })
      });

      if (response.ok) {
        const subtasksData = await response.json();
        const subtasks: Omit<Subtask, "completed">[] = subtasksData;
        const formattedSubtasks: Subtask[] = subtasks.map((s, i) => ({
          id: `sub-${id}-${i}`,
          title: s.title,
          completed: false,
          estimatedEffort: s.estimatedEffort,
          order: s.order
        }));

        const updated = tasks.map((t) => 
          t.id === id 
            ? { ...t, subtasks: formattedSubtasks } 
            : t
        );
        saveTasksToLocalStorage(updated);
        triggerAlert(`AI Breakdown loaded for "${target.title}". Added ${formattedSubtasks.length} subtasks.`);
      }
    } catch (e) {
      console.error(e);
      triggerAlert("Failed to compile AI task breakdown.", "warning");
    }
  };

  /**
   * AI Task Recovery Planner trigger (Feature 6)
   */
  const handleTriggerRecovery = async (id: string) => {
    const target = tasks.find((t) => t.id === id);
    if (!target) return;

    try {
      const response = await fetch("/api/ai/recovery-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: target })
      });

      if (response.ok) {
        const recoveryPlanData = await response.json();
        const updated = tasks.map((t) => 
          t.id === id 
            ? { 
                ...t, 
                recoveryPlan: {
                  ...recoveryPlanData,
                  generatedAt: new Date().toISOString()
                } 
              } 
            : t
        );
        saveTasksToLocalStorage(updated);
        triggerAlert(`AI Recovery Blueprint deployed for "${target.title}". Check immediate catch-up actions.`);
      }
    } catch (e) {
      console.error(e);
      triggerAlert("Failed to generate AI recovery plan.", "warning");
    }
  };

  /**
   * Toggles completion status of a subtask
   */
  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    const updated = tasks.map((task) => {
      if (task.id === taskId && task.subtasks) {
        const updatedSubtasks = task.subtasks.map((sub) => {
          if (sub.id === subtaskId) {
            return { ...sub, completed: !sub.completed };
          }
          return sub;
        });
        return { ...task, subtasks: updatedSubtasks };
      }
      return task;
    });

    saveTasksToLocalStorage(updated);
    triggerAlert("Subtask milestone state updated.");
  };

  /**
   * AI Weekly Planner Agent trigger (Feature 4)
   */
  const handleGenerateSchedule = async () => {
    try {
      const response = await fetch("/api/ai/weekly-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks })
      });

      if (response.ok) {
        const blocks = await response.json();
        const formattedBlocks = blocks.map((b: any, idx: number) => ({
          id: `block-${Date.now()}-${idx}`,
          day: b.day,
          time: b.time,
          taskId: b.taskId,
          taskTitle: b.taskTitle,
          activity: b.activity
        }));

        saveScheduleToLocalStorage(formattedBlocks);
        triggerAlert("AI Chief of Staff has compiled your weekly focus schedule!");
      }
    } catch (e) {
      console.error(e);
      triggerAlert("Weekly schedule compilation failed.", "warning");
    }
  };

  const handleResetSchedule = () => {
    saveScheduleToLocalStorage([]);
    triggerAlert("Weekly Focus schedule cleared.", "info");
  };

  /**
   * AI Productivity Coach trigger (Feature 7)
   */
  const handleTriggerCoaching = async () => {
    try {
      const response = await fetch("/api/ai/productivity-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks })
      });

      if (response.ok) {
        const coachingData = await response.json();
        saveCoachToLocalStorage({
          ...coachingData,
          completionRate: Math.round(tasks.length > 0 ? (tasks.filter(t => t.completed).length / tasks.length) * 100 : 75)
        });
        triggerAlert("AI Productivity coaching audit successfully parsed.");
      }
    } catch (e) {
      console.error(e);
      triggerAlert("Productivity coaching compilation failed.", "warning");
    }
  };

  const handleApplyGoalPlan = (goalName: string, generatedTasks: Task[], generatedSchedule: WeeklyTimeBlock[]) => {
    // Merge new tasks with existing ones
    const cleanGeneratedTasks = generatedTasks.map((t, idx) => ({
      ...t,
      id: t.id || `goal-task-${Date.now()}-${idx}`,
      completed: false,
      createdAt: new Date().toISOString().split("T")[0]
    }));

    const updatedTasks = [...cleanGeneratedTasks, ...tasks];
    saveTasksToLocalStorage(updatedTasks);

    // Set the weekly schedule to the generated focus slots
    const cleanGeneratedSchedule = generatedSchedule.map((b, idx) => ({
      ...b,
      id: b.id || `goal-block-${Date.now()}-${idx}`
    }));

    saveScheduleToLocalStorage(cleanGeneratedSchedule);

    // Direct alerts
    triggerAlert(`Goal "${goalName}" applied! Deployed ${cleanGeneratedTasks.length} tasks and scheduled focus sessions.`, "success");

    // Recalculate AI analysis on the updated task boards
    recalculateRiskLevels(updatedTasks);
    recalculateInsights(updatedTasks);
  };

  const handleLogout = () => {
    localStorage.removeItem("lifeos_current_user");
    setUser(null);
    triggerAlert("System session terminated safely.", "info");
  };

  // Derived dashboard details
  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  const criticalTasksCount = activeTasks.filter(t => t.riskLevel === "high").length;
  
  // Calculate dynamic completion rate and score
  const dynamicCompletionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  // 1. Loading gate
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="flex flex-col items-center space-y-4 z-10">
          <div className="bg-indigo-600/10 border border-indigo-500/20 p-4 rounded-2xl shadow-[0_0_30px_rgba(79,70,229,0.25)] animate-pulse">
            <Cpu className="w-8 h-8 text-indigo-400 animate-spin" />
          </div>
          <div className="text-center space-y-1">
            <h2 className="text-sm font-mono font-bold text-slate-300 tracking-widest uppercase">Initializing Console</h2>
            <p className="text-xs text-slate-500">Establishing secure handshake with LifeOS Cloud...</p>
          </div>
        </div>
      </div>
    );
  }

  // 2. Auth gate (Local verification)
  if (!user) {
    return (
      <div className="font-sans">
        {alert && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-800 text-white px-5 py-4 rounded-2xl shadow-2xl max-w-sm flex items-start gap-3 animate-slideIn">
            <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5 animate-pulse" />
            <div className="space-y-0.5 text-xs">
              <p className="font-bold text-slate-100">AI Operations Pulse</p>
              <p className="text-slate-400 font-medium leading-relaxed">{alert.message}</p>
            </div>
            <button onClick={() => setAlert(null)} className="ml-auto text-slate-500 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <AuthScreen onAuthSuccess={(email) => {
          setUser({ email });
          triggerAlert(`Welcome, ${email}. Loading systems...`, "success");
        }} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.bgMain} ${theme.textMain} flex font-sans transition-colors duration-500`}>
      
      {/* Dynamic Floating Alerts Notification */}
      {alert && (
        <div className={`fixed bottom-6 right-6 z-50 bg-slate-900 border ${theme.borderMain} text-white px-5 py-4 rounded-2xl shadow-2xl max-w-sm flex items-start gap-3 animate-slideIn`}>
          <Sparkles className={`w-5 h-5 ${theme.textAccent} shrink-0 mt-0.5 animate-pulse`} />
          <div className="space-y-0.5 text-xs">
            <p className="font-bold text-slate-100">AI Operations Pulse</p>
            <p className="text-slate-400 font-medium leading-relaxed">{alert.message}</p>
          </div>
          <button onClick={() => setAlert(null)} className="ml-auto text-slate-500 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar 
         currentTab={currentTab} 
         setCurrentTab={setCurrentTab} 
         productivityScore={coachSummary.productivityScore}
         userEmail={user.email}
         onLogout={handleLogout}
        theme={theme}
        onThemeChange={handleThemeChange}
      />

      {/* Main Workspace Frame */}
      <main className="flex-1 overflow-y-auto h-screen p-6 md:p-8 space-y-6">
        
        {/* Workspace Top Header Bar */}
        <header className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b ${theme.borderMain} pb-5`}>
          <div>
            <h1 className="font-sans font-black text-2xl md:text-3xl text-white tracking-tight flex items-center gap-2">
              LifeOS AI <span className={`text-xs ${theme.bgAccentAlpha} ${theme.textAccent} font-mono px-2.5 py-1 rounded-full border ${theme.borderAccentAlpha}`}>v1.2 Agentic</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              AI Chief of Staff Console &bull; <span className={`font-mono font-bold ${theme.textAccent}`}>June 26, 2026</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick reload stats indicator */}
            {(loadingRisks || loadingInsights) && (
              <div className={`flex items-center gap-1.5 text-xs ${theme.textAccent} font-mono ${theme.bgAccentAlpha} px-3 py-1.5 rounded-xl border ${theme.borderAccentAlpha}`}>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>AI Re-Aligning Risk...</span>
              </div>
            )}
            
            <button
              onClick={() => {
                setEditingTask(null);
                setIsFormOpen(true);
              }}
              className={`px-4.5 py-2.5 rounded-xl ${theme.buttonAccent} font-bold text-sm shadow-lg ${theme.buttonAccentShadow} flex items-center gap-2 transition-all cursor-pointer`}
            >
              <Plus className="w-4 h-4" />
              <span>New Operation</span>
            </button>
          </div>
        </header>

        {/* ----------------- TAB: DASHBOARD ----------------- */}
        {currentTab === "dashboard" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Proactive Alerts Banner */}
            {criticalTasksCount > 0 && (
              <div className="bg-rose-500/5 border border-rose-500/20 rounded-3xl p-5 flex items-start gap-4 shadow-[0_0_40px_rgba(244,63,94,0.05)]">
                <div className="bg-rose-500/20 border border-rose-500/30 p-2.5 rounded-2xl text-rose-400 shadow-lg">
                  <AlertTriangle className="w-5 h-5 animate-bounce" />
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="font-sans font-bold text-white text-sm">
                    Critical Deadline Bottlenecks ({criticalTasksCount})
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    You have high-priority operations nearing deadline threshold. LifeOS AI recommends immediate activation of study recovery sequences.
                  </p>
                  <button 
                    onClick={() => setCurrentTab("tasks")} 
                    className="text-xs text-rose-400 font-bold flex items-center gap-1.5 mt-2 hover:text-rose-300"
                  >
                    <span>Inspect Critical Operations</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Core Metrics Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Dynamic Score widget */}
              <div className={`${theme.bgPanel} backdrop-blur-md border ${theme.borderMain} p-5 rounded-3xl shadow-[0_0_20px_rgba(0,0,0,0.3)] flex items-center gap-4`}>
                <div className={`${theme.bgAccentAlpha} ${theme.textAccent} p-3.5 rounded-2xl border ${theme.borderAccentAlpha}`}>
                  <Award className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Productivity Score</p>
                  <p className="text-2xl font-mono font-black text-white">{coachSummary.productivityScore}%</p>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5">Scored by Coach Agent</p>
                </div>
              </div>

              {/* Completion widget */}
              <div className={`${theme.bgPanel} backdrop-blur-md border ${theme.borderMain} p-5 rounded-3xl shadow-[0_0_20px_rgba(0,0,0,0.3)] flex items-center gap-4`}>
                <div className="bg-emerald-500/10 text-emerald-400 p-3.5 rounded-2xl border border-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Operations Solved</p>
                  <p className="text-2xl font-mono font-black text-white">
                    {completedTasks.length} <span className="text-sm text-slate-500">/ {tasks.length}</span>
                  </p>
                  <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">{dynamicCompletionRate}% Completed</p>
                </div>
              </div>

              {/* Peak productivity hours */}
              <div className={`${theme.bgPanel} backdrop-blur-md border ${theme.borderMain} p-5 rounded-3xl shadow-[0_0_20px_rgba(0,0,0,0.3)] flex items-center gap-4`}>
                <div className="bg-amber-500/10 text-amber-400 p-3.5 rounded-2xl border border-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Optimal Focus Period</p>
                  <p className="text-sm font-sans font-extrabold text-white leading-tight">
                    {coachSummary.optimalWorkTime.split(' (')[0]}
                  </p>
                  <p className="text-[11px] text-slate-400 font-sans mt-1">Based on chronological speed</p>
                </div>
              </div>

            </div>

            {/* Secondary Layout - Today's Operations vs Proactive Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              
              {/* Left Column: Today's Operations */}
              <div className="lg:col-span-3 space-y-4">
                <div className="flex items-center justify-between pb-1">
                  <h3 className="font-sans font-bold text-base text-white">
                    Today&apos;s Active Objectives ({activeTasks.length})
                  </h3>
                  <button onClick={() => setCurrentTab("tasks")} className="text-xs text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
                    View Board
                  </button>
                </div>

                <div className="space-y-4">
                  {activeTasks.length > 0 ? (
                    activeTasks.slice(0, 3).map((task) => (
                      <RiskCard
                        key={task.id}
                        task={task}
                        onToggleComplete={handleToggleComplete}
                        onDelete={handleDeleteTask}
                        onEdit={handleOpenEdit}
                        onTriggerBreakdown={handleTriggerBreakdown}
                        onTriggerRecovery={handleTriggerRecovery}
                        onToggleSubtask={handleToggleSubtask}
                      />
                    ))
                  ) : (
                    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl py-12 text-center text-slate-500">
                      <CheckCircle2 className="w-10 h-10 mx-auto stroke-1 text-slate-600 mb-2" />
                      <p className="text-sm font-bold text-slate-300">Workspace cleared</p>
                      <p className="text-xs text-slate-500 mt-1">All active operations completed successfully.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Proactive Insights Panel (Feature 8) */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between pb-1">
                  <h3 className="font-sans font-bold text-base text-white flex items-center gap-2">
                    <Brain className="w-4 h-4 text-indigo-400" />
                    Proactive AI Insights
                  </h3>
                  {loadingInsights && <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin" />}
                </div>

                <div className="space-y-3.5">
                  {insights.map((ins) => {
                    const styles = {
                      warning: "border-rose-500/20 bg-rose-500/5 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.05)]",
                      tip: "border-indigo-500/20 bg-indigo-500/5 text-indigo-300 shadow-[0_0_15px_rgba(79,70,229,0.05)]",
                      success: "border-emerald-500/20 bg-emerald-500/5 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.05)]",
                      info: "border-slate-800 bg-slate-900/40 text-slate-300",
                    };
                    return (
                      <div 
                        key={ins.id}
                        className={`border rounded-2xl p-4 space-y-1 text-xs leading-relaxed ${styles[ins.type]}`}
                      >
                        <p className="font-bold flex items-center gap-1.5 uppercase font-mono tracking-wider text-[10px]">
                          <span className={`w-1.5 h-1.5 rounded-full ${ins.type === 'warning' ? 'bg-rose-500' : ins.type === 'success' ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
                          {ins.title}
                        </p>
                        <p className="font-sans mt-0.5">{ins.text}</p>
                        {ins.taskId && (
                          <button 
                            onClick={() => setCurrentTab("tasks")}
                            className="mt-2 text-[10px] font-mono font-bold uppercase underline block opacity-80 hover:opacity-100"
                          >
                            Resolve Milestone
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ----------------- TAB: OPERATIONS BOARD ----------------- */}
        {currentTab === "tasks" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Board filters / stats summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/50 border border-slate-800 p-5 rounded-3xl shadow-sm">
              <div className="flex gap-4 text-xs font-mono">
                <div>
                  <span className="text-slate-500">PENDING:</span>{" "}
                  <span className="font-bold text-white">{activeTasks.length} Operations</span>
                </div>
                <div>
                  <span className="text-slate-500">COMPLETED:</span>{" "}
                  <span className="font-bold text-emerald-400">{completedTasks.length} Operations</span>
                </div>
              </div>

              {/* Recalculate Trigger */}
              <button
                disabled={loadingRisks}
                onClick={() => recalculateRiskLevels(tasks)}
                className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-950/40 hover:bg-slate-800/60 text-xs font-semibold text-slate-300 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingRisks ? 'animate-spin' : ''}`} />
                <span>Re-Audit Risks</span>
              </button>
            </div>

            {/* List active and completed tasks */}
            <div className="space-y-5">
              <h3 className="font-sans font-bold text-base text-white pb-1">
                Active Operations Workspace
              </h3>
              
              <div className="space-y-4">
                {activeTasks.length > 0 ? (
                  activeTasks.map((task) => (
                    <RiskCard
                      key={task.id}
                      task={task}
                      onToggleComplete={handleToggleComplete}
                      onDelete={handleDeleteTask}
                      onEdit={handleOpenEdit}
                      onTriggerBreakdown={handleTriggerBreakdown}
                      onTriggerRecovery={handleTriggerRecovery}
                      onToggleSubtask={handleToggleSubtask}
                    />
                  ))
                ) : (
                  <div className="bg-slate-900/50 border border-slate-800 rounded-3xl py-12 text-center text-slate-500">
                    <CheckCircle2 className="w-10 h-10 mx-auto stroke-1 text-slate-600 mb-2" />
                    <p className="text-sm font-bold text-slate-300">No Pending Tasks</p>
                    <p className="text-xs text-slate-500 mt-1">Deploy an operation to get started.</p>
                  </div>
                )}
              </div>

              {completedTasks.length > 0 && (
                <div className="space-y-4 pt-4">
                  <h3 className="font-sans font-bold text-base text-white">
                    Accomplished Operations
                  </h3>
                  {completedTasks.map((task) => (
                    <RiskCard
                      key={task.id}
                      task={task}
                      onToggleComplete={handleToggleComplete}
                      onDelete={handleDeleteTask}
                      onEdit={handleOpenEdit}
                      onTriggerBreakdown={handleTriggerBreakdown}
                      onTriggerRecovery={handleTriggerRecovery}
                      onToggleSubtask={handleToggleSubtask}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- TAB: WEEKLY PLANNER ----------------- */}
        {currentTab === "schedule" && (
          <div className="animate-fadeIn">
            <WeeklyPlanner
              schedule={schedule}
              tasks={tasks}
              onGenerateSchedule={handleGenerateSchedule}
              onResetSchedule={handleResetSchedule}
            />
          </div>
        )}

        {/* ----------------- TAB: ANALYTICS & COACH ----------------- */}
        {currentTab === "analytics" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Coach review summary */}
            <ProductivityCoach
              summary={coachSummary}
              tasks={tasks}
              onTriggerCoaching={handleTriggerCoaching}
            />

            {/* Charts Visualizer */}
            <div className="pt-4 border-t border-slate-800">
              <h3 className="font-sans font-bold text-base text-white mb-5">
                Workload Intelligence Metrics
              </h3>
              <AnalyticsPanel tasks={tasks} />
            </div>
          </div>
        )}

        {/* ----------------- TAB: GOAL-BASED CALENDAR ----------------- */}
        {currentTab === "calendar" && (
          <div className="animate-fadeIn">
            <GoalBasedCalendar
              tasks={tasks}
              schedule={schedule}
              theme={theme}
              onApplyGoalPlan={handleApplyGoalPlan}
              triggerAlert={triggerAlert}
            />
          </div>
        )}

      </main>

      {/* Task Creation Modal */}
      <TaskForm
        isOpen={isFormOpen}
        task={editingTask}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
      />
    </div>
  );
}
