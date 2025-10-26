// lib/focus/storage.ts
import { FocusSession, QuestProgress } from "./types";

const k = {
  sessions: "focus_sessions",
  xp: "focus_xp",
  coins: "focus_coins",
  blockMin: "focus_block_min",
  quests: "focus_quests_by_date",
};

const hasWindow = () => typeof window !== "undefined";
const ls = () => (hasWindow() ? window.localStorage : null);

const safeParse = <T>(raw: string | null, fallback: T): T => {
  try {
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const storage = {
  getSessions(): FocusSession[] {
    const store = ls();
    if (!store) return []; // SSR fallback
    return safeParse<FocusSession[]>(store.getItem(k.sessions), []);
  },
  saveSessions(s: FocusSession[]) {
    const store = ls();
    if (!store) return;
    store.setItem(k.sessions, JSON.stringify(s));
  },

  getXP(): number {
    const store = ls();
    if (!store) return 0;
    return Number(store.getItem(k.xp) ?? "0");
  },
  setXP(x: number) {
    const store = ls();
    if (!store) return;
    store.setItem(k.xp, String(Math.max(0, Math.floor(x))));
  },

  getCoins(): number {
    const store = ls();
    if (!store) return 0;
    return Number(store.getItem(k.coins) ?? "0");
  },
  setCoins(c: number) {
    const store = ls();
    if (!store) return;
    store.setItem(k.coins, String(Math.max(0, Math.floor(c))));
  },

  getBlockMin(): number {
    const store = ls();
    if (!store) return 25;
    return Number(store.getItem(k.blockMin) ?? "25");
  },
  setBlockMin(m: number) {
    const store = ls();
    if (!store) return;
    store.setItem(k.blockMin, String(m));
  },

  getQuestsFor(dateISO: string): QuestProgress[] {
    const store = ls();
    if (!store) return []; // SSR fallback
    const map = safeParse<Record<string, QuestProgress[]>>(
      store.getItem(k.quests),
      {}
    );
    return map[dateISO] ?? [];
  },
  setQuestsFor(dateISO: string, arr: QuestProgress[]) {
    const store = ls();
    if (!store) return;
    const map = safeParse<Record<string, QuestProgress[]>>(
      store.getItem(k.quests),
      {}
    );
    map[dateISO] = arr;
    store.setItem(k.quests, JSON.stringify(map));
  },
};
