/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  estimatedEffort: number; // in hours
  order: number;
}

export interface RecoveryPlan {
  revisedSchedule: string;
  catchUpActions: string[];
  recommendations: string;
  generatedAt: string;
}

export type Priority = 'low' | 'medium' | 'high';
export type RiskLevel = 'safe' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string; // YYYY-MM-DD
  priority: Priority;
  estimatedEffort: number; // in hours
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  
  // AI-generated attributes
  riskLevel?: RiskLevel;
  riskReason?: string;
  subtasks?: Subtask[];
  recoveryPlan?: RecoveryPlan;
}

export interface WeeklyTimeBlock {
  id: string;
  day: string; // 'Monday', 'Tuesday', etc.
  time: string; // e.g., '09:00 AM - 11:00 AM'
  taskId: string;
  taskTitle: string;
  activity: string;
}

export interface AIInsight {
  id: string;
  type: 'warning' | 'tip' | 'info' | 'success';
  title: string;
  text: string;
  taskId?: string;
}

export interface ProductivitySummary {
  productivityScore: number; // 0 - 100
  completionRate: number; // percentage
  advice: string;
  strengths: string[];
  improvementAreas: string[];
  optimalWorkTime: string; // e.g. "Morning (8 AM - 11 AM)"
}

export interface CalendarIntegrationConfig {
  enabled: boolean;
  syncDirections: 'two-way' | 'push-only' | 'pull-only';
  targetCalendarId: string;
  lastSyncedAt?: string;
}
