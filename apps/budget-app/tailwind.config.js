const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0f172a',
        'primary-light': '#242d42',
        secondary: '#f8fafc',
        'secondary-hover': '#c6ced6',
        warn: '#14b8a6',
        accent: '#99f6e4',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
