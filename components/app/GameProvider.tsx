"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { storage } from "@/lib/focus/storage";
import { FocusSession, QuestDef, QuestProgress } from "@/lib/focus/types";
import { earnedCoinsForSession, earnedXPForSession, groupByDay, toDateISO, calcStreak } from "@/lib/focus/math";
import { DAILY_QUESTS } from "@/lib/focus/quests";
import { BADGES } from "@/lib/focus/badges";

type GameCtx = {
  sessions: FocusSession[];
  addSession: (s: FocusSession) => void;
  deleteSession: (id: string) => void;
  xp: number;
  coins: number;
  setBlockMin: (m: number) => void;
  blockMin: number;
  questState: QuestProgress[];
  claimQuest: (q: QuestDef) => void;
  progressForQuest: (q: QuestDef) => { pct: number; text: string };
  badges: { id: string; label: string }[];
};
const Ctx = createContext<GameCtx | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [xp, setXP] = useState<number>(0);
  const [coins, setCoins] = useState<number>(0);
  const [blockMin, setBlockMinState] = useState<number>(25);

  useEffect(() => {
    setSessions(storage.getSessions());
    setXP(storage.getXP());
    setCoins(storage.getCoins());
    setBlockMinState(storage.getBlockMin());
  }, []);

  useEffect(() => storage.saveSessions(sessions), [sessions]);
  useEffect(() => storage.setXP(xp), [xp]);
  useEffect(() => storage.setCoins(coins), [coins]);
  const setBlockMin = (m: number) => { setBlockMinState(m); storage.setBlockMin(m); };

  useEffect(() => {
    const onSaved = (e: Event) => {
      const any = e as CustomEvent<{ durationMs: number }>;
      const x = earnedXPForSession(any.detail.durationMs);
      const c = earnedCoinsForSession(any.detail.durationMs);
      setXP((v) => v + x);
      setCoins((v) => v + c);
    };
    window.addEventListener("fo:session-saved", onSaved as EventListener);
    return () => window.removeEventListener("fo:session-saved", onSaved as EventListener);
  }, []);

  const addSession = (s: FocusSession) => setSessions((arr) => [...arr, s]);
  const deleteSession = (id: string) => setSessions((arr) => {
    const removed = arr.find((a)=>a.id===id);
    if (removed){
      setXP((v)=>Math.max(0, v - earnedXPForSession(removed.durationMs)));
      setCoins((v)=>Math.max(0, v - earnedCoinsForSession(removed.durationMs)));
    }
    return arr.filter((a)=>a.id!==id);
  });

  const todayISO = toDateISO(Date.now());
  const yesterdayISO = toDateISO(Date.now()-86400000);
  const dayMap = useMemo(()=>groupByDay(sessions), [sessions]);
  const streak = useMemo(()=>calcStreak(dayMap), [dayMap]);
  const todayMin = dayMap[todayISO] ?? 0;
  const yesterdayMin = dayMap[yesterdayISO] ?? 0;

  const questState = useMemo<QuestProgress[]>(() => {
    const existing = storage.getQuestsFor(todayISO);
    if (existing.length === 0) {
      const base = DAILY_QUESTS.map((q)=>({ id: q.id, completed: false, claimed: false }));
      storage.setQuestsFor(todayISO, base);
      return base;
    }
    return existing;
  }, [todayISO]);

  useEffect(() => {
    const updated = questState.map((qp) => {
      const def = DAILY_QUESTS.find((q)=>q.id===qp.id)!;
      let completed = qp.completed;
      if (def.goalMin != null) completed = todayMin >= def.goalMin;
      if (def.goal === "beat_yesterday") completed = todayMin > yesterdayMin;
      if (def.goal === "streak_3") completed = streak >= 3;
      return { ...qp, completed };
    });
    storage.setQuestsFor(todayISO, updated);
  }, [todayISO, questState, todayMin, yesterdayMin, streak]);

  const claimQuest = (q: QuestDef) => {
    const arr = storage.getQuestsFor(todayISO);
    const idx = arr.findIndex((x)=>x.id===q.id);
    if (idx === -1) return;
    const item = arr[idx];
    if (!item.completed || item.claimed) return;
    arr[idx] = { ...item, claimed: true };
    storage.setQuestsFor(todayISO, arr);
    setXP((v)=>v + q.reward);
    setCoins((v)=>v + Math.floor(q.reward/10));
  };

  const progressForQuest = (q: QuestDef) => {
    if (q.goalMin != null){
      const pct = Math.min(1, (todayMin)/(q.goalMin));
      return { pct, text: `${todayMin}/${q.goalMin} min` };
    }
    if (q.goal === "beat_yesterday"){
      const pct = yesterdayMin===0 ? (todayMin>0?1:0) : Math.min(1, todayMin/(yesterdayMin+1));
      return { pct, text: `${todayMin} vs ${yesterdayMin} min` };
    }
    if (q.goal === "streak_3"){
      const pct = Math.min(1, streak/3);
      return { pct, text: `${streak}/3 days` };
    }
    return { pct: 0, text: "" };
  };

  const badges = useMemo(()=>{
    const totals = Object.values(dayMap);
    const totalMinutes = totals.reduce((a,b)=>a+b, 0);
    const bestDayMinutes = totals.length ? Math.max(...totals) : 0;
    const sessionsCount = sessions.length;
    return BADGES.filter((b)=>b.condition({ totalMinutes, sessionsCount, streak, bestDayMinutes }))
                 .map((b)=>({ id: b.id, label: b.label }));
  }, [dayMap, sessions, streak]);

  const value: GameCtx = {
    sessions, addSession, deleteSession,
    xp, coins, setBlockMin, blockMin,
    questState,
    claimQuest, progressForQuest, badges,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useGame(){ const ctx = useContext(Ctx); if(!ctx) throw new Error("useGame must be inside GameProvider"); return ctx; }
