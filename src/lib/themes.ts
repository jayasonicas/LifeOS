/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AppTheme {
  id: string;
  name: string;
  bgMain: string;          // Page body background
  bgSidebar: string;       // Sidebar background
  bgPanel: string;         // Card, content panel, form boxes background
  borderMain: string;      // General border color
  borderMuted: string;     // Lighter subtle borders
  textMain: string;        // Primary readable text (usually white or off-white)
  textMuted: string;       // Secondary description text
  textAccent: string;      // Color for highlighted text/labels
  textAccentMuted: string; // Subtle color for highlighted subtitles
  bgAccentAlpha: string;   // Alpha-bg of the accent (e.g. bg-indigo-600/10)
  bgAccentAlpha2: string;  // Slightly stronger alpha-bg (e.g. bg-indigo-600/15)
  borderAccentAlpha: string;// Alpha border (e.g. border-indigo-500/20)
  buttonAccent: string;    // Main buttons (e.g. bg-indigo-600 hover:bg-indigo-700)
  buttonAccentShadow: string; // Button shadow hover ring
  accentValue: string;     // Raw tailwind name (e.g., 'indigo', 'emerald')
  indicatorPulse: string;  // Pulse light on navigation active tabs
  chartColors: string[];   // Colors for data viz in analytics
}

export const APP_THEMES: AppTheme[] = [
  {
    id: "midnight",
    name: "Midnight Slate",
    bgMain: "bg-[#020617]",
    bgSidebar: "bg-slate-950/40",
    bgPanel: "bg-slate-900/50",
    borderMain: "border-slate-800",
    borderMuted: "border-slate-800/65",
    textMain: "text-slate-200",
    textMuted: "text-slate-400",
    textAccent: "text-indigo-400",
    textAccentMuted: "text-indigo-300",
    bgAccentAlpha: "bg-indigo-600/10",
    bgAccentAlpha2: "bg-indigo-600/15",
    borderAccentAlpha: "border-indigo-500/20",
    buttonAccent: "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white",
    buttonAccentShadow: "shadow-indigo-600/15 hover:shadow-indigo-600/20",
    accentValue: "indigo",
    indicatorPulse: "bg-indigo-400",
    chartColors: ["#6366f1", "#10b981", "#f59e0b", "#ef4444"]
  },
  {
    id: "emerald",
    name: "Emerald Cyber",
    bgMain: "bg-[#020d09]",
    bgSidebar: "bg-[#03140d]/40",
    bgPanel: "bg-emerald-950/20",
    borderMain: "border-emerald-900/30",
    borderMuted: "border-emerald-950/50",
    textMain: "text-emerald-100",
    textMuted: "text-emerald-500/80",
    textAccent: "text-emerald-400",
    textAccentMuted: "text-emerald-300",
    bgAccentAlpha: "bg-emerald-600/10",
    bgAccentAlpha2: "bg-emerald-600/15",
    borderAccentAlpha: "border-emerald-500/20",
    buttonAccent: "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white",
    buttonAccentShadow: "shadow-emerald-600/15 hover:shadow-emerald-600/20",
    accentValue: "emerald",
    indicatorPulse: "bg-emerald-400",
    chartColors: ["#10b981", "#34d399", "#f59e0b", "#6366f1"]
  },
  {
    id: "oceanic",
    name: "Oceanic Calm",
    bgMain: "bg-[#020c1b]",
    bgSidebar: "bg-[#03152a]/40",
    bgPanel: "bg-sky-950/20",
    borderMain: "border-sky-900/30",
    borderMuted: "border-sky-950/50",
    textMain: "text-sky-100",
    textMuted: "text-sky-500/80",
    textAccent: "text-sky-400",
    textAccentMuted: "text-sky-300",
    bgAccentAlpha: "bg-sky-600/10",
    bgAccentAlpha2: "bg-sky-600/15",
    borderAccentAlpha: "border-sky-500/20",
    buttonAccent: "bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white",
    buttonAccentShadow: "shadow-sky-600/15 hover:shadow-sky-600/20",
    accentValue: "sky",
    indicatorPulse: "bg-sky-400",
    chartColors: ["#0284c7", "#38bdf8", "#10b981", "#f59e0b"]
  },
  {
    id: "rose",
    name: "Rose Quartz",
    bgMain: "bg-[#0c0409]",
    bgSidebar: "bg-[#180812]/40",
    bgPanel: "bg-rose-950/20",
    borderMain: "border-rose-900/30",
    borderMuted: "border-rose-950/50",
    textMain: "text-rose-100",
    textMuted: "text-rose-500/80",
    textAccent: "text-rose-400",
    textAccentMuted: "text-rose-300",
    bgAccentAlpha: "bg-rose-600/10",
    bgAccentAlpha2: "bg-rose-600/15",
    borderAccentAlpha: "border-rose-500/20",
    buttonAccent: "bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white",
    buttonAccentShadow: "shadow-rose-600/15 hover:shadow-rose-600/20",
    accentValue: "rose",
    indicatorPulse: "bg-rose-400",
    chartColors: ["#e11d48", "#fda4af", "#10b981", "#f59e0b"]
  },
  {
    id: "amber",
    name: "Amber Oasis",
    bgMain: "bg-[#0b0601]",
    bgSidebar: "bg-[#160d03]/40",
    bgPanel: "bg-amber-950/20",
    borderMain: "border-amber-900/30",
    borderMuted: "border-amber-950/50",
    textMain: "text-amber-100",
    textMuted: "text-amber-600/80",
    textAccent: "text-amber-400",
    textAccentMuted: "text-amber-300",
    bgAccentAlpha: "bg-amber-600/10",
    bgAccentAlpha2: "bg-amber-600/15",
    borderAccentAlpha: "border-amber-500/20",
    buttonAccent: "bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white",
    buttonAccentShadow: "shadow-amber-600/15 hover:shadow-amber-600/20",
    accentValue: "amber",
    indicatorPulse: "bg-amber-400",
    chartColors: ["#d97706", "#fcd34d", "#10b981", "#6366f1"]
  }
];
