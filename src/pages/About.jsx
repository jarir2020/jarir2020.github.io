import { useEffect } from 'react'
import { Download, MapPin } from 'lucide-react'
import profile from '../data/profile.json'
import SectionHeader from '../components/SectionHeader.jsx'
import Tag from '../components/Tag.jsx'
import { setSEO } from '../lib/seo.js'

export default function About() {
  useEffect(() => {
    setSEO({
      title: `About — ${profile.name}`,
      description: `About ${profile.name}, ${profile.role}.`,
    })
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <SectionHeader eyebrow="About" title={`I'm ${profile.shortName}.`} />

      <div className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
        <MapPin size={14} /> {profile.location}
      </div>

      <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-8 leading-relaxed">
        {profile.bio}
      </p>

      <a href={profile.cv} download
         className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md text-sm font-medium transition-colors mb-12">
        <Download size={16} /> Download CV
      </a>

      <h3 className="text-2xl font-bold mb-6">Skills</h3>
      <div className="grid sm:grid-cols-2 gap-6">
        {Object.entries(profile.skills).map(([category, items]) => (
          <div key={category} className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-5">
            <h4 className="font-semibold mb-3 capitalize">{category}</h4>
            <div className="flex flex-wrap gap-1.5">
              {items.map((s) => <Tag key={s}>{s}</Tag>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
