/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    fontFamily: {
      sans: ["Plus Jakarta Sans", "serif"],
    },
    colors: {
      white: "#FFFFFF",
      black: "#000112",
      grey: {
        100: "#F4F7FD", // Light Grey (Light BG)
        200: "#E4EBFA", // Lines (Light)
        500: "#828FA3", // Medium Grey
        700: "#3E3F4E", // Lines (Dark)
        800: "#2B2C37", // Dark Grey
        900: "#20212C", // Very Dark Grey (Dark BG)
      },
      purple: {
        DEFAULT: "#635FC7", // main-purple
        light: "#A8A4FF", // purple
      },
      red: {
        DEFAULT: "#EA5555", // main-red
        light: "#FF9898", // red
      },
      column: {
        blue: "#49C4E5",
        purple: "#8471F2",
        green: "#67E2AE",
        coral: "#FF8F8F",
        teal: "#2DD4BF",
        indigo: "#818CF8",
        amber: "#FCD34D",
        rose: "#FB7185",
      },
      transparent: "transparent",
      current: "currentColor",
    },
    extend: {},
  },
  plugins: [],
};
