/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";
import { Task } from "../types";
import { 
  BarChart2, 
  PieChart as PieIcon, 
  TrendingUp, 
  Layers 
} from "lucide-react";

interface AnalyticsPanelProps {
  tasks: Task[];
}

export default function AnalyticsPanel({ tasks }: AnalyticsPanelProps) {
  // 1. Calculate Priority distribution
  const priorities = tasks.reduce(
    (acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    },
    { low: 0, medium: 0, high: 0 } as Record<string, number>
  );

  const priorityData = [
    { name: "Low", count: priorities.low, fill: "#10b981" },
    { name: "Medium", count: priorities.medium, fill: "#f59e0b" },
    { name: "High", count: priorities.high, fill: "#f43f5e" }
  ];

  // 2. Calculate Risk distribution
  const risks = tasks.reduce(
    (acc, task) => {
      if (!task.completed) {
        const level = task.riskLevel || "safe";
        acc[level] = (acc[level] || 0) + 1;
      } else {
        acc.completed = (acc.completed || 0) + 1;
      }
      return acc;
    },
    { safe: 0, medium: 0, high: 0, completed: 0 } as Record<string, number>
  );

  const riskData = [
    { name: "Safe", value: risks.safe, color: "#10b981" },
    { name: "Medium Risk", value: risks.medium, color: "#f59e0b" },
    { name: "High Risk", value: risks.high, color: "#f43f5e" },
    { name: "Completed", value: risks.completed, color: "#6366f1" }
  ].filter(d => d.value > 0);

  // 3. Mock weekly trend data based on tasks
  const weeklyTrends = [
    { name: "Mon", Completed: 1, Active: 3 },
    { name: "Tue", Completed: 2, Active: 4 },
    { name: "Wed", Completed: 3, Active: 3 },
    { name: "Thu", Completed: 4, Active: 5 },
    { name: "Fri", Completed: tasks.filter(t => t.completed).length, Active: tasks.filter(t => !t.completed).length },
    { name: "Sat", Completed: tasks.filter(t => t.completed).length, Active: Math.max(1, tasks.filter(t => !t.completed).length - 1) },
    { name: "Sun", Completed: tasks.filter(t => t.completed).length + 1, Active: Math.max(0, tasks.filter(t => !t.completed).length - 2) },
  ];

  return (
    <div className="space-y-6">
      {/* Visual Analytics grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weekly Progress Trends */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-sans font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              Weekly Operational Trend
            </h4>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Cycle Velocity</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: "10px", marginTop: "10px" }} />
                <Area type="monotone" dataKey="Completed" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorCompleted)" />
                <Area type="monotone" dataKey="Active" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorActive)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Spread */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-sans font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-amber-500" />
              Priority Allocation Spread
            </h4>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Urgency Distribution</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: "transparent" }} contentStyle={{ borderRadius: "12px", border: "none" }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={45}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Classification Pie Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h4 className="font-sans font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-emerald-500" />
              Deadline Risk Classification (Active vs Completed)
            </h4>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Operational Security</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="h-48 md:col-span-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Legends list */}
            <div className="space-y-3 font-sans text-xs">
              {riskData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-50 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/20">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-medium text-slate-700 dark:text-slate-300">{item.name}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-100">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
