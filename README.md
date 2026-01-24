# Ukrainanyheter — Bilingual News Prototype

This repository contains a production-minded prototype of a bilingual news site (English & Swedish) with an English-only admin panel.

Quick start (macOS / Linux):

```bash
cd /Users/alex/Desktop/dev/ukrainanyheter
cp .env.local.example .env.local
# Set ADMIN_PASSWORD in .env.local
npm install
npm run dev
```

Notes:
- Frontend: Next.js + TypeScript + Tailwind CSS
- Admin: English-only at `/admin` (basic auth using `ADMIN_PASSWORD` cookie, dev-only)
- Data store: file-based JSON at `/data/articles.json` for easy prototype — replace with a database for production
- Localization: manual routes `/en` and `/sv`; each article stores `title_en`, `title_sv`, `content_en`, `content_sv`

Architecture decisions are commented inline in components and API routes.
