import type { NextApiRequest, NextApiResponse } from 'next'
import { readArticles, writeArticles, Article } from '../../../lib/articles'
import { v4 as uuidv4 } from 'uuid'

function checkAdmin(req: NextApiRequest){
  // prefer cookie-based session `admin_auth=1` set by /api/admin/login
  if(req.cookies && req.cookies.admin_auth === '1') return true
  // fallback: parse Cookie header
  const cookieHeader = req.headers.cookie || ''
  const parts = cookieHeader.split(';').map(s=>s.trim())
  const match = parts.find(p=>p.startsWith('admin_auth='))
  if(match) return match.split('=')[1] === '1'
  return false
}

export default function handler(req: NextApiRequest, res: NextApiResponse){
  if(req.method === 'GET'){
    const all = readArticles()
    // support simple query filtering
    const { category, status } = req.query
    let out = all
    if(category) out = out.filter(a=>a.category===String(category))
    if(status) out = out.filter(a=>a.status===String(status))
    return res.status(200).json({ articles: out })
  }

  if(req.method === 'POST'){
    if(!checkAdmin(req)) return res.status(401).json({ error: 'unauthorized' })
    const body = req.body as Partial<Article>
    const all = readArticles()
    const id = uuidv4()
    const now = new Date().toISOString()
    const a: Article = {
      id,
      slug: body.slug || `article-${Date.now()}`,
      title_en: body.title_en||'Untitled',
      title_sv: body.title_sv||'',
      content_en: body.content_en||'',
      content_sv: body.content_sv||'',
      category: body.category||'uncategorised',
      tags: body.tags||[],
      featuredImage: body.featuredImage||'',
      status: body.status||'draft',
      createdAt: now,
      publishedAt: body.publishedAt || (body.status==='published'?now:undefined),
      author: body.author||'Admin'
    }
    all.unshift(a)
    writeArticles(all)
    return res.status(201).json({ article: a })
  }

  res.setHeader('Allow', 'GET,POST')
  res.status(405).end('Method Not Allowed')
}
