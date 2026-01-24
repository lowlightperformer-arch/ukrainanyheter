export function formatDate(dateInput?: string | number | Date, lang = 'en'){
  if(!dateInput) return ''
  const d = new Date(dateInput)
  const locale = lang === 'sv' ? 'sv-SE' : 'en-US'
  try{
    return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'numeric', day: 'numeric' }).format(d)
  }catch(e){
    return d.toISOString().slice(0,10)
  }
}

export function formatDateTime(dateInput?: string | number | Date, lang = 'en'){
  if(!dateInput) return ''
  const d = new Date(dateInput)
  const locale = lang === 'sv' ? 'sv-SE' : 'en-US'
  try{
    return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(d)
  }catch(e){
    return d.toISOString()
  }
}
