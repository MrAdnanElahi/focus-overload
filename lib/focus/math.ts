import { FocusSession } from "./types";

export function toDateISO(ms: number): string {
  const d = new Date(ms);
  const y = d.getFullYear();
  const m = `${d.getMonth()+1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function groupByDay(sessions: FocusSession[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const s of sessions) {
    const k = toDateISO(s.startedAt);
    // was Math.round(s.durationMs / 60000)
    map[k] = (map[k] ?? 0) + Math.ceil(s.durationMs / 60000);
  }
  return map;
}


export function rollingAverage(values: number[], windowSize: number): number[] {
  const out: number[] = []; let sum = 0;
  for (let i=0;i<values.length;i++){
    sum += values[i];
    if (i>=windowSize) sum -= values[i-windowSize];
    const denom = i+1 < windowSize ? i+1 : windowSize;
    out.push(Number((sum/denom).toFixed(2)));
  }
  return out;
}

export function calcStreak(dayMap: Record<string, number>): number {
  const today = toDateISO(Date.now());
  const toMs = (iso: string) => new Date(iso + "T00:00:00").getTime();
  let streak = 0;
  for (let i=0;;i++){
    const d = new Date(toMs(today) - i*86400000);
    const iso = toDateISO(d.getTime());
    if ((dayMap[iso] ?? 0) > 0) streak++; else break;
  }
  return streak;
}

export function xpToLevel(xp: number): { level:number; curr:number; next:number; pct:number } {
  let level = 0; let need = 100; let acc = 0;
  while (xp >= acc + need){ acc += need; level++; need = 100*(level+1); }
  const curr = xp - acc; const next = need; const pct = next ? Math.min(1, curr/next) : 1;
  return { level, curr, next, pct };
}

export function earnedXPForSession(durationMs: number): number {
  const minutes = durationMs/60000;
  return Math.floor((minutes/25)*10);
}
export function earnedCoinsForSession(durationMs: number): number {
  const minutes = durationMs/60000;
  return Math.floor(minutes/25);
}
