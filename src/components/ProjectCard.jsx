import { ExternalLink, Github, Lock } from 'lucide-react'
import Tag from './Tag.jsx'

const typeBadge = {
  'open-source': { label: 'Open Source', color: 'green' },
  'private': { label: 'Private', color: 'brand' },
  'pentest': { label: 'Pentest', color: 'red' },
}

export default function ProjectCard({ project }) {
  const badge = typeBadge[project.type] || typeBadge['open-source']
  return (
    <article className="group rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden flex flex-col hover:border-brand-500 dark:hover:border-brand-500 transition-colors">
      <div className="aspect-video bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 flex items-center justify-center">
        <span className="text-3xl font-bold text-neutral-300 dark:text-neutral-700">
          {project.name.charAt(0)}
        </span>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-lg">{project.name}</h3>
          <Tag color={badge.color}>{badge.label}</Tag>
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">{project.tagline}</p>
        <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-4 flex-1">{project.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.stack.map((s) => <Tag key={s}>{s}</Tag>)}
        </div>

        <div className="flex items-center gap-3 text-sm">
          {project.url && (
            <a href={project.url} target="_blank" rel="noreferrer noopener"
               className="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400 hover:underline">
              <ExternalLink size={14} /> Visit
            </a>
          )}
          {project.repo ? (
            <a href={project.repo} target="_blank" rel="noreferrer noopener"
               className="inline-flex items-center gap-1 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100">
              <Github size={14} /> Source
            </a>
          ) : (
            <span className="inline-flex items-center gap-1 text-neutral-400 dark:text-neutral-500">
              <Lock size={14} /> Private source
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
