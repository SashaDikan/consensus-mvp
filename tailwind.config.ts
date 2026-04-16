import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111110",
        "ink-soft": "#2a2824",
        paper: "#f2ede2",
        "paper-warm": "#ebe4d4",
        "paper-dim": "#e4dcca",
        rule: "#1a1917",
        muted: "#7a746a",
        accent: "#d83a14",
        "accent-soft": "#f4a792",
        highlight: "#fff59b",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-plex)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
