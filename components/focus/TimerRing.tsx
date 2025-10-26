"use client";
import { motion } from "framer-motion";

type Props = { size?: number; stroke?: number; progress: number; label: string; sub?: string; };
export default function TimerRing({ size=220, stroke=10, progress, label, sub }: Props){
  const r = (size - stroke)/2;
  const c = 2 * Math.PI * r;
  const dash = c * (progress||0);
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} stroke="hsl(240 6% 16%)" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size/2} cy={size/2} r={r} stroke="url(#grad)" strokeWidth={stroke} fill="none" strokeLinecap="round"
          initial={{ strokeDasharray: `${dash} ${c}` }}
          animate={{ strokeDasharray: `${dash} ${c}` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="text-3xl font-semibold">{label}</div>
          {sub ? <div className="text-xs text-muted-foreground mt-1">{sub}</div> : null}
        </div>
      </div>
    </div>
  );
}
