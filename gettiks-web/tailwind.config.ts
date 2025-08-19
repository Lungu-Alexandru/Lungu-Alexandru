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
          blue: '#00A3E0',
          yellow: '#FFC107',
          black: '#212121',
          gray: '#F5F5F5'
        }
      }
    }
  },
  plugins: []
};

export default config;

