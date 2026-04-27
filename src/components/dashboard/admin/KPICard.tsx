"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion, animate } from "framer-motion";

interface KPICardProps {
  name: string;
  value: string;
  numericValue: number;
  icon: React.ElementType;
  change: string;
  changeType: "increase" | "decrease";
  color: string;
  colorHex: string;
}

const KPICard = ({
  name,
  numericValue,
  icon: Icon,
  change,
  changeType,
  color,
  colorHex
}: KPICardProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const controls = animate(0, numericValue, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (latest) => setCount(Math.floor(latest)),
    });
    return () => controls.stop();
  }, [numericValue]);

  // Simple Sparkline Data (MOCK 7 days)
  const sparkData = [30, 45, 35, 50, 40, 60, 55];
  const max = Math.max(...sparkData);
  const min = Math.min(...sparkData);
  const range = max - min;
  
  const points = sparkData.map((d, i) => {
    const x = (i / (sparkData.length - 1)) * 100;
    const y = 40 - ((d - min) / range) * 30; // Scale to 40px height
    return `${x},${y}`;
  }).join(" ");

  return (
    <motion.div
      whileHover={{ translateY: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-[#0B1C3D]/50 backdrop-blur-xl border border-slate-100 dark:border-white/5 p-6 rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] relative overflow-hidden group border-l-[4px]"
      style={{ borderLeftColor: colorHex }}
    >
      <div className="flex items-start justify-between mb-6">
        <div className={cn("p-3 rounded-2xl bg-opacity-10", color.replace('bg-', 'bg-opacity-10 text-'))} style={{ backgroundColor: `${colorHex}15`, color: colorHex }}>
          <Icon className="w-6 h-6" />
        </div>
        <div className={cn(
          "flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black tracking-tight",
          changeType === "increase" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
        )}>
          {change} {changeType === "increase" ? "↑" : "↓"}
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.2em]">
          {name}
        </p>
        <h2 className="text-[2.5rem] font-bold text-[#1A1A2E] dark:text-white leading-none tracking-tighter">
          {numericValue > 1000 ? count.toLocaleString() : count}{name.includes('Taux') ? '%' : ''}
          {name.includes('MRR') && <span className="text-sm ml-1 font-medium text-slate-400">FCFA</span>}
        </h2>
      </div>

      {/* Sparkline & Progress */}
      <div className="mt-6 space-y-4">
        {/* SVG Sparkline */}
        <div className="h-10 w-full opacity-50 group-hover:opacity-100 transition-opacity">
          <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id={`grad-${name}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colorHex} stopOpacity="0.5" />
                <stop offset="100%" stopColor={colorHex} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={`M ${points}`}
              fill="none"
              stroke={colorHex}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-sm"
            />
            <path
              d={`M 0,40 L ${points} L 100,40 Z`}
              fill={`url(#grad-${name})`}
              className="opacity-20"
            />
          </svg>
        </div>

        <div className="space-y-2">
          <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "65%" }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="h-full rounded-full"
              style={{ backgroundColor: colorHex }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>65% ce mois</span>
            <span>vs mois dernier</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default KPICard;
