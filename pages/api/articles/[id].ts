import type { NextApiRequest, NextApiResponse } from 'next'
import { readArticles, writeArticles, findById } from '../../../lib/articles'
import { sendError, sendMethodNotAllowed } from '../../../lib/apiUtils'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '25mb'
    }
  }
}

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
  if(typeof id !== 'string') return sendError(res, 400, { error: 'invalid_id', code: 'invalid_id', message: 'Invalid id parameter' })
  const all = readArticles()
  const idx = all.findIndex(a=>a.id===id)
  if(req.method === 'GET'){
    const item = all.find(a=>a.id===id)
    if(!item) return sendError(res, 404, { error: 'not_found', code: 'not_found', message: 'Article not found' })
    return res.status(200).json({ article: item })
  }

  if(req.method === 'PUT'){
    if(!checkAdmin(req)) return sendError(res, 401, { error: 'unauthorized', code: 'unauthorized', message: 'Authentication required' })
    if(idx === -1) return sendError(res, 404, { error: 'not_found', code: 'not_found', message: 'Article not found' })
    const body = req.body
    const now = new Date().toISOString()
    const updated = { ...all[idx], ...body, updatedAt: now }
    all[idx] = updated
    writeArticles(all)
    return res.status(200).json({ article: updated })
  }

  if(req.method === 'DELETE'){
    if(!checkAdmin(req)) return sendError(res, 401, { error: 'unauthorized', code: 'unauthorized', message: 'Authentication required' })
    if(idx === -1) return sendError(res, 404, { error: 'not_found', code: 'not_found', message: 'Article not found' })
    const removed = all.splice(idx,1)[0]
    writeArticles(all)
    return res.status(200).json({ article: removed })
  }

  if(req.method === 'PATCH'){
    if(!checkAdmin(req)) return sendError(res, 401, { error: 'unauthorized', code: 'unauthorized', message: 'Authentication required' })
    if(idx === -1) return sendError(res, 404, { error: 'not_found', code: 'not_found', message: 'Article not found' })
    const body = req.body
    const updated = { ...all[idx], ...body }
    all[idx] = updated
    writeArticles(all)
    return res.status(200).json({ article: updated })
  }

  res.setHeader('Allow','GET,PUT,PATCH,DELETE')
  return sendMethodNotAllowed(res, 'GET,PUT,PATCH,DELETE')
}
