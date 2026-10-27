export interface AssessmentItem {
  label: string;
  weight: string;
  description: string;
}

export interface CapstoneMilestone {
  week: number;
  label: string;
  description: string;
}

export const assessments: AssessmentItem[] = [
  {
    label: "Weekly Hands-On Labs",
    weight: "30%",
    description: "Hands-on implementation of core algorithms and vision pipelines across 15 weekly lab assignments.",
  },
  {
    label: "Midterm Exam",
    weight: "25%",
    description: "Comprehensive mid-semester evaluation covering mathematical foundations, camera geometry, and feature extraction.",
  },
  {
    label: "Capstone Project",
    weight: "35%",
    description: "Multi-stage team project building an end-to-end autonomous perception and state estimation pipeline.",
  },
  {
    label: "Participation & Quizzes",
    weight: "10%",
    description: "Active engagement in weekly lecture discussions, interactive Q&A, and short concept-check quizzes.",
  },
];

export const capstoneMilestones: CapstoneMilestone[] = [
  {
    week: 5,
    label: "Proposal",
    description: "Scope definition, dataset choice, and architectural outline for the capstone project.",
  },
  {
    week: 8,
    label: "Midterm Review",
    description: "Initial pipeline demo and feedback sync during midterm week.",
  },
  {
    week: 9,
    label: "Calibration & Baseline",
    description: "Functional baseline implementation with sensor calibration.",
  },
  {
    week: 12,
    label: "Localization & Mapping",
    description: "Full state estimation integration and evaluation against ground truth.",
  },
  {
    week: 15,
    label: "Final Presentation & Report",
    description: "Live demonstration, project poster presentation, and comprehensive final engineering report.",
  },
];

export const latePolicy = "Assignments submitted after the deadline incur a 10% deduction per day, up to a maximum of 3 days late. Submissions beyond 3 days late will receive no credit unless prior arrangements are approved by course staff.";
