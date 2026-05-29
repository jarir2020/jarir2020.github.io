import { useEffect } from 'react'
import work from '../data/work.json'
import profile from '../data/profile.json'
import WorkItem from '../components/WorkItem.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import { setSEO } from '../lib/seo.js'

export default function Work() {
  useEffect(() => {
    setSEO({
      title: `Work — ${profile.name}`,
      description: `Work history and roles.`,
    })
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <SectionHeader eyebrow="Experience" title="Work History"
                     subtitle="Roles, what I shipped, and the stack I used." />
      <div className="space-y-4">
        {work.map((w) => <WorkItem key={w.id} item={w} />)}
      </div>
    </div>
  )
}
