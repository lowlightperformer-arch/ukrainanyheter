import fs from 'fs'
import path from 'path'

export type Article = {
  id: string
  slug: string
  title_en: string
  title_sv?: string
  content_en?: string
  content_sv?: string
  category?: string
  tags?: string[]
  featuredImage?: string
  status?: 'draft'|'published'
  createdAt?: string
  publishedAt?: string
  author?: string
}

const DB = path.join(process.cwd(), 'data', 'articles.json')

export function readArticles(): Article[] {
  try{
    const raw = fs.readFileSync(DB, 'utf-8')
    return JSON.parse(raw)
  }catch(e){
    return []
  }
}

export function writeArticles(items: Article[]){
  fs.writeFileSync(DB, JSON.stringify(items, null, 2), 'utf-8')
}

export function findById(id: string){
  return readArticles().find(a=>a.id===id)
}

export function findBySlug(slug: string){
  return readArticles().find(a=>a.slug===slug)
}
