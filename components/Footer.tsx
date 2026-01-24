import Link from 'next/link'

export default function Footer(){
  return (
    <footer className="border-t mt-12 py-8 bg-gray-50">
      <div className="container grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="font-semibold">About Ukrainanyheter</h4>
          <p className="text-sm text-gray-600">Independent bilingual coverage focused on Ukraine.</p>
        </div>
        <div>
          <h4 className="font-semibold">Categories</h4>
          <ul className="text-sm text-gray-600">
            <li><Link href="/en/category/war">War</Link></li>
            <li><Link href="/en/category/politics">Politics</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Language</h4>
          <p className="text-sm text-gray-600">English / Svenska</p>
        </div>
      </div>
      <div className="container text-center text-xs text-gray-500 mt-6">© {new Date().getFullYear()} Ukrainanyheter</div>
    </footer>
  )
}
