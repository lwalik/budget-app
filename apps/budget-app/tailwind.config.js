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
      // colors: {
      //   primary: '#006D77',
      //   secondary: '#83C5BE',
      //   warn: '#FFDDD2',
      //   accent: '#EDF6F9',
      //   info: '#E29578',
      // },
      colors: {
        primary: '#0f172a',
        secondary: '#f8fafc',
        warn: '#14b8a6',
        accent: '#99f6e4',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
