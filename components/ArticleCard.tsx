import Link from 'next/link'
import React from 'react'
import { formatDate } from '../lib/formatDate'
import { capitalize } from '../lib/string'

type Props = {
  article: any
  lang: string
  compact?: boolean
}

export default function ArticleCard({ article, lang }: Props){
  const t = lang === 'sv' ? article.title_sv : article.title_en
  const slug = article.slug
  const img = article.featuredImage || article.image || ''
  const isCompact = !!article.compact
  const hasMedia = !!img
  const rootClass = 'article-card' + (isCompact ? ' compact force-compact' : '') + (hasMedia ? ' has-media' : '')
  return (
    <article className={rootClass}>
      {/* Compact variant (row) - shown on mobile, or always when force-compact */}
      <div className="compact-row" role="presentation">
        <div className="compact-text">
          <h3 className="article-headline">
            <Link href={`/${lang}/articles/${slug}`}>{t}</Link>
          </h3>
          <div className="meta">{formatDate(article.publishedAt || article.createdAt, lang)}</div>
        </div>
        {img ? (
          <div className="compact-thumb" style={{backgroundImage:`url(${img})`}} />
        ) : null}
      </div>

      {/* Full variant (card) - default desktop view */}
      <div className="full-variant">
        {img ? (
          <div className={"card-media"} style={{backgroundImage:`url(${img})`}}>
            <div className="card-badge">{capitalize(article.category || 'News')}</div>
            <div className="card-overlay">
              <h3 className="article-headline"><Link href={`/${lang}/articles/${slug}`}>{t}</Link></h3>
              <div className="meta">{formatDate(article.publishedAt || article.createdAt, lang)}</div>
            </div>
          </div>
        ) : (
          <>
            <h3 className={"text-lg font-semibold article-headline mb-2"}>
              <Link href={`/${lang}/articles/${slug}`}>{t}</Link>
            </h3>
            <div className="meta text-sm mb-2">
              {(() => {
                const d = new Date(article.publishedAt || article.createdAt)
                const locale = lang === 'sv' ? 'sv-SE' : 'en-US'
                return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'numeric', day: 'numeric' }).format(d)
              })()}
            </div>
            <p className="article-excerpt">{(article.excerpt || (article.content_en||'').replace(/<[^>]+>/g,'').slice(0,180))}</p>
          </>
        )}
      </div>
    </article>
  )
}
