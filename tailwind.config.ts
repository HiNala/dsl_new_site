import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: { 
        sans: ['var(--font-inter)', 'sans-serif'] 
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'brand-blue': '#0D4CFF',
      },
      letterSpacing: {
        tight2: '-0.02em',      // for the billboard headline
        wide2:  '0.20em',       // for the nav letters
      },
    },
  },
  plugins: [],
} satisfies Config; 