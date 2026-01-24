import { useRouter } from 'next/router'
import Link from 'next/link'

export default function LanguageSwitcher(){
  const router = useRouter()
  const { asPath } = router
  // Determine current lang from the first path segment (fallback to 'en')
  const pathOnly = (asPath || '/').split('?')[0]
  const segs = pathOnly.split('/').filter(Boolean)
  const first = segs[0]
  const currentLang = first === 'sv' ? 'sv' : 'en'
  const other = currentLang === 'en' ? 'sv' : 'en'

  let href = '/' + other
  if(segs.length > 0){
    if(segs[0] === 'en' || segs[0] === 'sv'){
      segs[0] = other
      href = '/' + segs.join('/')
    }else{
      // no lang prefix in path — prefix with target lang
      href = `/${other}${pathOnly === '/' ? '' : pathOnly}`
    }
  }

  return (
    <Link href={href} className="text-sm uppercase">{other.toUpperCase()}</Link>
  )
}
