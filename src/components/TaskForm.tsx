/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { X, Save, Plus } from "lucide-react";
import { Task, Priority } from "../types";

interface TaskFormProps {
  task?: Task | null; // If present, we are in edit mode
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<Task, "id" | "createdAt" | "completed">) => void;
}

export default function TaskForm({ task, isOpen, onClose, onSave }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [estimatedEffort, setEstimatedEffort] = useState(2);

  // Sync state if editing a task
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setDeadline(task.deadline);
      setPriority(task.priority);
      setEstimatedEffort(task.estimatedEffort);
    } else {
      setTitle("");
      setDescription("");
      setDeadline("2026-06-28"); // default date close to TODAY_DATE (2026-06-26)
      setPriority("medium");
      setEstimatedEffort(2);
    }
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      title,
      description,
      deadline,
      priority,
      estimatedEffort: Number(estimatedEffort),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div 
        id="task-form-modal"
        className="bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-3xl w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div>
            <h3 className="font-sans font-bold text-lg text-white flex items-center gap-2">
              {task ? "Edit Operation" : "Authorize New Operation"}
            </h3>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              {task ? "Refine task requirements and constraints." : "Establish parameters for the AI Chief of Staff to analyze."}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-1">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">
              Operation Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Prepare for Data Science Exam"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-white text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all placeholder-slate-650"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">
              Operational Details / Instructions
            </label>
            <textarea
              placeholder="Provide a breakdown of what needs to be delivered..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-white text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all resize-none placeholder-slate-650"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Deadline */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">
                Target Deadline
              </label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all"
              />
            </div>

            {/* Estimated Effort */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">
                Scoped Effort (Hours)
              </label>
              <input
                type="number"
                required
                min={0.5}
                max={100}
                step={0.5}
                value={estimatedEffort}
                onChange={(e) => setEstimatedEffort(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider block">
              Operational Priority Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(["low", "medium", "high"] as Priority[]).map((level) => {
                const colors = {
                  low: "border-emerald-950/40 text-emerald-450 bg-emerald-950/20 dark:bg-emerald-950/20 border-emerald-900/40",
                  medium: "border-amber-950/40 text-amber-450 bg-amber-950/20 dark:bg-amber-950/20 border-amber-900/40",
                  high: "border-rose-950/40 text-rose-450 bg-rose-950/20 dark:bg-rose-950/20 border-rose-900/40",
                };
                const activeColors = {
                  low: "bg-emerald-600 text-white border-emerald-600",
                  medium: "bg-amber-600 text-white border-amber-600",
                  high: "bg-rose-600 text-white border-rose-600",
                };
                const isSelected = priority === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setPriority(level)}
                    className={`py-2.5 px-3 text-xs font-semibold rounded-xl border capitalize text-center transition-all cursor-pointer ${
                      isSelected ? activeColors[level] : `hover:bg-slate-800 ${colors[level]}`
                    }`}
                  >
                    {level} Priority
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 font-medium text-sm hover:bg-slate-800 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-lg shadow-indigo-600/15 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{task ? "Update Operation" : "Deploy Operation"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
