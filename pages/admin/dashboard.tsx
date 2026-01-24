import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import Link from 'next/link'

type Article = {
  id: string
  title_en: string
  status?: string
}

export default function Dashboard(){
  const [articles, setArticles] = useState<Article[] | null>(null)

  useEffect(()=>{
    fetch('/api/articles')
      .then(r=>r.json())
      .then(data=>setArticles(data.articles || []))
  },[])

  return (
    <Layout title="Admin Dashboard">
      <div className="p-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Admin dashboard</h1>
          <div className="space-x-2">
            <Link href="/admin/editor" className="inline-block px-4 py-2 bg-green-600 text-white rounded">New Article</Link>
            <Link href="/admin/sessions" className="inline-block px-4 py-2 bg-blue-600 text-white rounded">Sessions</Link>
          </div>
        </div>

        <p className="mb-4">Manage articles below.</p>

        {!articles && <div>Loading…</div>}
        {articles && (
          <div className="space-y-2">
            {articles.map(a=> (
              <div key={a.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  { (a as any).featuredImage ? <img src={(a as any).featuredImage} style={{width:80,height:60,objectFit:'cover',borderRadius:6}} /> : <div style={{width:80,height:60,background:'#f3f4f6',borderRadius:6}} /> }
                  <div>
                    <div className="font-medium">{a.title_en}</div>
                    <div className="text-xs text-gray-500">{a.status}</div>
                  </div>
                </div>
                <div className="space-x-2">
                  <Link href={`/admin/editor?id=${a.id}`} className="text-sm text-blue-600">Edit</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
