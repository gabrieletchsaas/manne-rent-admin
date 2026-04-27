"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export type AccountType = "proprietaire" | "diaspora" | "agence" | "locataire" | null;

interface AuthContextType {
    isLoggedIn: boolean;
    accountType: AccountType;
    login: (accountType?: AccountType) => void;
    logout: () => void;
    showAuthGuard: boolean;
    setShowAuthGuard: (show: boolean) => void;
    pendingAction: (() => void) | null;
    handleAction: (action: () => void) => void;
    setPendingAction: (action: (() => void) | null) => void;
    sessionExpired: boolean;
    triggerSessionExpired: (expired: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const supabase = createClient();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [accountType, setAccountType] = useState<AccountType>(null);
    const [showAuthGuard, setShowAuthGuard] = useState(false);
    const [sessionExpired, setSessionExpired] = useState(false);
    const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

    useEffect(() => {
        // 1. Check existing session on mount
        const getInitialSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            // BUG FIX: Only set isLoggedIn=true if session ACTUALLY exists
            if (session?.user) {
                setIsLoggedIn(true);
                const storedType = sessionStorage.getItem("manne_rent_account_type") as AccountType;
                // Also try to get account type from the user metadata
                const metaType = session.user.user_metadata?.account_type as AccountType;
                if (metaType) {
                    setAccountType(metaType);
                    sessionStorage.setItem("manne_rent_account_type", metaType);
                } else if (storedType) {
                    setAccountType(storedType);
                }
            } else {
                setIsLoggedIn(false);
            }
        };
        getInitialSession();

        // 2. Listen for auth changes — BUG FIX: check session value for INITIAL_SESSION
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_IN") {
                setIsLoggedIn(true);
                const metaType = session?.user?.user_metadata?.account_type as AccountType;
                if (metaType) {
                    setAccountType(metaType);
                    sessionStorage.setItem("manne_rent_account_type", metaType);
                }
            } else if (event === "INITIAL_SESSION") {
                // BUG FIX: INITIAL_SESSION fires even with no session → check session
                setIsLoggedIn(!!session?.user);
                if (session?.user) {
                    const metaType = session.user.user_metadata?.account_type as AccountType;
                    if (metaType) {
                        setAccountType(metaType);
                        sessionStorage.setItem("manne_rent_account_type", metaType);
                    }
                }
            } else if (event === "SIGNED_OUT") {
                setIsLoggedIn(false);
                setAccountType(null);
                setPendingAction(null);
                sessionStorage.removeItem("manne_rent_account_type");
            } else if (event === "TOKEN_REFRESHED") {
                // Session refreshed — ensure we stay logged in
                setIsLoggedIn(!!session?.user);
            }
        });

        return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const login = (type?: AccountType) => {
        setIsLoggedIn(true);
        if (type) {
            setAccountType(type);
            sessionStorage.setItem("manne_rent_account_type", type);
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setIsLoggedIn(false);
        setAccountType(null);
        setPendingAction(null);
        sessionStorage.removeItem("manne_rent_account_type");
    };

    /**
     * The core auth gate mechanism.
     * - If logged in: run action immediately.
     * - If not logged in: store action as pendingAction and open AuthGate.
     *   AuthGuardWrapper in layout.tsx will call pendingAction() after successful login.
     */
    const handleAction = useCallback((action: () => void) => {
        if (!isLoggedIn) {
            setPendingAction(() => action);
            setShowAuthGuard(true);
        } else {
            action();
        }
    }, [isLoggedIn]);

    const triggerSessionExpired = useCallback((expired: boolean) => {
        setSessionExpired(expired);
        if (expired) {
            setIsLoggedIn(false);
        }
    }, []);

    return (
        <AuthContext.Provider value={{
            isLoggedIn, accountType, login, logout,
            showAuthGuard, setShowAuthGuard,
            pendingAction, setPendingAction,
            handleAction,
            sessionExpired, triggerSessionExpired
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
