/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Task, WeeklyTimeBlock, AIInsight, ProductivitySummary } from "./types";

export const INITIAL_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Prepare for Data Science Exam",
    description: "Review chapters 1-8, study multivariate regression, neural network backpropagation, and practice mock questions.",
    deadline: "2026-06-28",
    priority: "high",
    estimatedEffort: 8,
    completed: false,
    createdAt: "2026-06-24",
    riskLevel: "high",
    riskReason: "High-priority exam is only 2 days away. Requires 8 hours of dedicated focus blocks to fully prepare.",
    subtasks: [
      { id: "sub-1-1", title: "Review linear & multivariate regression mathematics", completed: true, estimatedEffort: 2, order: 1 },
      { id: "sub-1-2", title: "Practice backpropagation proofs and gradient descent", completed: false, estimatedEffort: 3, order: 2 },
      { id: "sub-1-3", title: "Take 2-hour practice exam and review error logs", completed: false, estimatedEffort: 3, order: 3 }
    ]
  },
  {
    id: "task-2",
    title: "Finalize Venture Pitch Deck",
    description: "Revise go-to-market slides, finalize financial models for Seed Round, and practice 5-minute presentation script.",
    deadline: "2026-06-29",
    priority: "high",
    estimatedEffort: 10,
    completed: false,
    createdAt: "2026-06-23",
    riskLevel: "medium",
    riskReason: "Pitch deck presentation is in 3 days. High effort (10h) requires prompt time-blocking.",
    subtasks: [
      { id: "sub-2-1", title: "Complete bottom-up financial forecasts for Year 1-3", completed: true, estimatedEffort: 4, order: 1 },
      { id: "sub-2-2", title: "Redesign slide layout and narrative transitions", completed: false, estimatedEffort: 3, order: 2 },
      { id: "sub-2-3", title: "Conduct 3 practice runs and capture audio recording", completed: false, estimatedEffort: 3, order: 3 }
    ]
  },
  {
    id: "task-3",
    title: "Update Software Engineering Portfolio",
    description: "Write case studies for recent full-stack applications, update screenshots, and deploy updated domain.",
    deadline: "2026-07-05",
    priority: "medium",
    estimatedEffort: 6,
    completed: false,
    createdAt: "2026-06-25",
    riskLevel: "safe",
    riskReason: "9 days remaining. Plenty of buffer time available for incremental development."
  },
  {
    id: "task-4",
    title: "Complete Internship Placement Report",
    description: "Write final summary of engineering contributions, gain approval from supervisor, and compile PDF deliverables.",
    deadline: "2026-06-27",
    priority: "high",
    estimatedEffort: 5,
    completed: false,
    createdAt: "2026-06-22",
    riskLevel: "high",
    riskReason: "Extremely critical. Deadline is tomorrow. 5 hours of intensive writing remains unfinished.",
    recoveryPlan: {
      revisedSchedule: "Block 08:00 AM - 11:00 AM for draft writing. Get supervisor review at 01:00 PM. Submit report by 04:00 PM.",
      catchUpActions: [
        "De-scope decorative elements; focus strictly on text bullet requirements.",
        "Mute notifications and use a single-browser tab to eliminate interruptions.",
        "Utilize the supervisor's template to skip structure styling."
      ],
      recommendations: "Begin writing directly in the final delivery doc instead of separate draft pads to save overhead.",
      generatedAt: "2026-06-26T08:00:00Z"
    }
  },
  {
    id: "task-5",
    title: "Practice System Design Scenarios",
    description: "Tackle horizontal scaling, load balancing, caching strategies, and database sharding architectures.",
    deadline: "2026-06-25",
    priority: "medium",
    estimatedEffort: 4,
    completed: true,
    createdAt: "2026-06-20",
    completedAt: "2026-06-25T17:30:00Z",
    riskLevel: "safe",
    riskReason: "Operation completed on-schedule."
  },
  {
    id: "task-6",
    title: "Refactor API Gateway Services",
    description: "Clean up express routing, fix rate-limiting middleware, and write unit tests for request proxy handlers.",
    deadline: "2026-06-26",
    priority: "low",
    estimatedEffort: 3,
    completed: true,
    createdAt: "2026-06-24",
    completedAt: "2026-06-26T10:15:00Z",
    riskLevel: "safe",
    riskReason: "Completed successfully ahead of the daily review."
  }
];

export const INITIAL_SCHEDULE: WeeklyTimeBlock[] = [
  {
    id: "block-1",
    day: "Monday",
    time: "09:00 AM - 11:00 AM",
    taskId: "task-1",
    taskTitle: "Prepare for Data Science Exam",
    activity: "Linear algebra derivations and multi-variable regression reviews."
  },
  {
    id: "block-2",
    day: "Tuesday",
    time: "01:00 PM - 03:00 PM",
    taskId: "task-2",
    taskTitle: "Finalize Venture Pitch Deck",
    activity: "Detailing revenue streams and pricing sheets on slide 12."
  },
  {
    id: "block-3",
    day: "Wednesday",
    time: "10:00 AM - 12:00 PM",
    taskId: "task-4",
    taskTitle: "Complete Internship Placement Report",
    activity: "Assembling structural logs and outline bullets."
  },
  {
    id: "block-4",
    day: "Thursday",
    time: "03:00 PM - 05:00 PM",
    taskId: "task-1",
    taskTitle: "Prepare for Data Science Exam",
    activity: "Backpropagation drills and mathematical gradient descent mocks."
  },
  {
    id: "block-5",
    day: "Friday",
    time: "09:00 AM - 11:30 AM",
    taskId: "task-2",
    taskTitle: "Finalize Venture Pitch Deck",
    activity: "Presentation delivery check and voice script pitch practice."
  }
];

export const INITIAL_INSIGHTS: AIInsight[] = [
  {
    id: "ins-1",
    type: "warning",
    title: "Critical Overdue Risk Detected",
    text: "Your Internship Placement Report is due tomorrow (June 27) and has 5 hours of estimated effort. Immediate focus is necessary.",
    taskId: "task-4"
  },
  {
    id: "ins-2",
    type: "tip",
    title: "Breakdown Advantage",
    text: "Preparing for the Data Science Exam requires 8 hours of work. Running the AI Breakdown Agent will isolate 3 distinct study stages.",
    taskId: "task-1"
  },
  {
    id: "ins-3",
    type: "success",
    title: "Operational Velocity High",
    text: "Completed 'Practice System Design' and 'Refactor API Gateway' on time. This maintains your core baseline above 80%.",
  },
  {
    id: "ins-4",
    type: "info",
    title: "Cognitive Clock Analysis",
    text: "Chronological patterns indicate you resolve high-priority conceptual tasks 35% faster when scheduled between 08:30 AM and 11:30 AM.",
  }
];

export const INITIAL_COACH_SUMMARY: ProductivitySummary = {
  productivityScore: 84,
  completionRate: 33,
  advice: "You are exhibiting superb task description quality and consistent effort breakdowns. However, critical high-priority items like reports and decks are currently clustered near their deadline horizons. We advise front-loading high-effort analytical tasks early in the week to maintain safe risk levels.",
  strengths: [
    "High accuracy in effort scoping and prioritization",
    "Consistently completes low-effort technical tasks on schedule"
  ],
  improvementAreas: [
    "Susceptible to crunch windows on complex papers or reports",
    "Underutilizes middle days (Wednesdays/Thursdays) for high-impact focus"
  ],
  optimalWorkTime: "Morning Hyper-focus (08:30 AM - 11:30 AM)"
};
