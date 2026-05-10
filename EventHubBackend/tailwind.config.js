module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        headline: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse-slow 6s ease-in-out infinite",
        fadeIn: "fadeIn 0.3s ease-out",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};