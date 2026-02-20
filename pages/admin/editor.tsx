import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Layout from '../../components/Layout'
import { capitalize } from '../../lib/string'
import { useRouter } from 'next/router'
import { CATEGORIES_SV } from '../../lib/categories'
import Link from 'next/link'
import { quillModulesWithNofollow } from '../../lib/quillConfig'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

export default function Editor(){
  const router = useRouter()
  const { id } = router.query
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<any>({ title_en: '', title_sv: '', slug: '', content_en: '', content_sv: '', category: 'uncategorised', topic: '', status: 'draft', imageCredit: '', imageAlt: '', meta_title: '', meta_description: '' })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const CATEGORIES = ['war','politics','social','tech','culture','sport','se-ua','uncategorised']
  const TOPICS = [
    { value: '', label: 'None' },
    { value: 'zelensky', label: 'Zelensky' },
    { value: 'kyiv', label: 'Kyiv' },
    { value: 'usyk', label: 'Usyk' }
  ]

  useEffect(()=>{
    if(id){
      fetch(`/api/articles/${id}`)
        .then(r=>r.json())
        .then(d=>{ if(d.article) setForm({ ...d.article }) })
    }
  },[id])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('../../lib/customQuillLink')
    }
  }, [])

  useEffect(()=>{
    if(form.featuredImage) setImagePreview(form.featuredImage)
  },[form.featuredImage])

  async function save(){
    setLoading(true)
    const method = form.id ? 'PUT' : 'POST'
    const url = form.id ? `/api/articles/${form.id}` : '/api/articles'
    try {
      const res = await fetch(url, {
        method,
        credentials: 'same-origin',
        headers: { 'content-type':'application/json' },
        body: JSON.stringify(form)
      })
      if(res.ok){
        router.push('/admin/dashboard')
        return
      }
      if(res.status === 401){
        alert('Session expired. Please sign in again.')
        router.push('/admin/signin')
        return
      }
      let message = 'Save failed'
      try {
        const data = await res.json()
        if(data?.message) message = data.message
      } catch {
        // ignore JSON parse errors
      }
      alert(message)
    } finally {
      setLoading(false)
    }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>){
    const f = e.target.files && e.target.files[0]
    if(!f) return
    const reader = new FileReader()
    reader.onload = ()=>{
      const data = String(reader.result || '')
      setForm({...form, featuredImage: data})
      setImagePreview(data)
    }
    reader.readAsDataURL(f)
  }

  return (
    <Layout title="Editor">
      <div className="container py-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Article editor</h1>
          <Link href="/admin/dashboard" className="inline-block px-4 py-2 bg-gray-600 text-white rounded">
            Back to dashboard
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <input className="w-full p-2 border rounded mb-3" placeholder="Title (SV)" value={form.title_sv} onChange={e=>setForm({...form, title_sv: e.target.value})} />
            <input className="w-full p-2 border rounded mb-3" placeholder="Slug" value={form.slug} onChange={e=>setForm({...form, slug: e.target.value})} />

            <div className="mb-3">
              <label className="block text-sm font-semibold mb-1">Featured image</label>
              <input type="file" accept="image/*" onChange={handleFile} />
              {imagePreview && <div className="mt-2"><img src={imagePreview} alt="preview" style={{maxWidth:240,borderRadius:8}} /></div>}
              <input className="w-full p-2 border rounded mt-3" placeholder="Photo author" value={form.imageCredit} onChange={e=>setForm({...form, imageCredit: e.target.value})} />
              <input className="w-full p-2 border rounded mt-3" placeholder="Image alt text" value={form.imageAlt} onChange={e=>setForm({...form, imageAlt: e.target.value})} />
            </div>

            <label className="block font-semibold mt-4 mb-2">Content (SV)</label>
            <ReactQuill theme="snow" value={form.content_sv} onChange={(v)=>setForm({...form, content_sv: v})} modules={quillModulesWithNofollow} />

            <hr className="my-6" />

            <div>
              <label className="block text-sm font-semibold mb-2">Meta Title</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded text-sm"
                value={form.meta_title || ''}
                onChange={(e) => setForm({...form, meta_title: e.target.value})}
                placeholder="SEO meta title"
              />
              <p className="text-xs text-gray-500 mt-1">Shown in browser tab and search results</p>
              <p className="text-xs text-gray-400 mt-1">Length: {(form.meta_title || '').length} characters (50-60 recommended)</p>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold mb-2">Meta Description</label>
              <textarea 
                className="w-full p-2 border rounded text-sm"
                value={form.meta_description || ''}
                onChange={(e) => setForm({...form, meta_description: e.target.value})}
                placeholder="SEO meta description"
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">Shown in search results</p>
              <p className="text-xs text-gray-400 mt-1">Length: {(form.meta_description || '').length} characters (155-160 recommended)</p>
            </div>
          </div>
          <aside className="space-y-3">
            <div>
              <label className="block text-sm">Category</label>
              <select className="w-full p-2 border rounded" value={form.category} onChange={e=>setForm({...form, category: e.target.value})}>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{CATEGORIES_SV[c] || capitalize(c)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm">Topic (Secondary Category)</label>
              <select className="w-full p-2 border rounded" value={form.topic || ''} onChange={e=>setForm({...form, topic: e.target.value})}>
                {TOPICS.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm">Status</label>
              <select className="w-full p-2 border rounded" value={form.status} onChange={e=>setForm({...form, status: e.target.value})}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div>
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded" onClick={save} disabled={loading}>{loading? 'Saving…' : 'Save'}</button>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  )
}
