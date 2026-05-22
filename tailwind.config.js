/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "Inter", "Plus Jakarta Sans", "system-ui", "sans-serif"]
      },
      colors: {
        ink: "#070b12",
        panel: "rgba(255,255,255,0.045)"
      },
      boxShadow: {
        glass: "0 10px 30px -10px rgba(0,0,0,0.5)",
        glow: "0 0 0 1px rgba(34,211,238,0.2), 0 18px 55px -25px rgba(34,211,238,0.55)"
      },
      backgroundImage: {
        "cta-gradient": "linear-gradient(135deg, #0891b2 0%, #2563eb 100%)",
        "panel-gradient": "linear-gradient(145deg, rgba(255,255,255,0.085), rgba(255,255,255,0.025))"
      }
    }
  },
  plugins: []
};
