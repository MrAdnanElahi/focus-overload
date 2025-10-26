"use client";
export function Progress({ value=0 }:{ value:number }){
  return (
    <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
      <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}
export default Progress;
