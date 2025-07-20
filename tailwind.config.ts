import type { Config } from "tailwindcss";

export default {
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
        'brand-blue': '#0D4CFF',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      fontWeight: {
        'headline': '300',
        'nav': '500',
      },
      letterSpacing: {
        'tight-headline': '-0.02em',
        'wide-nav': '0.2em',
      },
    },
  },
  plugins: [],
} satisfies Config; 