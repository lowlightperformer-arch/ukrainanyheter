import React, { useState } from 'react'
import Layout from '../../components/Layout'
import { useRouter } from 'next/router'

export default function Signin(){
  const router = useRouter()
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent){
    e.preventDefault()
    setErr(null)
    setLoading(true)
    try{
      const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'content-type':'application/json' }, body: JSON.stringify({ username: user, password: pass }) })
      if(res.ok){
        router.push('/admin/dashboard')
      }else{
        const json = await res.json()
        setErr(json?.error || 'Login failed')
      }
    }catch(e:any){ setErr(e.message || 'Network error') }
    setLoading(false)
  }

  return (
    <Layout title="Admin Signin">
      <div className="container py-12">
        <div className="max-w-md mx-auto p-6 border rounded bg-white">
          <h1 className="text-xl font-semibold mb-4">Admin login</h1>
          <form onSubmit={submit}>
            <label className="block text-sm mb-1">Username</label>
            <input className="w-full p-2 border rounded mb-3" value={user} onChange={e=>setUser(e.target.value)} />
            <label className="block text-sm mb-1">Password</label>
            <input type="password" className="w-full p-2 border rounded mb-3" value={pass} onChange={e=>setPass(e.target.value)} />
            {err && <div className="text-sm text-red-600 mb-2">{err}</div>}
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>{loading? 'Signing in…' : 'Sign in'}</button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
