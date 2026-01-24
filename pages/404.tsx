import React from 'react'
import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import Layout from '../components/Layout'

export default function Custom404({ articles = [] }: { articles?: any[] }){
  return (
    <Layout title="Page not found">
      <div className="container py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold mb-4">Page not found</h1>
          <p className="text-lg text-gray-600 mb-6">We couldn't find that page. Try one of the options below or explore recent stories.</p>

          <div className="flex justify-center gap-3 mb-8">
            <Link href="/en" className="px-4 py-2 bg-blue-600 text-white rounded">Home (EN)</Link>
            <Link href="/sv" className="px-4 py-2 border rounded">Svenska</Link>
            <Link href="/admin/signin" className="px-4 py-2 border rounded">Admin</Link>
          </div>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Recent articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {articles.length === 0 && <div className="text-gray-600">No recent articles.</div>}
              {articles.map((a: any) => (
                <article key={a.id} className="p-4 border rounded text-left">
                  <h3 className="font-semibold">
                    <Link href={`/en/articles/${a.slug}`}>{a.title_en}</Link>
                  </h3>
                  <p className="text-sm text-gray-500">{new Intl.DateTimeFormat('en-US').format(new Date(a.publishedAt || a.createdAt))}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  try {
    const db = path.join(process.cwd(), 'data', 'articles.json')
    const raw = fs.readFileSync(db, 'utf-8')
    const all = JSON.parse(raw)
    const recent = all
      .filter((a: any) => a.status === 'published')
      .sort((a: any, b: any) => +new Date(b.publishedAt || b.createdAt) - +new Date(a.publishedAt || a.createdAt))
      .slice(0, 6)
    return { props: { articles: recent } }
  } catch (err) {
    return { props: { articles: [] } }
  }
}
