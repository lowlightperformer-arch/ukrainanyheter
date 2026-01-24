import Head from 'next/head'
import Header from './Header'
import Footer from './Footer'
import React from 'react'

type Props = {
  children: React.ReactNode
  title?: string
  description?: string
}

export default function Layout({ children, title, description }: Props) {
  return (
    <div>
      <Head>
        <title>{title ? `${title} — Ukrainanyheter` : 'Ukrainanyheter'}</title>
        <meta name="description" content={description || 'Ukrainanyheter — news in English and Swedish'} />
        <meta property="og:title" content={title || 'Ukrainanyheter'} />
      </Head>
      <Header />
      <main className="container pt-0 pb-8">{children}</main>
      <Footer />
    </div>
  )
}

/* Architectural note: Layout centralizes SEO defaults and shared header/footer.
   This keeps page-level components focused on content and language variations. */
