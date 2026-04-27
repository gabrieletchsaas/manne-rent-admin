"use client";

/**
 * AdminInstallPrompt.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Modal PWA "Installer Dashboard Admin" — design premium gold / navy.
 * - Android/Chrome : intercepte beforeinstallprompt → prompt natif
 * - iOS/Safari     : guide manuel (partage → "Sur l'écran d'accueil")
 * - Mémorise le refus dans localStorage (clé "admin-pwa-dismissed")
 * - Ne s'affiche pas si l'app est déjà en mode standalone
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useState } from "react";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
  prompt(): Promise<void>;
}

type PromptMode = "android" | "ios" | null;

// ─── Composant ────────────────────────────────────────────────────────────────

export default function AdminInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [mode, setMode] = useState<PromptMode>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // ── Vérifications initiales ───────────────────────────────────────────────

    // Déjà refusé ?
    if (localStorage.getItem("admin-pwa-dismissed")) return;

    // Déjà installé / standalone ?
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator &&
        (navigator as { standalone?: boolean }).standalone === true);
    if (isStandalone) return;

    // ── Détection iOS ─────────────────────────────────────────────────────────
    const isIOS =
      /iphone|ipad|ipod/i.test(navigator.userAgent) &&
      !(window as unknown as { MSStream?: unknown }).MSStream;

    if (isIOS) {
      const timer = setTimeout(() => {
        setMode("ios");
        setVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }

    // ── Android / Chrome : beforeinstallprompt ────────────────────────────────
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => {
        setMode("android");
        setVisible(true);
      }, 2000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Masquer si app est installée pendant la session
    const onInstalled = () => setVisible(false);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "dismissed") {
      localStorage.setItem("admin-pwa-dismissed", "1");
    }
    setVisible(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    localStorage.setItem("admin-pwa-dismissed", "1");
    setVisible(false);
  };

  if (!visible || !mode) return null;

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDU — OVERLAY CENTRÉ
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Installer Dashboard Admin Manne Rent"
      id="pwa-install-modal"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        padding: "16px",
        animation: "fadeInOverlay 0.3s ease",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) handleDismiss(); }}
    >
      {/* ── Card ────────────────────────────────────────────────────────────── */}
      <div
        style={{
          background: "#0d1f3c",
          border: "2px solid #c9a84c",
          borderRadius: "20px",
          padding: "28px 24px",
          boxShadow: "0 0 30px rgba(201,168,76,0.3)",
          width: "85vw",
          maxWidth: "380px",
          position: "relative",
          animation: "slideUpCard 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* ── Bouton fermer ─────────────────────────────────────────────────── */}
        <button
          id="close-btn"
          onClick={handleDismiss}
          aria-label="Fermer"
          style={{
            position: "absolute",
            top: "14px",
            right: "16px",
            background: "none",
            border: "none",
            color: "#ffffff",
            fontSize: "22px",
            cursor: "pointer",
            lineHeight: 1,
            padding: "4px",
            opacity: 0.7,
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.7"; }}
        >
          ✕
        </button>

        {/* ── Logo ─────────────────────────────────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "18px" }}>
          <Image
            src="/icons/icon-192x192.png"
            alt="Dashboard Admin Manne Rent"
            width={90}
            height={90}
            style={{
              borderRadius: "18px",
              filter: "drop-shadow(0 0 12px rgba(201,168,76,0.5))",
              objectFit: "cover",
            }}
          />
        </div>

        {/* ── Titre ─────────────────────────────────────────────────────────── */}
        <h2
          style={{
            color: "#ffffff",
            fontSize: "20px",
            fontWeight: 700,
            textAlign: "center",
            margin: "0 0 4px 0",
          }}
        >
          Dashboard Admin
        </h2>

        {/* ── Sous-titre ────────────────────────────────────────────────────── */}
        <p
          style={{
            color: "#c9a84c",
            fontSize: "14px",
            fontWeight: 700,
            letterSpacing: "3px",
            textTransform: "uppercase",
            textAlign: "center",
            margin: "0 0 12px 0",
          }}
        >
          Manne Rent
        </p>

        {/* ── Description ───────────────────────────────────────────────────── */}
        <p
          style={{
            color: "#b0b8c8",
            fontSize: "13px",
            textAlign: "center",
            lineHeight: 1.6,
            margin: "0 0 24px 0",
          }}
        >
          {mode === "android"
            ? "Installez l'application pour un accès rapide à votre plateforme de gestion locative."
            : "Pour installer : appuyez sur"}
        </p>

        {/* ── Note Importante (Conflit PWA) ─────────────────────────────────── */}
        <div
          style={{
            background: "rgba(255, 107, 107, 0.1)",
            border: "1px solid rgba(255, 107, 107, 0.3)",
            borderRadius: "12px",
            padding: "10px 12px",
            marginBottom: "20px",
          }}
        >
          <p
            style={{
              color: "#ff6b6b",
              fontSize: "11px",
              textAlign: "center",
              lineHeight: 1.4,
              margin: 0,
              fontWeight: 600,
            }}
          >
            ⚠️ Si l&apos;application &ldquo;Manne Rent&rdquo; est déjà installée, 
            veuillez d&apos;abord la désinstaller pour permettre l&apos;installation 
            de cette nouvelle application indépendante.
          </p>
        </div>

        {/* ── Contenu iOS ────────────────────────────────────────────────────── */}
        {mode === "ios" && (
          <div style={{ marginBottom: "20px" }}>
            {/* Étape partage */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                background: "rgba(201,168,76,0.1)",
                border: "1px solid rgba(201,168,76,0.3)",
                borderRadius: "12px",
                padding: "12px 16px",
                marginBottom: "12px",
              }}
            >
              <span style={{ color: "#c9a84c", fontSize: "22px" }}>📤</span>
              <span style={{ color: "#e0e0e0", fontSize: "13px" }}>
                Appuyez sur <strong style={{ color: "#c9a84c" }}>Partager</strong> en bas
              </span>
            </div>
            {/* Étape ajouter */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                background: "rgba(201,168,76,0.1)",
                border: "1px solid rgba(201,168,76,0.3)",
                borderRadius: "12px",
                padding: "12px 16px",
              }}
            >
              <span style={{ color: "#c9a84c", fontSize: "22px" }}>➕</span>
              <span style={{ color: "#e0e0e0", fontSize: "13px" }}>
                Puis <strong style={{ color: "#ffffff" }}>&ldquo;Sur l&apos;écran d&apos;accueil&rdquo;</strong>
              </span>
            </div>
          </div>
        )}

        {/* ── Bouton installer (Android) ou J'ai compris (iOS) ─────────────── */}
        {mode === "android" ? (
          <button
            id="install-btn"
            onClick={handleInstall}
            style={{
              width: "100%",
              padding: "14px 32px",
              background: "linear-gradient(135deg, #c9a84c, #f0d080)",
              color: "#0d1f3c",
              border: "none",
              borderRadius: "50px",
              fontSize: "15px",
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.5px",
              boxShadow: "0 4px 20px rgba(201,168,76,0.4)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.transform = "scale(1.03)";
              btn.style.boxShadow = "0 6px 28px rgba(201,168,76,0.6)";
            }}
            onMouseLeave={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.transform = "scale(1)";
              btn.style.boxShadow = "0 4px 20px rgba(201,168,76,0.4)";
            }}
          >
            📲 Installer l&apos;application
          </button>
        ) : (
          <button
            onClick={handleDismiss}
            style={{
              width: "100%",
              padding: "12px 32px",
              background: "transparent",
              color: "#c9a84c",
              border: "1px solid rgba(201,168,76,0.5)",
              borderRadius: "50px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.5px",
              transition: "background 0.2s",
            }}
          >
            J&apos;ai compris
          </button>
        )}

        {/* ── Lien discret "Plus tard" (Android) ────────────────────────────── */}
        {mode === "android" && (
          <p
            style={{
              textAlign: "center",
              marginTop: "14px",
              marginBottom: 0,
            }}
          >
            <button
              onClick={handleDismiss}
              style={{
                background: "none",
                border: "none",
                color: "rgba(176,184,200,0.5)",
                fontSize: "12px",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Plus tard
            </button>
          </p>
        )}
      </div>

      {/* ── Animations keyframes ─────────────────────────────────────────────── */}
      <style>{`
        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUpCard {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
