"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { UserIcon as User, CameraIcon as Camera } from "@heroicons/react/24/solid";
import { cn } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";
import { createClient } from "@/lib/supabase/client";

// ─── Image compression using canvas ──────────────────────────────────────────
function compressImage(file: File, maxSizePx = 200, quality = 0.75): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new window.Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const scale = Math.min(1, maxSizePx / Math.max(img.width, img.height));
                canvas.width  = Math.round(img.width  * scale);
                canvas.height = Math.round(img.height * scale);
                const ctx = canvas.getContext("2d");
                if (!ctx) { reject(new Error("Canvas not supported")); return; }
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL("image/jpeg", quality));
            };
            img.onerror = reject;
            img.src = e.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AvatarUpload({ className }: { className?: string }) {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const supabase = createClient();

    // Load avatar from profiles table (per-user, DB-backed)
    const fetchAvatar = useCallback(async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: profile } = await supabase
                .from("profiles")
                .select("avatar_url")
                .eq("id", user.id)
                .single();

            if (profile?.avatar_url) {
                setAvatarUrl(profile.avatar_url);
            }
        } catch (err) {
            console.error("AvatarUpload fetchAvatar:", err);
        }
    }, [supabase]);

    useEffect(() => {
        fetchAvatar();

        // Re-sync when any AvatarUpload instance in this tab uploads a new photo
        const handleUpdate = () => fetchAvatar();
        window.addEventListener("user_avatar_updated", handleUpdate);
        return () => window.removeEventListener("user_avatar_updated", handleUpdate);
    }, [fetchAvatar]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast("⚠️ Image trop lourde. Maximum 5 Mo.", "error");
            return;
        }

        try {
            setUploading(true);

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast("⚠️ Vous devez être connecté.", "error");
                return;
            }

            // Compress to 200×200 JPEG ~75% quality → small base64
            const compressed = await compressImage(file, 200, 0.75);

            // Save directly in profiles.avatar_url — per-user by design
            const { error } = await supabase
                .from("profiles")
                .update({ avatar_url: compressed })
                .eq("id", user.id);

            if (error) {
                console.error("DB update error:", error);
                toast("❌ Impossible de sauvegarder la photo.", "error");
                return;
            }

            setAvatarUrl(compressed);
            // Notify all other AvatarUpload instances in the same tab
            window.dispatchEvent(new Event("user_avatar_updated"));
            toast("✅ Photo de profil mise à jour !");
        } catch (err) {
            console.error("AvatarUpload error:", err);
            toast("❌ Une erreur est survenue.", "error");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    return (
        <div
            className={cn("relative group cursor-pointer inline-block", className)}
            onClick={() => !uploading && fileInputRef.current?.click()}
            title="Modifier la photo de profil"
        >
            <div className="w-12 h-12 rounded-full border-2 border-luxury-gold/20 hover:border-luxury-gold transition-all flex items-center justify-center bg-white/5 backdrop-blur-md overflow-hidden relative shadow-md dark:shadow-slate-900">
                {/* Use native <img> so base64 data: URLs work without Next.js domain config */}
                {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={avatarUrl}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <User className="w-5 h-5 text-luxury-gold" />
                )}
                {/* Hover / upload overlay */}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {uploading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Camera className="w-4 h-4 text-white" />
                    )}
                </div>
            </div>
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading}
            />
        </div>
    );
}
