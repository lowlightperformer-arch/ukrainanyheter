import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { formatDateTime } from '../../lib/formatDate'
import Link from 'next/link'

type Session = {
  id: string
  user: string
  startedAt: string
  ip: string
  userAgent?: string
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    fetch('/api/admin/sessions')
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return
        setSessions(data.sessions || [])
      })
      .catch((err) => { setError(String(err)) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  return (
    <Layout title="Admin Sessions">
      <div className="p-4">
          <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Active Sessions</h1>
          <Link href="/admin/dashboard" className="text-sm text-blue-600">Back</Link>
        </div>

        {loading && <div>Loading sessions…</div>}
        {error && <div className="text-red-600">Error: {error}</div>}

        {!loading && sessions && (
          <div className="overflow-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-4">ID</th>
                  <th className="py-2 pr-4">User</th>
                  <th className="py-2 pr-4">Started</th>
                  <th className="py-2 pr-4">IP</th>
                  <th className="py-2 pr-4">User-Agent</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s.id} className="border-b">
                    <td className="py-2 pr-4 align-top font-mono text-sm">{s.id}</td>
                    <td className="py-2 pr-4">{s.user}</td>
                    <td className="py-2 pr-4">{formatDateTime(s.startedAt,'en')}</td>
                    <td className="py-2 pr-4">{s.ip}</td>
                    <td className="py-2 pr-4 text-sm text-gray-600">{s.userAgent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  )
}
