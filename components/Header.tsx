import Link from 'next/link'
import { useRouter } from 'next/router'
import LanguageSwitcher from './LanguageSwitcher'
import React, { useState, useRef, useEffect } from 'react'
import { capitalize } from '../lib/string'

const CATEGORIES = ['war','politics','social','tech','culture','uncategorised']
const CATEGORIES_SV: Record<string,string> = {
  war: 'Krig',
  politics: 'Politik',
  social: 'Social',
  tech: 'Teknik',
  culture: 'Kultur',
  uncategorised: 'Okategoriserad'
}

export default function Header(){
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handleDocClick(e: MouseEvent){
      if (!menuRef.current || !btnRef.current) return
      const target = e.target as Node
      if (menuRef.current.contains(target) || btnRef.current.contains(target)) return
      setOpen(false)
    }
    document.addEventListener('click', handleDocClick)
    return () => document.removeEventListener('click', handleDocClick)
  }, [])

  // determine current lang from path (fallback to 'en')
  const pathOnly = (router.asPath || '/').split('?')[0]
  const segs = pathOnly.split('/').filter(Boolean)
  const first = segs[0]
  const currentLang = first === 'sv' ? 'sv' : 'en'

  return (
    <header className="site-header bg-white border-b">
      <div className="container">
        {/* Top bar: hamburger | site title | search */}
        <div className="flex items-center justify-between py-3 md:py-4">
          <div className="flex items-center md:hidden">
            <button
              ref={btnRef}
              onClick={() => setOpen(v => !v)}
              aria-expanded={open}
              aria-label="Open menu"
              className="p-2"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
          </div>

          <div className="flex-1 text-center">
            <Link href={`/${currentLang}`} className="brand text-lg md:text-xl font-bold uppercase">Ukrainanyheter</Link>
          </div>

          <div className="flex items-center gap-4">
            <button aria-label="Search" className="p-2">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>

            <div className="hidden md:flex items-center gap-4">
              <LanguageSwitcher />
              <Link href="/admin/signin" className="admin-link">Admin</Link>
            </div>
          </div>
        </div>

        {/* Categories bar for small screens */}
        <nav className="md:hidden border-t">
          <ul className="flex overflow-x-auto text-sm divide-x divide-gray-200">
            {CATEGORIES.map((cat, i) => (
              <li key={cat} className="px-4 py-3 first:pl-3 last:pr-3">
                <Link href={`/${router.query.lang || 'en'}/category/${cat}`} className="whitespace-nowrap text-gray-700 hover:text-gray-900">{capitalize(cat)}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop categories (centered, larger font) */}
        <div className="hidden md:flex items-center gap-6 justify-center w-full">
          <nav>
            <ul className="flex items-center gap-6">
              {CATEGORIES.map(cat => (
                <li key={cat}>
                  <Link href={`/${currentLang}/category/${cat}`} className="text-base hover:text-gray-800">{currentLang === 'sv' ? (CATEGORIES_SV[cat] || capitalize(cat)) : capitalize(cat)}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}
