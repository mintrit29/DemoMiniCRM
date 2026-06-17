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
        pastel: {
          blue: "#E0F2FE",
          pink: "#FCE7F3",
          green: "#DCFCE7",
          yellow: "#FEF9C3",
          purple: "#F3E8FF",
          slate: "#F8FAFC",
        },
      },
    },
  },
  plugins: [],
}
