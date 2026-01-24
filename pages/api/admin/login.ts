import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse){
  if(req.method !== 'POST') return res.status(405).end('Method Not Allowed')
  const { username, password } = req.body || {}
  // Simple credential check (dev-only). Replace with real auth for production.
  if(username === 'admin' && password === '123456'){
    // Set a simple HttpOnly cookie that marks the session
    const cookie = `admin_auth=1; Path=/; HttpOnly; SameSite=Lax`
    res.setHeader('Set-Cookie', cookie)
    return res.status(200).json({ ok: true })
  }
  return res.status(401).json({ error: 'Invalid credentials' })
}
