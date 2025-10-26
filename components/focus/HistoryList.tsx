"use client";
import { useGame } from "@/components/app/GameProvider";
import { Button } from "@/components/ui/button";
export default function HistoryList(){
  const { sessions, deleteSession } = useGame();
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(sessions, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `focus-overload-${new Date().toISOString().slice(0,10)}.json`; a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="card-surface p-4 gradient-border">
      <div className="flex items-center justify-between">
        <div className="text-sm">History</div>
        <Button size="sm" variant="secondary" onClick={exportJSON}>Export JSON</Button>
      </div>
      <div className="mt-3 space-y-2 max-h-[420px] overflow-auto pr-1">
        {sessions.slice().reverse().map((s)=>(
          <div key={s.id} className="rounded-xl border border-border p-3 bg-muted/40">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-medium">{s.category}{s.subcategory ? ` — ${s.subcategory}` : ""}</div>
              <div className="text-xs text-muted-foreground">{new Date(s.startedAt).toLocaleString()}</div>
            </div>
            <div className="text-xs mt-1">
              Duration: {Math.round(s.durationMs/60000)} min
              {s.metricLabel && typeof s.metricValue === "number" ? ` • ${s.metricValue} ${s.metricLabel}` : ""}
            </div>
            {s.notes && <div className="text-xs text-muted-foreground mt-1">{s.notes}</div>}
            <div className="mt-2"><Button size="sm" variant="destructive" onClick={()=>deleteSession(s.id)}>Delete</Button></div>
          </div>
        ))}
        {sessions.length===0 && <div className="text-xs text-muted-foreground">No sessions yet.</div>}
      </div>
    </div>
  );
}
