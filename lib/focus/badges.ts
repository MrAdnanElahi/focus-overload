import { Badge } from "./types";
export const BADGES: Badge[] = [
  { id: "streak_3", label: "🔥 3-Day Streak", condition: ({ streak }) => streak >= 3 },
  { id: "hour_club", label: "⏱️ 1 Hour Club", condition: ({ totalMinutes }) => totalMinutes >= 60 },
  { id: "ten_sessions", label: "🎯 10 Sessions", condition: ({ sessionsCount }) => sessionsCount >= 10 },
  { id: "beast_day_180", label: "💪 3-Hour Beast", condition: ({ bestDayMinutes }) => bestDayMinutes >= 180 },
];
