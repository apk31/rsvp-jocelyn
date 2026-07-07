/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#f5efe6",
        creamSoft: "#efe6d8",
      },
    },
  },
  plugins: [],
}