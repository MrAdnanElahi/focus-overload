"use client";
import Chart14 from "@/components/focus/Chart14";
import KpiCard from "@/components/focus/KpiCard";
import Achievements from "@/components/focus/Achievements";
import { useGame } from "@/components/app/GameProvider";
import { groupByDay, calcStreak, xpToLevel } from "@/lib/focus/math";
import { useMemo } from "react";

export default function Page() {
  const { sessions, xp } = useGame();
  const dayMap = useMemo(() => groupByDay(sessions), [sessions]);
  const todayISO = new Date().toISOString().slice(0,10);
  const yesterdayISO = new Date(Date.now()-86400000).toISOString().slice(0,10);
  const todayMin = dayMap[todayISO] ?? 0;
  const yesterdayMin = dayMap[yesterdayISO] ?? 0;
  const days = Object.values(dayMap);
  const avg7 = days.length===0 ? 0 : Math.round(days.slice(-7).reduce((a,b)=>a+b,0) / Math.min(7, days.length));
  const streak = calcStreak(dayMap);
  const { level, curr, next, pct } = xpToLevel(xp);
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard title="Today vs Yesterday" value={`${todayMin}m`} sub={`${yesterdayMin}m yesterday`} />
        <KpiCard title="7-Day Average" value={`${avg7}m`} />
        <KpiCard title="Streak" value={`${streak} days`} />
        <KpiCard title={`Level ${level}`} value={`${Math.floor((pct||0)*100)}%`} sub={`${curr}/${next} XP`} progress={pct} />
      </div>
      <Chart14 />
      <Achievements />
    </div>
  );
}
