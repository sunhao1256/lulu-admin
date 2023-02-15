import {createI18n} from 'vue-i18n'
import config from '../configs'

/**
 * Vue Translations
 * https://kazupon.github.io/vue-i18n/
 */


const {locale, availableLocales, fallbackLocale} = config.locales

const messages = {}

availableLocales.forEach((l: any) => { // @ts-ignore
  messages[l.code] = l.messages
})

const i18n = createI18n({
  locale,
  fallbackLocale,
  messages,
  legacy: false,
  globalInjection:true
})
export default i18n


