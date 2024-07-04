/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      backgroundColor: {
        'blackbg': '#353535',
        'tan' : '#AE8F73',
        'transperent-purple' : '#6a3f923d',
        'card-purple': "#594388",
        'crimson-Purple' : '#8750f7',
        'white-purple' : "#e2dbf1"
      },
      borderColor: {
        'crimson-Purple-border': '#8750f7',
      },
      textColor: {
        'crimson-Purple-text': '#8750f7',
        "tan"  : "#AE8F73"
      },
      boxShadow: {
        'custom': '0 4px 8px 0 rgba(255, 255, 255, 0.2), 0 6px 20px 0 rgba(255, 255, 255, 0.19)',
      },
      maxHeight: {
        '560': '600px',
      }
    },
  },
  plugins: [],
};
