export type FocusCategory = "Study" | "Work" | "Skill" | "Exercise" | "Other";

export interface FocusSession {
  id: string;
  category: FocusCategory;
  subcategory?: string;
  notes?: string;
  metricLabel?: string;
  metricValue?: number;
  durationMs: number;
  startedAt: number;
}

export interface QuestDef {
  id: string;
  label: string;
  reward: number;
  goalMin?: number;
  goal?: "beat_yesterday" | "streak_3";
}

export interface QuestProgress {
  id: string;
  completed: boolean;
  claimed: boolean;
}

export interface Badge {
  id: string;
  label: string;
  condition: (ctx: {
    totalMinutes: number;
    sessionsCount: number;
    streak: number;
    bestDayMinutes: number;
  }) => boolean;
}
