/** Next.js configuration. Kept minimal and prepared for i18n and SEO-friendly routes. */
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // We use manual language routing (/en, /sv) in pages; no automatic i18n here.
}

module.exports = nextConfig
