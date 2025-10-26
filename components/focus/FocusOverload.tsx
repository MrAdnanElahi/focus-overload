"use client";

import React, { useEffect, useRef, useState } from "react";
import TimerRing from "./TimerRing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGame } from "@/components/app/GameProvider";
import { FocusSession, FocusCategory } from "@/lib/focus/types";
import { storage } from "@/lib/focus/storage";
import { motion } from "framer-motion";

const CATEGORIES: FocusCategory[] = ["Study", "Work", "Skill", "Exercise", "Other"];
const BLOCKS = [25, 45, 55, 60];

export default function FocusOverload() {
  const { addSession, blockMin, setBlockMin } = useGame();

  const [category, setCategory] = useState<FocusCategory>("Study");
  const [subcategory, setSubcategory] = useState("");
  const [notes, setNotes] = useState("");
  const [metricLabel, setMetricLabel] = useState("");
  const [metricValue, setMetricValue] = useState<number | "">("");

  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [targetMin, setTargetMin] = useState(blockMin);

  // ---- Timestamp-based bookkeeping (robust across background tabs) ----
  const [baseMs, setBaseMs] = useState(0); // accumulated ms from previous segments
  const [startedAt, setStartedAt] = useState<number | null>(null); // start time of current segment
  const [now, setNow] = useState(Date.now()); // ticks to trigger re-render

  // derived; always correct even if tab was hidden or machine slept
  const elapsed = baseMs + (running && !paused && startedAt ? now - startedAt : 0);

  // sounds (optional)
  const soundStart = useRef<HTMLAudioElement | null>(null);
  const soundEnd = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    soundStart.current = new Audio("data:audio/mp3;base64,//uQZAAAAAAAAAAAAAAAAAAAA");
    soundEnd.current = new Audio("data:audio/mp3;base64,//uQZAAAAAAAAAAAAAAAAAAAA");
  }, []);

  useEffect(() => setTargetMin(blockMin), [blockMin]);

  // restore a few last selections
  useEffect(() => {
    const s = localStorage.getItem("fo_last_form");
    if (s) {
      try {
        const j = JSON.parse(s);
        if (j.category) setCategory(j.category);
        if (j.subcategory) setSubcategory(j.subcategory);
        if (j.metricLabel) setMetricLabel(j.metricLabel);
      } catch {}
    }
  }, []);
  useEffect(() => {
    localStorage.setItem(
      "fo_last_form",
      JSON.stringify({ category, subcategory, metricLabel })
    );
  }, [category, subcategory, metricLabel]);

  // display values
  const targetMs = targetMin * 60000;
  const remain = Math.max(0, targetMs - elapsed);
  const progress = Math.min(1, elapsed / targetMs) || 0;
  const label = msToClock(remain);
  const sub = running ? (paused ? "Paused" : "Focusing…") : "Ready";

  // tick "now" every second and on visibility/focus changes
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const id = window.setInterval(tick, 1000);
    const vis = () => setNow(Date.now());
    document.addEventListener("visibilitychange", vis);
    window.addEventListener("focus", vis);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", vis);
      window.removeEventListener("focus", vis);
    };
  }, []);

  const MIN_SAVE_MS = 5_000; // set 0 to always save (even ultra-short sessions)

  const start = () => {
    setBaseMs(0);
    setStartedAt(Date.now());
    setRunning(true);
    setPaused(false);
    soundStart.current?.play().catch(() => {});
    setNow(Date.now()); // immediate render
  };

  const pause = () => {
    if (!running || paused) return;
    const curr = baseMs + (startedAt ? Date.now() - startedAt : 0);
    setBaseMs(curr);
    setStartedAt(null);
    setPaused(true);
    setNow(Date.now());
  };

  const resume = () => {
    if (!running || !paused) return;
    setStartedAt(Date.now());
    setPaused(false);
    setNow(Date.now());
  };

  const reset = () => {
    setRunning(false);
    setPaused(false);
    setBaseMs(0);
    setStartedAt(null);
    setNow(Date.now());
  };

  const stop = () => {
    if (!running) return;
    const dur = baseMs + (startedAt ? Date.now() - startedAt : 0);

    setRunning(false);
    setPaused(false);
    setBaseMs(0);
    setStartedAt(null);
    setNow(Date.now());

    if (dur >= MIN_SAVE_MS) {
      const session: FocusSession = {
        id: crypto.randomUUID(),
        category,
        subcategory: subcategory || undefined,
        notes: notes || undefined,
        metricLabel: metricLabel || undefined,
        metricValue: metricValue === "" ? undefined : Number(metricValue),
        durationMs: dur,
        startedAt: Date.now(),
      };
      const next = [...storage.getSessions(), session];
      storage.saveSessions(next);
      addSession(session);

      window.dispatchEvent(
        new CustomEvent("fo:session-saved", { detail: { durationMs: dur } })
      );
      soundEnd.current?.play().catch(() => {});
    } else {
      // optional: comment out if you don't want feedback
      // alert("Session too short to save.");
    }
  };

  return (
    <div className="card-surface p-5 pb-7 md:pb-8 gradient-border overflow-hidden">
      <div className="flex items-start gap-5">
        <div className="shrink-0">
          <TimerRing progress={progress} label={label} sub={sub} />
        </div>

        <div className="grow grid gap-4">
          {/* Category / subcategory */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Category</Label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="mt-1 w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm appearance-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-xs">Subcategory</Label>
              <Input
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                placeholder="e.g., Algorithms"
                className="mt-1"
              />
            </div>
          </div>

          {/* Block length + metric fields (stacked) */}
          <div className="flex flex-col gap-3">
            <div>
              <Label className="text-xs">Block Length</Label>
              <select
                value={targetMin}
                onChange={(e) => {
                  const m = Number(e.target.value);
                  setTargetMin(m);
                  setBlockMin(m);
                }}
                className="mt-1 w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm appearance-none"
              >
                {BLOCKS.map((m) => (
                  <option key={m} value={m}>
                    {m} min
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-xs">Metric Label (optional)</Label>
              <Input
                value={metricLabel}
                onChange={(e) => setMetricLabel(e.target.value)}
                placeholder="pages / tasks / reps"
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-xs">Value</Label>
              <Input
                type="number"
                value={metricValue}
                onChange={(e) =>
                  setMetricValue(e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder="10"
                className="mt-1"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label className="text-xs">Notes</Label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What will you do this block?"
              className="mt-1 w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm h-20"
            />
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {!running && (
              <Button onClick={start} className="px-5">
                Start
              </Button>
            )}

            {running && !paused && (
              <Button variant="secondary" onClick={pause}>
                Pause
              </Button>
            )}

            {running && paused && <Button onClick={resume}>Resume</Button>}

            {running && (
              <Button
                onClick={stop}
                className="bg-gradient-to-r from-sky-500 to-violet-500 text-white hover:opacity-95 shadow-soft"
              >
                Complete Session
              </Button>
            )}

            <Button variant="secondary" onClick={reset}>
              Reset
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-muted-foreground"
          >
            XP = (minutes / 25) × 10 • Coins = (minutes / 25) × 1
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function msToClock(ms: number) {
  const m = Math.max(0, Math.floor(ms / 60000));
  const s = Math.max(0, Math.floor((ms % 60000) / 1000));
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
