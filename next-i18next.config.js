/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: 'ro',
    locales: ['ro', 'en', 'it']
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development'
}

