import { Quasar } from 'quasar'

const formatCurrency = (currency) => {
  const locale = Quasar.lang.getLocale()
  const currencytype = locale === 'pt-BR' ? 'BRL' : 'USD'
  const formatted = currency.toLocaleString(locale, {
    style: 'currency',
    currency: currencytype
  })
  return formatted
}

export {
  formatCurrency
}
