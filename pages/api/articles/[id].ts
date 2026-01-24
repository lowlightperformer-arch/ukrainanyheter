import type { NextApiRequest, NextApiResponse } from 'next'
import { readArticles, writeArticles, findById } from '../../../lib/articles'

function checkAdmin(req: NextApiRequest){
  if(req.cookies && req.cookies.admin_auth === '1') return true
  const cookieHeader = req.headers.cookie || ''
  const parts = cookieHeader.split(';').map(s=>s.trim())
  const match = parts.find(p=>p.startsWith('admin_auth='))
  if(match) return match.split('=')[1] === '1'
  return false
}

export default function handler(req: NextApiRequest, res: NextApiResponse){
  const { id } = req.query
  if(typeof id !== 'string') return res.status(400).json({ error: 'invalid id' })
  const all = readArticles()
  const idx = all.findIndex(a=>a.id===id)
  if(req.method === 'GET'){
    const item = all.find(a=>a.id===id)
    if(!item) return res.status(404).json({ error: 'not found' })
    return res.status(200).json({ article: item })
  }

  if(req.method === 'PUT'){
    if(!checkAdmin(req)) return res.status(401).json({ error: 'unauthorized' })
    if(idx === -1) return res.status(404).json({ error: 'not found' })
    const body = req.body
    const updated = { ...all[idx], ...body }
    all[idx] = updated
    writeArticles(all)
    return res.status(200).json({ article: updated })
  }

  if(req.method === 'DELETE'){
    if(!checkAdmin(req)) return res.status(401).json({ error: 'unauthorized' })
    if(idx === -1) return res.status(404).json({ error: 'not found' })
    const removed = all.splice(idx,1)[0]
    writeArticles(all)
    return res.status(200).json({ article: removed })
  }

  res.setHeader('Allow','GET,PUT,DELETE')
  res.status(405).end('Method Not Allowed')
}
