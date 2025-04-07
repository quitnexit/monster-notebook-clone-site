import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cardHoverGreen:"#6cc04a",  //"#1e491c",
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(146deg, #232324 3%, #1b1c1d 96%)',
      },
    },
  },
  plugins: [
  ],
} satisfies Config;
