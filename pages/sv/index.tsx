import fs from 'fs'
import path from 'path'
import Layout from '../../components/Layout'
import ArticleCard from '../../components/ArticleCard'
import FeaturedDesktop from '../../components/FeaturedDesktop'
import { formatDate } from '../../lib/formatDate'
import { capitalize } from '../../lib/string'

export default function Home({ articles = [] }: { articles?: any[] }){
  return (
    <Layout title="Ukrainanyheter — Senaste nyheterna från Ukraina">
      <div className="container page-hero">
        <div className="mb-8">
          <h1 className="text-display font-extrabold">Senaste nyheterna från Ukraina</h1>
          <p className="text-sm text-gray-600 mt-3">Oberoende tvåspråkig bevakning med fokus på Ukraina — korta uppdateringar och sammanhang.</p>
        </div>

        {articles.length > 0 ? (
          <>
            {/* Desktop featured layout */}
            <FeaturedDesktop articles={articles.slice(0,4)} lang="sv" />

            {/* Mobile / small-screen layout */}
            <section className="mb-6 md:hidden">
              <div className="featured-block">
                <div className="hero-left">
                  <div className="card-media" style={{backgroundImage:`url(${articles[0].featuredImage || articles[0].image || '/placeholder.jpg'})`}}>
                    <div className="card-badge">{capitalize(articles[0].category || 'News')}</div>
                    <div className="card-overlay">
                      <h3 className="article-headline"><a href={`/sv/articles/${articles[0].slug}`}>{articles[0].title_sv || articles[0].title_en}</a></h3>
                      <div className="meta">{formatDate(articles[0].publishedAt||articles[0].createdAt,'sv')}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="preview-stack">
                {articles.slice(1,4).map(a=> (
                  <ArticleCard key={a.id} article={a} lang="sv" />
                ))}
              </div>
            </section>
          </>
        ) : (
          <section className="grid grid-cols-1">
            <p>Inga artiklar ännu.</p>
          </section>
        )}
      </div>
    </Layout>
  )
}

export async function getStaticProps(){
  try{
    const db = path.join(process.cwd(),'data','articles.json')
    const raw = fs.readFileSync(db,'utf-8')
    const all = JSON.parse(raw)
    const published = all.filter((a:any)=>a.status==='published')
    return { props: { articles: published } }
  }catch(e){
    return { props: { articles: [] } }
  }
}
