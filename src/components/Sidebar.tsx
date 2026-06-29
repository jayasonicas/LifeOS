/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  LineChart, 
  CalendarDays, 
  Cpu, 
  Sparkles,
  Zap,
  Activity,
  User,
  LogOut,
  Palette
} from "lucide-react";
import { AppTheme, APP_THEMES } from "../lib/themes";

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  productivityScore: number;
  userEmail?: string | null;
  onLogout?: () => void;
  theme: AppTheme;
  onThemeChange: (themeId: string) => void;
}

export default function Sidebar({ 
  currentTab, 
  setCurrentTab, 
  productivityScore, 
  userEmail, 
  onLogout,
  theme,
  onThemeChange
}: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "tasks", label: "Operations Board", icon: CheckSquare },
    { id: "schedule", label: "Weekly Planner", icon: Calendar },
    { id: "analytics", label: "Coach & Metrics", icon: LineChart },
    { id: "calendar", label: "Goal Calendar", icon: CalendarDays },
  ];

  return (
    <div className={`w-64 ${theme.bgSidebar} backdrop-blur-md text-slate-100 flex flex-col border-r ${theme.borderMain} h-screen sticky top-0 shrink-0`}>
      {/* Brand Header */}
      <div className={`p-6 border-b ${theme.borderMain} flex items-center gap-3`}>
        <div className={`${theme.bgAccentAlpha} border ${theme.borderAccentAlpha} p-2.5 rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.25)] flex items-center justify-center`}>
          <Cpu className={`w-5 h-5 ${theme.textAccent}`} />
        </div>
        <div>
          <h1 className="font-sans font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
            LifeOS <span className={`text-xs ${theme.bgAccentAlpha2} ${theme.textAccent} font-mono font-medium px-2 py-0.5 rounded-full border ${theme.borderAccentAlpha}`}>AI</span>
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-0.5">Personal Operations</p>
        </div>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 p-4 space-y-1">
        <p className="px-3 text-[10px] font-mono font-semibold tracking-wider text-slate-500 uppercase mb-2">
          Operations Rail
        </p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? `${theme.bgAccentAlpha} ${theme.textAccent} border ${theme.borderAccentAlpha} shadow-[0_0_15px_rgba(79,70,229,0.15)] font-semibold`
                  : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-100"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? theme.textAccent : "text-slate-400"}`} />
              <span className="font-sans">{item.label}</span>
              {isActive && (
                <div className={`ml-auto w-1.5 h-1.5 rounded-full ${theme.indicatorPulse} animate-pulse`} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Aesthetic Protocol (Theme Selector) */}
      <div className={`p-4 border-t ${theme.borderMain}`}>
        <div className={`bg-slate-900/40 border ${theme.borderMain} rounded-2xl p-4 space-y-3`}>
          <div className="flex items-center gap-2">
            <Palette className={`w-4 h-4 ${theme.textAccent} shrink-0`} />
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Aesthetic Protocol</span>
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            {APP_THEMES.map((t) => {
              const bgColors: Record<string, string> = {
                midnight: "bg-indigo-600",
                emerald: "bg-emerald-600",
                oceanic: "bg-sky-500",
                rose: "bg-rose-500",
                amber: "bg-amber-500"
              };
              return (
                <button
                  key={t.id}
                  title={t.name}
                  onClick={() => onThemeChange(t.id)}
                  className={`h-6 rounded-lg transition-all cursor-pointer relative ${bgColors[t.id] || "bg-indigo-600"} ${
                    theme.id === t.id 
                      ? "ring-2 ring-white scale-110 shadow-lg" 
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  {theme.id === t.id && (
                    <div className="absolute inset-0 m-auto w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </button>
              );
            })}
          </div>
          <p className={`text-[10px] font-mono font-bold text-center uppercase tracking-wider ${theme.textAccent}`}>
            {theme.name}
          </p>
        </div>
      </div>

      {/* AI Agent Status Badge */}
      <div className={`p-4 border-t ${theme.borderMain}`}>
        <div className={`bg-slate-800/20 border ${theme.borderMain} rounded-2xl p-4 flex flex-col gap-3`}>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs font-mono font-medium text-slate-300">Agent Core Online</span>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-sans text-slate-400">
              <span>Operational Score</span>
              <span className="font-mono text-emerald-400 font-bold">{productivityScore}/100</span>
            </div>
            <div className="h-1.5 w-full bg-slate-700/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full transition-all duration-500" 
                style={{ width: `${productivityScore}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono mt-1">
            <Activity className="w-3 h-3 text-emerald-500" />
            <span>Gemini-3.5-Flash Active</span>
          </div>
        </div>
      </div>

      {/* User Session Profile & Logout */}
      {userEmail && (
        <div className={`p-4 border-t ${theme.borderMain} space-y-3`}>
          <div className="flex items-center gap-2.5 px-2">
            <div className={`w-8 h-8 rounded-full ${theme.bgAccentAlpha2} border ${theme.borderAccentAlpha} flex items-center justify-center ${theme.textAccent}`}>
              <User className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Active Operator</p>
              <p className="text-xs text-slate-300 font-medium truncate" title={userEmail}>
                {userEmail}
              </p>
            </div>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 hover:border-rose-500/20 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out Session</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
