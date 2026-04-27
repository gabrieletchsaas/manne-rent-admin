import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ['class', '.dark, .classic-dark'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          deep: "#0B1C3D",
          royal: "#1E3A8A",
          orange: "#F59E0B",
        },
        "luxury-blue": "#001F3F",
        "luxury-gold": "#D4AF37",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "sans-serif"],
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
        montserrat: ["var(--font-montserrat)", "sans-serif"],
      },
      keyframes: {
        "fade-in": {
          "0%":   { opacity: "0", transform: "scale(0.96) translateY(8px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "pulse-subtle": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(212, 175, 55, 0.5)" },
          "50%":      { boxShadow: "0 0 32px rgba(212, 175, 55, 0.85)" },
        },
        "bounce-horizontal": {
          "0%, 100%": {
            transform: "translateX(-25%)",
            animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateX(0)",
            animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
        "breathe": {
          "0%, 100%": { transform: "scale(1)" },
          "50%":      { transform: "scale(1.03)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.25s ease-out both",
        shimmer: "shimmer 2s infinite",
        "pulse-subtle": "pulse-subtle 2.5s ease-in-out infinite",
        "bounce-horizontal": "bounce-horizontal 1.5s infinite",
        "breathe": "breathe 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
