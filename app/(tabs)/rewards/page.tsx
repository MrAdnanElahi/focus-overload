"use client";
import { useGame } from "@/components/app/GameProvider";
import { Progress } from "@/components/ui/progress";
import { xpToLevel } from "@/lib/focus/math";
import { DAILY_QUESTS } from "@/lib/focus/quests";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  const { xp, coins, questState, claimQuest, progressForQuest } = useGame();
  const { level, curr, next, pct } = useMemo(()=>xpToLevel(xp), [xp]);
  return (
    <div className="grid gap-6">
      <section className="card-surface p-6 gradient-border">
        <h2 className="text-xl font-semibold mb-3">Your Stats</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <Stat label="Level" value={`Lv ${level}`} />
          <Stat label="XP" value={`${xp}`} />
          <Stat label="Coins" value={`${coins}`} />
        </div>
        <div className="mt-4">
          <div className="text-xs mb-1">Level Progress</div>
          <Progress value={(pct||0)*100} />
          <div className="text-xs text-muted-foreground mt-1">{curr} / {next} XP</div>
        </div>
      </section>

      <section className="card-surface p-6 gradient-border">
        <h2 className="text-xl font-semibold">Daily Quests</h2>
        <p className="text-sm text-muted-foreground mb-4">Complete quests to earn bonus XP & coins.</p>
        <div className="grid gap-3">
          {DAILY_QUESTS.map((q)=>{
            const prog = progressForQuest(q);
            const state = questState.find((x)=>x.id===q.id);
            const done = !!state?.completed;
            const claimed = !!state?.claimed;
            return (
              <div key={q.id} className="rounded-xl border border-border p-4 bg-muted/40">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium">{q.label}</div>
                    <div className="text-xs text-muted-foreground">{prog.text}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs">+{q.reward} XP</div>
                    <Button size="sm" variant={claimed ? "secondary" : done ? "default" : "secondary"} disabled={!done || claimed} onClick={()=>claimQuest(q)}>
                      {claimed ? "Claimed" : done ? "Claim Reward" : "In Progress"}
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <Separator className="my-4" />
        <div className="text-xs text-muted-foreground">Tip: Keep streaks and beat yesterday to auto-complete some quests.</div>
      </section>
    </div>
  );
}

function Stat({label, value}:{label:string; value:string}){
  return (
    <div className="rounded-xl border border-border p-4 bg-muted/40">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}
