import { QuestDef } from "./types";
export const DAILY_QUESTS: QuestDef[] = [
  { id: "focus_60", goalMin: 60, reward: 20, label: "Focus 60 minutes today" },
  { id: "beat_yesterday", goal: "beat_yesterday", reward: 30, label: "Beat yesterday’s time" },
  { id: "streak_3", goal: "streak_3", reward: 50, label: "Maintain 3-day streak" },
];
