"use client";
import { useGame } from "@/components/app/GameProvider";
import { Badge as UIBadge } from "@/components/ui/badge";
export default function Achievements(){
  const { badges } = useGame();
  return (
    <div className="card-surface p-4 gradient-border">
      <div className="text-sm mb-2">Achievements</div>
      {badges.length===0 ? (
        <div className="text-xs text-muted-foreground">No badges yet — keep focusing!</div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {badges.map((b)=> <UIBadge key={b.id} variant="secondary">{b.label}</UIBadge>)}
        </div>
      )}
    </div>
  );
}
