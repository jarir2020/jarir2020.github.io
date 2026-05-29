import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react'
import profile from '../data/profile.json'
import projects from '../data/projects.json'
import blog from '../data/blog.json'
import ProjectCard from '../components/ProjectCard.jsx'
import BlogCard from '../components/BlogCard.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import { setSEO } from '../lib/seo.js'

export default function Home() {
  useEffect(() => {
    setSEO({
      title: `${profile.name} — ${profile.role}`,
      description: profile.tagline,
    })
  }, [])

  const featured = projects.filter((p) => p.featured).slice(0, 3)
  const recentPosts = [...blog].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 2)

  return (
    <div>
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <p className="text-sm text-brand-600 dark:text-brand-400 mb-3 uppercase tracking-wider font-medium">
          Hi, I'm {profile.shortName}
        </p>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
          {profile.role}.<br />
          <span className="text-neutral-500 dark:text-neutral-400">Building useful web apps.</span>
        </h1>
        <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mb-8">
          {profile.tagline}
        </p>
        <div className="flex flex-wrap gap-3 mb-8">
          <Link to="/projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-md font-medium transition-colors">
            View Projects <ArrowRight size={16} />
          </Link>
          <Link to="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md font-medium transition-colors">
            Get in Touch
          </Link>
        </div>
        <div className="flex items-center gap-3 text-neutral-500">
          <a href={profile.socials.github} target="_blank" rel="noreferrer noopener" aria-label="GitHub"
             className="hover:text-neutral-900 dark:hover:text-neutral-100"><Github size={20} /></a>
          <a href={profile.socials.linkedin} target="_blank" rel="noreferrer noopener" aria-label="LinkedIn"
             className="hover:text-neutral-900 dark:hover:text-neutral-100"><Linkedin size={20} /></a>
          <a href={`mailto:${profile.email}`} aria-label="Email"
             className="hover:text-neutral-900 dark:hover:text-neutral-100"><Mail size={20} /></a>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-neutral-200 dark:border-neutral-800">
        <SectionHeader eyebrow="Selected work" title="Featured Projects"
                       subtitle="A few of the things I've built or am actively maintaining." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
        <div className="mt-8">
          <Link to="/projects"
                className="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400 font-medium hover:gap-2 transition-all">
            See all projects <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {recentPosts.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-neutral-200 dark:border-neutral-800">
          <SectionHeader eyebrow="Writing" title="From the Blog"
                         subtitle="Notes on what I build, break, and learn." />
          <div className="grid sm:grid-cols-2 gap-6">
            {recentPosts.map((p) => <BlogCard key={p.id} post={p} />)}
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-neutral-200 dark:border-neutral-800">
        <div className="rounded-lg bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-800/20 p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Got a project in mind?</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-xl mx-auto">
            I'm open to freelance work, collaborations, and interesting problems.
          </p>
          <Link to="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-md font-medium transition-colors">
            Start a conversation <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
