import { createInstance, i18n as I18nType } from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  ro: { translation: { login: 'Autentificare', exploreEvents: 'Caută evenimente' } },
  en: { translation: { login: 'Sign in', exploreEvents: 'Explore events' } },
  it: { translation: { login: 'Accedi', exploreEvents: 'Cerca eventi' } }
}

export async function initI18n(locale: 'ro' | 'en' | 'it'): Promise<I18nType> {
  const i18n = createInstance()
  await i18n.use(initReactI18next).init({
    resources,
    lng: locale,
    fallbackLng: 'ro',
    interpolation: { escapeValue: false }
  })
  return i18n
}

