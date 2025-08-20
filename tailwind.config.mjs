/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/component/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/base/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.{js,ts}",
  ],
  theme: {
    screens: {
      sm: "640px",

      md: "768px",

      lg: "1024px",

      xl: "1160px",
    },

    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        merriweather: ["Merriweather", "sans-serif"],
        archivo: ["var(--font-archivo)", "sans-serif"],
        "dm-serif-text": ["var(--font-dm-serif-text)", "serif"],
      },

      container: {
        center: true,
      },

      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },

      animation: {
        liveBlogani: "liveBlogani 2s linear infinite",
      },
      keyframes: {
        liveBlogani: {
          "0%": { transform: "translate(-50%, -50%) scale(0.1)", opacity: "1" },
          "70%": {
            transform: "translate(-50%, -50%) scale(2.5)",
            opacity: "0",
          },
          "100%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
