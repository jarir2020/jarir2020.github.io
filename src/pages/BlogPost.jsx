import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ArrowLeft, Calendar } from 'lucide-react'
import blog from '../data/blog.json'
import profile from '../data/profile.json'
import Tag from '../components/Tag.jsx'
import { setSEO } from '../lib/seo.js'
import { loadPostBody } from '../lib/markdown.js'

function fmtDate(d) {
  try {
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return d
  }
}

export default function BlogPost() {
  const { slug } = useParams()
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(true)

  const meta = blog.find((p) => p.slug === slug)

  useEffect(() => {
    if (meta) {
      setSEO({
        title: `${meta.title} — ${profile.name}`,
        description: meta.excerpt,
      })
    }
  }, [meta])

  useEffect(() => {
    let mounted = true
    loadPostBody(slug).then((text) => {
      if (mounted) {
        setBody(text || '')
        setLoading(false)
      }
    })
    return () => { mounted = false }
  }, [slug])

  if (!meta) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-2">Post not found</h2>
        <Link to="/blog" className="text-brand-600 dark:text-brand-400 hover:underline">← Back to blog</Link>
      </div>
    )
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <Link to="/blog"
            className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 mb-8">
        <ArrowLeft size={14} /> All posts
      </Link>

      <header className="mb-8 pb-8 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2 text-sm text-neutral-500 mb-3">
          <Calendar size={14} /> {fmtDate(meta.date)}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">{meta.title}</h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">{meta.excerpt}</p>
        {meta.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {meta.tags.map((t) => <Tag key={t}>{t}</Tag>)}
          </div>
        )}
      </header>

      <div className="prose-content">
        {loading ? (
          <p className="text-neutral-500">Loading…</p>
        ) : body ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
        ) : (
          <p className="text-neutral-500">Body not found for this post.</p>
        )}
      </div>
    </article>
  )
}
