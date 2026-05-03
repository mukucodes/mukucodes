import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import { siteConfig } from '../data/site.config.ts'
import type { APIContext } from 'astro'

export async function GET(context: APIContext) {
	const posts = await getCollection('blog')
	return rss({
		title: siteConfig.title,
		description: siteConfig.description,
		site: context.site!,
		items: posts
			.filter((post) => !post.data.draft)
			.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
			.map((post) => ({
				title: post.data.title,
				description: post.data.description,
				pubDate: post.data.pubDate,
				link: `/post/${post.id}/`
			}))
	})
}
