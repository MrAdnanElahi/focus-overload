"use client";
import { useMemo } from "react";
import { useGame } from "@/components/app/GameProvider";
import { groupByDay, rollingAverage } from "@/lib/focus/math";
import { ResponsiveContainer, ComposedChart, XAxis, YAxis, Tooltip, Bar, Line } from "recharts";

export default function Chart14(){
  const { sessions } = useGame();
  const data = useMemo(()=>{
    const map = groupByDay(sessions);
    const days: { day:string; min:number }[] = [];
    for (let i=13;i>=0;i--){
      const d = new Date(Date.now() - i*86400000);
      const iso = d.toISOString().slice(0,10);
      days.push({ day: iso.slice(5), min: map[iso] ?? 0 });
    }
    const avg = rollingAverage(days.map(d=>d.min), 7);
    return days.map((d,i)=>({ ...d, avg: avg[i] }));
  }, [sessions]);
  return (
    <div className="card-surface p-4 gradient-border">
      <div className="text-sm mb-2">Last 14 Days</div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <XAxis dataKey="day" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="min" />
            <Line type="monotone" dataKey="avg" dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
