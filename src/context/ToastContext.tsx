"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon as Info, XMarkIcon as X, ExclamationTriangleIcon as AlertTriangle } from "@heroicons/react/24/solid";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = useCallback((id: string) =>
    setToasts((prev) => prev.filter((t) => t.id !== id)), []);

  const icons = {
    success: <CheckCircleIcon className="w-5 h-5 text-[#F59E0B] shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0" />,
    error: <XCircleIcon className="w-5 h-5 text-red-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-white/60 shrink-0" />,
  };

  const borders = {
    success: "border-[#F59E0B]/30",
    warning: "border-yellow-500/30",
    error: "border-red-500/30",
    info: "border-white/10",
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      
      {/* Toast stack with Framer Motion */}
      <div className="fixed bottom-24 sm:bottom-8 right-0 left-0 sm:left-auto sm:right-8 z-[9999] p-4 flex flex-col gap-3 max-w-sm ml-auto pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              className={cn(
                "flex items-center gap-4 px-5 py-4 rounded-[24px] border shadow-2xl backdrop-blur-xl bg-[#0B1C3D]/90 pointer-events-auto",
                borders[t.type]
              )}
            >
              <div className="relative">
                <div className={cn("absolute inset-0 blur-lg opacity-20", t.type === 'success' ? 'bg-[#F59E0B]' : 'bg-current')} />
                {icons[t.type]}
              </div>
              
              <span className="flex-1 text-[11px] font-black text-white uppercase tracking-widest leading-relaxed">
                {t.message}
              </span>

              <button
                onClick={() => dismiss(t.id)}
                className="p-1 text-white/20 hover:text-white transition-colors"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
