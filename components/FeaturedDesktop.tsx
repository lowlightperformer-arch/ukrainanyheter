import React from 'react'
import ArticleCard from './ArticleCard'

type Props = {
	articles?: any[]
	lang: string
}

export default function FeaturedDesktop({ articles = [], lang }: Props){
	if(!articles || articles.length === 0) return null

	const lead = articles[0]
	const rest = articles.slice(1,4)

	return (
		<section className="featured-desktop hidden md:block mb-6">
			<div className="grid grid-cols-3 gap-6">
				<div className="col-span-2">
					<div className="card-media" style={{backgroundImage:`url(${lead.featuredImage || lead.image || '/placeholder.jpg'})`}}>
						<div className="card-badge">{lead.category || 'News'}</div>
						<div className="card-overlay">
							<h2 className="article-headline"><a href={`/${lang}/articles/${lead.slug}`}>{lang === 'sv' ? lead.title_sv : lead.title_en}</a></h2>
						</div>
					</div>
				</div>

				<div className="col-span-1 flex flex-col gap-4">
					{rest.map(a => (
						<ArticleCard key={a.id} article={a} lang={lang} />
					))}
				</div>
			</div>
		</section>
	)
}
