/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "on-error": "#690005",
        "on-error-container": "#ffdad6",
        "inverse-surface": "#e2e2e2",
        "tertiary-fixed": "#e4e2e1",
        "primary": "#eaffde",
        "surface-variant": "#353535",
        "on-primary-fixed-variant": "#015300",
        "on-secondary-fixed-variant": "#474746",
        "secondary-fixed": "#e5e2e1",
        "secondary": "#c8c6c5",
        "on-tertiary-container": "#616060",
        "surface": "#131313",
        "surface-container-highest": "#353535",
        "primary-container": "#00ff00",
        "on-primary-container": "#027100",
        "tertiary": "#faf8f7",
        "outline-variant": "#3b4b35",
        "on-secondary": "#313030",
        "tertiary-fixed-dim": "#c8c6c6",
        "surface-container-high": "#2a2a2a",
        "on-tertiary-fixed-variant": "#474747",
        "on-primary-fixed": "#002200",
        "tertiary-container": "#dedbdb",
        "surface-container-lowest": "#0e0e0e",
        "inverse-primary": "#026e00",
        "on-tertiary": "#303030",
        "primary-fixed-dim": "#02e600",
        "surface-bright": "#393939",
        "secondary-fixed-dim": "#c8c6c5",
        "on-surface-variant": "#b9ccaf",
        "on-primary": "#013a00",
        "surface-dim": "#131313",
        "secondary-container": "#474746",
        "surface-container-low": "#1b1b1b",
        "surface-container": "#1f1f1f",
        "outline": "#84967c",
        "surface-tint": "#02e600",
        "on-secondary-fixed": "#1c1b1b",
        "background": "#131313",
        "inverse-on-surface": "#303030",
        "on-secondary-container": "#b7b5b4",
        "on-surface": "#e2e2e2",
        "primary-fixed": "#77ff61",
        "on-tertiary-fixed": "#1b1c1c",
        "error": "#ffb4ab"
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      fontFamily: {
        "display": ["Geist", "sans-serif"],
        "body": ["Geist", "sans-serif"],
        "code": ["JetBrains Mono", "monospace"]
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}