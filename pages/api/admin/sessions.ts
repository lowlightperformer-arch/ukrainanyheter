import { NextApiRequest, NextApiResponse } from 'next'

type Session = {
  id: string
  user: string
  startedAt: string
  ip: string
  userAgent?: string
}

const mockSessions: Session[] = [
  { id: 's_1', user: 'admin@example.com', startedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), ip: '203.0.113.12', userAgent: 'Mozilla/5.0' },
  { id: 's_2', user: 'editor@example.com', startedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), ip: '198.51.100.45', userAgent: 'Chrome/90.0' },
  { id: 's_3', user: 'viewer@example.com', startedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), ip: '192.0.2.33', userAgent: 'Safari/14.0' },
]

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/json')
  res.status(200).json({ sessions: mockSessions })
}
