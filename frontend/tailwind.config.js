/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme colors (similar to ChatGPT/Gemini)
        dark: {
          bg: "#0d0d0d",
          "bg-secondary": "#171717",
          "bg-tertiary": "#212121",
          border: "#2f2f2f",
          text: "#ececec",
          "text-secondary": "#b4b4b4",
          "text-muted": "#8e8e8e",
          accent: "#10a37f",
          "accent-hover": "#0d8a6a",
        },
      },
      typography: {
        DEFAULT: {
          css: {
            color: "#ececec",
            a: {
              color: "#10a37f",
              "&:hover": {
                color: "#0d8a6a",
              },
            },
            strong: {
              color: "#ffffff",
            },
            code: {
              color: "#e5e5e5",
              backgroundColor: "#2f2f2f",
              padding: "2px 6px",
              borderRadius: "4px",
            },
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
            pre: {
              backgroundColor: "#1e1e1e",
              color: "#e5e5e5",
            },
            h1: { color: "#ffffff" },
            h2: { color: "#ffffff" },
            h3: { color: "#ffffff" },
            h4: { color: "#ffffff" },
            blockquote: {
              color: "#b4b4b4",
              borderLeftColor: "#2f2f2f",
            },
          },
        },
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
