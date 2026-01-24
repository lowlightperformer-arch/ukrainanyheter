import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse){
  if(req.method !== 'POST') return res.status(405).end('Method Not Allowed')
  // Clear the cookie
  const cookie = `admin_auth=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax`
  res.setHeader('Set-Cookie', cookie)
  return res.status(200).json({ ok: true })
}
