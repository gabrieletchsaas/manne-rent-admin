"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion, animate } from "framer-motion";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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

  const handleNavigation = () => {
    if (name.toLowerCase().includes("utilisateurs")) router.push("/dashboard/admin/users");
    else if (name.toLowerCase().includes("biens")) router.push("/dashboard/admin/properties");
    else if (name.toLowerCase().includes("mrr") || name.toLowerCase().includes("revenus")) router.push("/dashboard/admin/transactions");
    else router.push("/dashboard/admin/analytics");
  };

  return (
    <motion.div
      onClick={handleNavigation}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="p-6 relative overflow-hidden group cursor-pointer transition-all duration-300"
      style={{ 
        background: 'linear-gradient(145deg, var(--bg-secondary, #0d1f3c), var(--bg-primary, #0a1628))',
        border: '1px solid rgba(201,168,76,0.2)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)';
      }}
    >
      <div className="flex items-start justify-between mb-6">
        <div 
          className="p-3 flex items-center justify-center transition-colors"
          style={{ 
            background: 'rgba(201,168,76,0.15)', 
            border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: '12px',
            color: '#c9a84c'
          }}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div className={cn(
          "flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black tracking-tight border",
          changeType === "increase" ? "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20" : "bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20"
        )}>
          {change} {changeType === "increase" ? "↑" : "↓"}
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--text-secondary, #94a3b8)' }}>
          {name}
        </p>
        <h2 className="text-[2.5rem] font-bold leading-none tracking-tighter" style={{ color: 'var(--text-primary, #ffffff)' }}>
          {numericValue > 1000 ? count.toLocaleString() : count}{name.includes('Taux') ? '%' : ''}
          {name.includes('MRR') && <span className="text-sm ml-1 font-medium opacity-50">FCFA</span>}
        </h2>
      </div>

      {/* Sparkline & Progress */}
      <div className="mt-6 space-y-4">
        {/* SVG Sparkline */}
        <div className="h-10 w-full opacity-50 group-hover:opacity-100 transition-opacity">
          <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id={`grad-${name.replace(/\s+/g, '-')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#c9a84c" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={`M ${points}`}
              fill="none"
              stroke="#c9a84c"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-sm"
            />
            <path
              d={`M 0,40 L ${points} L 100,40 Z`}
              fill={`url(#grad-${name.replace(/\s+/g, '-')})`}
              className="opacity-20"
            />
          </svg>
        </div>

        <div className="space-y-2">
          <div className="h-1.5 w-full bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "65%" }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #1a3a6b, #c9a84c)' }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-secondary, #94a3b8)' }}>
            <span>65% ce mois</span>
            <span>vs mois dernier</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default KPICard;
