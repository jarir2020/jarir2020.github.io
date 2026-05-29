import { Link } from 'react-router-dom'
import { ArrowRight, Calendar } from 'lucide-react'
import Tag from './Tag.jsx'

function fmtDate(d) {
  try {
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return d
  }
}

export default function BlogCard({ post }) {
  return (
    <article className="group rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 hover:border-brand-500 dark:hover:border-brand-500 transition-colors">
      <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
        <Calendar size={14} /> {fmtDate(post.date)}
      </div>
      <h3 className="font-bold text-xl mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
      </h3>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">{post.excerpt}</p>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {post.tags?.slice(0, 3).map((t) => <Tag key={t}>{t}</Tag>)}
        </div>
        <Link to={`/blog/${post.slug}`}
              className="inline-flex items-center gap-1 text-sm text-brand-600 dark:text-brand-400 hover:gap-2 transition-all">
          Read <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  )
}
