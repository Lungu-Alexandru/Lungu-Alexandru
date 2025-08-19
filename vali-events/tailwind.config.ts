import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          darkBlue: '#0B3D91',
          lightBlue: '#4A90E2',
          warmOrange: '#F5A623',
          lightGray: '#F2F2F2',
          darkGray: '#4A4A4A',
        },
      },
    },
  },
  plugins: [],
};

export default config;

