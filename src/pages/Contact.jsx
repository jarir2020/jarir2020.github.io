import { useEffect, useState } from 'react'
import { Mail, Github, Linkedin, Send } from 'lucide-react'
import profile from '../data/profile.json'
import SectionHeader from '../components/SectionHeader.jsx'
import { setSEO } from '../lib/seo.js'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  useEffect(() => {
    setSEO({
      title: `Contact — ${profile.name}`,
      description: `Get in touch with ${profile.name}.`,
    })
  }, [])

  function onSubmit(e) {
    e.preventDefault()
    const subject = encodeURIComponent(`Portfolio contact from ${form.name || 'someone'}`)
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    )
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <SectionHeader eyebrow="Say hi" title="Get in Touch"
                     subtitle="Open to freelance work, collaborations, or just interesting conversations." />

      <div className="grid sm:grid-cols-3 gap-3 mb-10">
        <a href={`mailto:${profile.email}`}
           className="flex items-center gap-2 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-brand-500 transition-colors">
          <Mail size={18} className="text-brand-600 dark:text-brand-400" />
          <span className="text-sm truncate">{profile.email}</span>
        </a>
        <a href={profile.socials.github} target="_blank" rel="noreferrer noopener"
           className="flex items-center gap-2 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-brand-500 transition-colors">
          <Github size={18} className="text-brand-600 dark:text-brand-400" />
          <span className="text-sm">GitHub</span>
        </a>
        <a href={profile.socials.linkedin} target="_blank" rel="noreferrer noopener"
           className="flex items-center gap-2 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-brand-500 transition-colors">
          <Linkedin size={18} className="text-brand-600 dark:text-brand-400" />
          <span className="text-sm">LinkedIn</span>
        </a>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
            <input id="name" type="text" required
                   value={form.name}
                   onChange={(e) => setForm({ ...form, name: e.target.value })}
                   className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input id="email" type="email" required
                   value={form.email}
                   onChange={(e) => setForm({ ...form, email: e.target.value })}
                   className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
          <textarea id="message" rows="6" required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500" />
        </div>
        <button type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-md font-medium transition-colors">
          <Send size={16} /> Send Message
        </button>
        <p className="text-xs text-neutral-500">
          This opens your email client with the message pre-filled. No data is sent or stored on a server.
        </p>
      </form>
    </div>
  )
}
