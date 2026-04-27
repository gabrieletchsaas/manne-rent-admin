"use client";

import { Bell, Check, CheckCheck } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface NotificationItem {
  id: string;
  type: string;
  message: string;
  is_read: boolean;
  sent_at: string;
  day_trigger?: number | null;
}

interface NotificationBellProps {
  /** Notifications pré-chargées (optionnel). Si absent, fetch via API. */
  initialNotifications?: NotificationItem[];
  className?: string;
}

export function NotificationBell({ initialNotifications, className }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    initialNotifications ?? []
  );
  const [loading, setLoading] = useState(!initialNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch si pas de données initiales
  useEffect(() => {
    if (initialNotifications) return;
    const load = async () => {
      try {
        const res = await fetch("/api/notifications");
        if (!res.ok) return;
        const json = await res.json();
        setNotifications(json.notifications ?? []);
      } catch {
        /* silently fail */
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [initialNotifications]);

  // Fermer au clic extérieur
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const unread = notifications.filter((n) => !n.is_read).length;

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    await fetch(`/api/notifications/all/read`, { method: "PUT" });
  };

  const getIcon = (type: string) => {
    if (type.includes("EXPIRED")) return "🚨";
    if (type.includes("EXPIRING")) return "🚨";
    if (type.includes("REMINDER_27")) return "🔔";
    if (type.includes("REMINDER_25")) return "⚠️";
    if (type.includes("RESERVATION_NEW")) return "📅";
    if (type.includes("CANCELLED")) return "❌";
    return "🔔";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* ── Bouton cloche ───────────────────────────────── */}
      <button
        id="notification-bell-btn"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          className || "relative p-2.5 rounded-2xl transition-all bg-white/10 hover:bg-[#F59E0B] hover:text-[#0B1C3D]",
          !className && open && "bg-[#F59E0B] text-[#0B1C3D]",
          className && open && "bg-slate-100 dark:bg-white/10" // fallback for custom classes
        )}
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className={cn(
            "absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 shadow-lg shadow-red-500/30 animate-pulse",
            className && "top-0 right-0 w-2.5 h-2.5 min-w-0 px-0 shadow-none border-2 border-white dark:border-[#0B1C3D] text-[0px]"
          )}>
            {className ? "" : (unread > 9 ? "9+" : unread)}
          </span>
        )}
      </button>

      {/* ── Dropdown ────────────────────────────────────── */}
      {open && (
        <div className="absolute right-0 top-12 w-80 sm:w-96 bg-[#0B1C3D] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <span className="font-black text-sm text-white uppercase tracking-widest">
              Notifications
            </span>
            {unread > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-[10px] text-[#F59E0B] hover:text-white font-bold uppercase tracking-widest transition-all"
              >
                <CheckCheck size={12} />
                Tout marquer lu
              </button>
            )}
          </div>

          {/* List */}
          {loading ? (
            <div className="px-4 py-8 text-center">
              <div className="w-6 h-6 border-2 border-white/10 border-t-[#F59E0B] rounded-full animate-spin mx-auto" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Bell size={32} className="mx-auto text-white/20 mb-3" />
              <p className="text-sm text-white/40 font-bold">Aucune notification</p>
            </div>
          ) : (
            <ul className="divide-y divide-white/5 max-h-80 overflow-y-auto">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={cn(
                    "flex gap-3 px-4 py-3 transition-colors cursor-pointer hover:bg-white/5",
                    !n.is_read && "bg-[#F59E0B]/5"
                  )}
                  onClick={() => markAsRead(n.id)}
                >
                  <span className="text-lg shrink-0 mt-0.5">{getIcon(n.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm leading-snug",
                        n.is_read ? "text-white/50" : "text-white font-semibold"
                      )}
                    >
                      {n.message}
                    </p>
                    <p className="text-[11px] text-white/30 mt-1 font-mono">
                      {new Date(n.sent_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {!n.is_read && (
                    <div className="w-2 h-2 bg-[#F59E0B] rounded-full shrink-0 mt-2" />
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t border-white/10 text-center">
              <button
                onClick={markAllAsRead}
                className="flex items-center justify-center gap-1.5 w-full py-2 text-[11px] text-white/40 hover:text-white uppercase tracking-widest font-bold transition-all"
              >
                <Check size={12} />
                Tout marquer comme lu
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
