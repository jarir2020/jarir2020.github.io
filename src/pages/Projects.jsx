import { useEffect, useMemo, useState } from 'react'
import projects from '../data/projects.json'
import profile from '../data/profile.json'
import ProjectCard from '../components/ProjectCard.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import { setSEO } from '../lib/seo.js'

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'open-source', label: 'Open Source' },
  { key: 'private', label: 'Private' },
  { key: 'pentest', label: 'Pentest' },
]

export default function Projects() {
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    setSEO({
      title: `Projects — ${profile.name}`,
      description: `Projects by ${profile.name}.`,
    })
  }, [])

  const visible = useMemo(() => {
    if (filter === 'all') return projects
    return projects.filter((p) => p.type === filter)
  }, [filter])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <SectionHeader eyebrow="Things I built" title="Projects"
                     subtitle="A mix of open-source tools, client work, and pentest learning labs." />

      <div className="flex flex-wrap gap-2 mb-8">
        {FILTERS.map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    filter === f.key
                      ? 'bg-brand-600 text-white'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  }`}>
            {f.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-neutral-500 text-center py-12">No projects in this category yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
      )}
    </div>
  )
}
