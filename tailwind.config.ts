import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(240 10% 6%)",
        foreground: "hsl(0 0% 98%)",
        card: "hsl(240 10% 8%)",
        "card-foreground": "hsl(0 0% 98%)",
        muted: "hsl(240 6% 14%)",
        "muted-foreground": "hsl(240 5% 64.9%)",
        border: "hsl(240 6% 16%)",
        primary: { DEFAULT: "hsl(252 94% 67%)", foreground: "hsl(0 0% 100%)" },
        secondary: { DEFAULT: "hsl(204 94% 60%)", foreground: "hsl(0 0% 100%)" },
        ring: "hsl(252 94% 67%)",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui"],
        mono: ["ui-monospace", "SFMono-Regular"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(0,0,0,0.45)",
      },
      backgroundImage: {
        "card-gradient":
          "linear-gradient(145deg, rgba(148,163,184,0.08), rgba(99,102,241,0.12))",
      },
    },
  },
  plugins: [],
};
export default config;
