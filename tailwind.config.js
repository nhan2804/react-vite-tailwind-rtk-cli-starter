// const ar = require("@tailwindcss/aspect-ratio");s
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,css}", "./index.html"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {},
    fontFamily: {
      sans: ["Montserrat", "sans-serif"],
      serif: ["Merriweather", "serif"],
      actor: ["Actor", "sans-serif"],
    },
  },
  variants: {
    extend: {},
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/line-clamp"),
  ],
};
