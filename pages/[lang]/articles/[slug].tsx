import { GetStaticPaths, GetStaticProps } from 'next'
import { readFileSync } from 'fs'
import path from 'path'
import Layout from '../../../components/Layout'

type Props = { article?: any }

import { formatDate } from '../../../lib/formatDate'

export default function ArticlePage({ article }: Props){
  if(!article) return <Layout><div className="container py-12">Article not found</div></Layout>
  return (
    <Layout title={article.title}>
      <div className="container py-8">
        <h1 className="article-headline text-4xl font-extrabold mb-4">{article.title}</h1>
        <div className="meta text-sm text-gray-600 mb-6">{article.author} — {formatDate(article.publishedAt||article.createdAt, (article.lang||'en'))}</div>
        <article className="article-body max-w-3xl" dangerouslySetInnerHTML={{__html: article.content}} />
      </div>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async ()=>{
  const db = path.join(process.cwd(),'data','articles.json')
  const raw = readFileSync(db,'utf-8')
  const all = JSON.parse(raw)
  const paths: any[] = []
  for(const a of all){
    if(a.status !== 'published') continue
    paths.push({ params: { lang: 'en', slug: a.slug } })
    paths.push({ params: { lang: 'sv', slug: a.slug } })
  }
  return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps = async ({ params })=>{
  const { lang, slug } = params as any
  const db = path.join(process.cwd(),'data','articles.json')
  const raw = readFileSync(db,'utf-8')
  const all = JSON.parse(raw)
  const a = all.find((x:any)=>x.slug===slug && x.status==='published')
  if(!a) return { notFound: true }
  const article = {
    title: lang==='sv' ? (a.title_sv||a.title_en) : a.title_en,
    content: lang==='sv' ? (a.content_sv||a.content_en) : a.content_en,
    author: a.author,
    publishedAt: a.publishedAt || null,
    createdAt: a.createdAt || null,
    lang
  }
  return { props: { article }, revalidate: 60 }
}
