/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        thermal: "#F7F7F5",
        ink: "#111110",
        highlighter: "#E8FF00",
        laser: "#FF331F",
        perforation: "#E5E5E0",
      },
      fontFamily: {
        mono: ['var(--font-geist-mono)', 'monospace'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px rgba(17,17,16,1)',
        'brutal-sm': '2px 2px 0px 0px rgba(17,17,16,1)',
      }
    },
  },
  plugins: [],
}
