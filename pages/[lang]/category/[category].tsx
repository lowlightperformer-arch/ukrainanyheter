import { GetStaticPaths, GetStaticProps } from 'next'
import { readFileSync } from 'fs'
import path from 'path'
import Layout from '../../../components/Layout'
import Link from 'next/link'
import ArticleCard from '../../../components/ArticleCard'
import { formatDate } from '../../../lib/formatDate'
import { capitalize } from '../../../lib/string'

export default function CategoryPage({ articles = [], category, lang }: any){
  return (
    <Layout title={`${category} — Ukrainanyheter`}>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">{capitalize(category)}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((a:any)=> (
            <ArticleCard key={a.id} article={{...a, compact:true}} lang={lang} />
          ))}
        </div>
      </div>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async ()=>{
  const db = path.join(process.cwd(),'data','articles.json')
  const raw = readFileSync(db,'utf-8')
  const all = JSON.parse(raw)
  const cats = Array.from(new Set(all.map((a:any)=>a.category||'uncategorised')))
  const paths: any[] = []
  for(const c of cats){
    paths.push({ params: { lang: 'en', category: c } })
    paths.push({ params: { lang: 'sv', category: c } })
  }
  return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps = async ({ params })=>{
  const { lang, category } = params as any
  const db = path.join(process.cwd(),'data','articles.json')
  const raw = readFileSync(db,'utf-8')
  const all = JSON.parse(raw)
  const articles = all.filter((a:any)=>a.status==='published' && (a.category||'uncategorised')===category)
  return { props: { articles, category, lang }, revalidate: 60 }
}
