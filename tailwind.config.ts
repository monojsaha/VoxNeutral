import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef0fe",
          100: "#e0e4fd",
          200: "#c7ccfb",
          300: "#a4aaf8",
          400: "#7a82f3",
          500: "#4a63f7",
          600: "#3d4edb",
          700: "#3240b8",
          800: "#2c3794",
          900: "#293278",
          950: "#1a1e4a",
        },
        neutral: {
          50: "#f8f9fa",
          100: "#f1f3f5",
          200: "#e9ecef",
          300: "#dee2e6",
          400: "#ced4da",
          500: "#adb5bd",
          600: "#6c757d",
          700: "#495057",
          750: "#2e3138",
          800: "#1a1d24",
          850: "#14171e",
          900: "#111317",
          950: "#0d0f12",
        },
        success: {
          500: "#22c55e",
        },
        warning: {
          500: "#f59e0b",
        },
        error: {
          500: "#ef4444",
        },
      },
      animation: {
        recording: "recording 1.5s ease-in-out infinite",
      },
      keyframes: {
        recording: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.08)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
