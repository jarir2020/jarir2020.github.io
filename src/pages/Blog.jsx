import { useEffect } from 'react'
import blog from '../data/blog.json'
import profile from '../data/profile.json'
import BlogCard from '../components/BlogCard.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import { setSEO } from '../lib/seo.js'

export default function Blog() {
  useEffect(() => {
    setSEO({
      title: `Blog — ${profile.name}`,
      description: `Writing by ${profile.name}.`,
    })
  }, [])

  const posts = [...blog].sort((a, b) => (a.date < b.date ? 1 : -1))

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <SectionHeader eyebrow="Writing" title="Blog"
                     subtitle="Notes, build logs, and security write-ups." />
      {posts.length === 0 ? (
        <p className="text-neutral-500 text-center py-12">No posts yet. Check back soon.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {posts.map((p) => <BlogCard key={p.id} post={p} />)}
        </div>
      )}
    </div>
  )
}
