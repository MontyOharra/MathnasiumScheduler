import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#EF4444", // red-500
          hover: "#DC2626", // red-600
          light: "#FEE2E2", // red-100
        },
        background: {
          DEFAULT: "#FFFFFF",
          dark: "#0A0A0A",
        },
        text: {
          DEFAULT: "#171717",
          light: "#FFFFFF",
          muted: "#6B7280",
        },
        border: {
          DEFAULT: "#E5E7EB",
          dark: "#374151",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};

export default config;