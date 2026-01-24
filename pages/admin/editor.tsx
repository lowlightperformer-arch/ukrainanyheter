import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Layout from '../../components/Layout'
import { capitalize } from '../../lib/string'
import { useRouter } from 'next/router'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

export default function Editor(){
  const router = useRouter()
  const { id } = router.query
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<any>({ title_en: '', title_sv: '', slug: '', content_en: '', content_sv: '', category: 'uncategorised', status: 'draft' })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const CATEGORIES = ['war','politics','social','tech','culture','uncategorised']

  useEffect(()=>{
    if(id){
      fetch(`/api/articles/${id}`)
        .then(r=>r.json())
        .then(d=>{ if(d.article) setForm({ ...d.article }) })
    }
  },[id])

  useEffect(()=>{
    if(form.featuredImage) setImagePreview(form.featuredImage)
  },[form.featuredImage])

  async function save(){
    setLoading(true)
    const method = form.id ? 'PUT' : 'POST'
    const url = form.id ? `/api/articles/${form.id}` : '/api/articles'
    const res = await fetch(url, {
      method,
      credentials: 'same-origin',
      headers: { 'content-type':'application/json' },
      body: JSON.stringify(form)
    })
    if(res.ok){
      router.push('/admin/dashboard')
    }else{
      alert('Save failed')
    }
    setLoading(false)
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
        <h1 className="text-2xl font-semibold mb-4">Article editor</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <input className="w-full p-2 border rounded mb-3" placeholder="Title (EN)" value={form.title_en} onChange={e=>setForm({...form, title_en: e.target.value})} />
            <input className="w-full p-2 border rounded mb-3" placeholder="Title (SV)" value={form.title_sv} onChange={e=>setForm({...form, title_sv: e.target.value})} />
            <input className="w-full p-2 border rounded mb-3" placeholder="Slug" value={form.slug} onChange={e=>setForm({...form, slug: e.target.value})} />

            <div className="mb-3">
              <label className="block text-sm font-semibold mb-1">Featured image</label>
              <input type="file" accept="image/*" onChange={handleFile} />
              {imagePreview && <div className="mt-2"><img src={imagePreview} alt="preview" style={{maxWidth:240,borderRadius:8}} /></div>}
            </div>

            <label className="block font-semibold mb-2">Content (EN)</label>
            <ReactQuill theme="snow" value={form.content_en} onChange={(v)=>setForm({...form, content_en: v})} />

            <label className="block font-semibold mt-4 mb-2">Content (SV)</label>
            <ReactQuill theme="snow" value={form.content_sv} onChange={(v)=>setForm({...form, content_sv: v})} />
          </div>
          <aside className="space-y-3">
            <div>
              <label className="block text-sm">Category</label>
              <select className="w-full p-2 border rounded" value={form.category} onChange={e=>setForm({...form, category: e.target.value})}>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{capitalize(c)}</option>
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
