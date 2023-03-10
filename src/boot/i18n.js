import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'

export default ({ app }) => {
  const i18n = createI18n({
    locale: 'pt-BR',
    globalInjection: true,
    messages
  })

  // Tell app to use the I18n instance
  app.use(i18n)
}
