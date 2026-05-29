import { useEffect, useState } from 'react'
import {
  Lock, Download, FileText, FolderOpen, User as UserIcon, LogOut, Eye,
  Plus, Pencil, Trash2, ArrowLeft, Copy as CopyIcon, Save, ExternalLink,
  Upload, Image as ImageIcon
} from 'lucide-react'
import profile from '../data/profile.json'
import projects from '../data/projects.json'
import blog from '../data/blog.json'
import work from '../data/work.json'
import { verifyPassword, isAuthed, setAuthed, clearAuth } from '../lib/adminGate.js'
import { downloadJSON, downloadText, downloadBlob, fmtSize } from '../lib/downloader.js'
import { loadPostBody, listPostSlugs } from '../lib/markdown.js'

const TABS = [
  { key: 'viewer', label: 'JSON Viewer', icon: Eye },
  { key: 'blog', label: 'Blog', icon: FileText },
  { key: 'projects', label: 'Projects', icon: FolderOpen },
  { key: 'profile', label: 'Profile', icon: UserIcon },
  { key: 'files', label: 'Files', icon: Upload },
]

const PROJECT_TYPES = ['open-source', 'private', 'pentest']
const REPO_EDIT_BASE = 'https://github.com/jarir2020/jarir2020.github.io/edit/main'

function slugify(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function EditWorkflowBanner({ filePath, fileLabel }) {
  return (
    <div className="rounded-md border border-brand-200 bg-brand-50 dark:border-brand-800 dark:bg-brand-900/20 p-3 text-sm text-brand-900 dark:text-brand-100">
      <p className="font-semibold mb-1">How saving works</p>
      <ol className="list-decimal list-inside text-xs space-y-0.5 text-brand-900/80 dark:text-brand-100/80">
        <li>Edit the fields below.</li>
        <li>Click <strong>Save</strong> — your browser downloads <code>{fileLabel}</code>.</li>
        <li>Open <a href={`${REPO_EDIT_BASE}/${filePath}`} target="_blank" rel="noreferrer noopener"
              className="underline font-medium">{filePath} on GitHub</a>, replace its content with the downloaded file, commit on main.</li>
        <li>GitHub Action redeploys (~30s) — site updates automatically.</li>
      </ol>
    </div>
  )
}

export default function JarirPanel() {
  const [authed, setAuthedState] = useState(false)
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [tab, setTab] = useState('viewer')

  useEffect(() => {
    document.title = 'Jarir Panel'
    setAuthedState(isAuthed())
  }, [])

  async function onUnlock(e) {
    e.preventDefault()
    setErr('')
    const ok = await verifyPassword(pw)
    if (ok) {
      setAuthed()
      setAuthedState(true)
      setPw('')
    } else {
      setErr('Wrong password.')
    }
  }

  function onLogout() {
    clearAuth()
    setAuthedState(false)
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-4">
        <form onSubmit={onUnlock} className="w-full max-w-sm bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lock size={18} className="text-brand-600" />
            <h1 className="font-bold">Jarir Panel</h1>
          </div>
          <label htmlFor="pw" className="block text-sm font-medium mb-1">Password</label>
          <input id="pw" type="password" autoFocus
                 value={pw}
                 onChange={(e) => setPw(e.target.value)}
                 className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-900 mb-3 focus:outline-none focus:ring-2 focus:ring-brand-500" />
          {err && <p className="text-sm text-red-600 mb-3">{err}</p>}
          <button type="submit"
                  className="w-full px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-md font-medium">
            Unlock
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <h1 className="font-bold flex items-center gap-2">
            <Lock size={16} className="text-brand-600" /> Jarir Panel
          </h1>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" rel="noreferrer noopener"
               className="inline-flex items-center gap-1.5 text-sm text-brand-600 dark:text-brand-400 hover:underline">
              <ExternalLink size={14} /> Visit site
            </a>
            <button onClick={onLogout}
                    className="inline-flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100">
              <LogOut size={14} /> Lock
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-wrap gap-2 mb-6 border-b border-neutral-200 dark:border-neutral-800">
          {TABS.map((t) => {
            const Icon = t.icon
            return (
              <button key={t.key} onClick={() => setTab(t.key)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                        tab === t.key
                          ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                          : 'border-transparent text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
                      }`}>
                <Icon size={14} /> {t.label}
              </button>
            )
          })}
        </div>

        {tab === 'viewer' && <ViewerTab />}
        {tab === 'blog' && <BlogTab />}
        {tab === 'projects' && <ProjectsTab />}
        {tab === 'profile' && <ProfileTab />}
        {tab === 'files' && <FilesTab />}
      </div>
    </div>
  )
}

function ViewerTab() {
  const files = [
    { name: 'profile.json', data: profile },
    { name: 'projects.json', data: projects },
    { name: 'work.json', data: work },
    { name: 'blog.json', data: blog },
  ]
  return (
    <div className="space-y-4">
      {files.map((f) => (
        <details key={f.name} className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <summary className="px-4 py-3 cursor-pointer font-mono text-sm font-medium flex items-center justify-between">
            <span>{f.name}</span>
            <span className="text-xs text-neutral-500">click to expand</span>
          </summary>
          <pre className="text-xs p-4 overflow-x-auto bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 rounded-b-lg">
            {JSON.stringify(f.data, null, 2)}
          </pre>
        </details>
      ))}
    </div>
  )
}

function emptyProject() {
  return {
    id: '',
    name: '',
    tagline: '',
    stack: [],
    url: '',
    repo: '',
    type: 'open-source',
    image: '',
    featured: false,
    description: '',
  }
}

function ProjectsTab() {
  const [items, setItems] = useState(projects)
  const [mode, setMode] = useState('list')
  const [editingIndex, setEditingIndex] = useState(-1)
  const [draft, setDraft] = useState(emptyProject())
  const [stackStr, setStackStr] = useState('')

  function startNew() {
    setDraft(emptyProject())
    setStackStr('')
    setEditingIndex(-1)
    setMode('edit')
  }

  function startEdit(i) {
    const p = items[i]
    setDraft({ ...p, url: p.url || '', repo: p.repo || '', image: p.image || '' })
    setStackStr((p.stack || []).join(', '))
    setEditingIndex(i)
    setMode('edit')
  }

  function clone(i) {
    const p = items[i]
    const copy = { ...p, id: `${p.id}-copy`, name: `${p.name} (copy)`, featured: false }
    setItems([...items, copy])
  }

  function remove(i) {
    if (!confirm(`Delete "${items[i].name}"? This is in-memory only — you still need to download projects.json and commit.`)) return
    setItems(items.filter((_, idx) => idx !== i))
  }

  function moveUp(i) {
    if (i === 0) return
    const copy = [...items]
    ;[copy[i - 1], copy[i]] = [copy[i], copy[i - 1]]
    setItems(copy)
  }

  function moveDown(i) {
    if (i === items.length - 1) return
    const copy = [...items]
    ;[copy[i], copy[i + 1]] = [copy[i + 1], copy[i]]
    setItems(copy)
  }

  function saveDraft() {
    const id = draft.id || slugify(draft.name)
    if (!id) { alert('Name is required'); return }
    const stack = stackStr.split(',').map((s) => s.trim()).filter(Boolean)
    const payload = { ...draft, id, stack }

    if (editingIndex === -1) {
      if (items.some((p) => p.id === id)) {
        alert(`ID "${id}" already exists. Change the name or set a different ID.`)
        return
      }
      setItems([...items, payload])
    } else {
      const copy = [...items]
      copy[editingIndex] = payload
      setItems(copy)
    }
    setMode('list')
  }

  function downloadAll() {
    downloadJSON('projects.json', items)
  }

  function resetToFile() {
    if (!confirm('Discard all in-memory changes and reset to projects.json on disk?')) return
    setItems(projects)
  }

  if (mode === 'edit') {
    return (
      <div className="space-y-4">
        <button onClick={() => setMode('list')}
                className="inline-flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900">
          <ArrowLeft size={14} /> Back to list
        </button>

        <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 space-y-3">
          <h3 className="font-bold">{editingIndex === -1 ? 'New project' : `Edit: ${items[editingIndex]?.name}`}</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Name *" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />
            <Field label="ID (auto from name if empty)" value={draft.id} onChange={(v) => setDraft({ ...draft, id: v })} />
            <Field label="Tagline" value={draft.tagline} onChange={(v) => setDraft({ ...draft, tagline: v })} />
            <Select label="Type" value={draft.type} onChange={(v) => setDraft({ ...draft, type: v })} options={PROJECT_TYPES} />
            <Field label="URL (live link)" value={draft.url} onChange={(v) => setDraft({ ...draft, url: v })} />
            <Field label="Repo (or blank for private)" value={draft.repo} onChange={(v) => setDraft({ ...draft, repo: v })} />
            <Field label="Image (e.g. /assets/projects/x.png)" value={draft.image} onChange={(v) => setDraft({ ...draft, image: v })} />
            <Field label="Stack (comma-separated)" value={stackStr} onChange={setStackStr} />
            <Checkbox label="Featured (show on home)" checked={draft.featured} onChange={(v) => setDraft({ ...draft, featured: v })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea rows="4" value={draft.description}
                      onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={saveDraft}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-md text-sm font-medium">
              <Save size={14} /> Save to memory
            </button>
            <button onClick={() => setMode('list')}
                    className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md text-sm font-medium">
              Cancel
            </button>
          </div>
          <p className="text-xs text-neutral-500">
            Saves in-memory only. After editing all items, click <strong>Download projects.json</strong> on the list view and replace the file.
          </p>
        </div>
      </div>
    )
  }

  const dirty = JSON.stringify(items) !== JSON.stringify(projects)

  return (
    <div className="space-y-4">
      <EditWorkflowBanner filePath="src/data/projects.json" fileLabel="projects.json" />

      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
        <p className="text-sm">
          <strong>{items.length}</strong> project{items.length !== 1 ? 's' : ''}
          {dirty && <span className="ml-2 text-amber-600 dark:text-amber-400 font-medium">● unsaved</span>}
        </p>
        <div className="flex flex-wrap gap-2">
          <button onClick={startNew}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-md text-sm font-medium">
            <Plus size={14} /> New project
          </button>
          <button onClick={downloadAll}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-md text-sm font-bold">
            <Save size={14} /> Save (download projects.json)
          </button>
          <button onClick={resetToFile}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-neutral-500 hover:text-red-600">
            Reset
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {items.map((p, i) => (
          <div key={p.id + i} className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3 flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold truncate">{p.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">{p.type}</span>
                {p.featured && <span className="text-xs px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300">featured</span>}
              </div>
              <p className="text-xs text-neutral-500 mt-0.5 truncate">{p.tagline}</p>
            </div>
            <div className="flex items-center gap-1">
              <IconBtn onClick={() => moveUp(i)} disabled={i === 0} title="Move up">↑</IconBtn>
              <IconBtn onClick={() => moveDown(i)} disabled={i === items.length - 1} title="Move down">↓</IconBtn>
              <IconBtn onClick={() => clone(i)} title="Clone"><CopyIcon size={14} /></IconBtn>
              <IconBtn onClick={() => startEdit(i)} title="Edit"><Pencil size={14} /></IconBtn>
              <IconBtn onClick={() => remove(i)} title="Delete" danger><Trash2 size={14} /></IconBtn>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-center text-neutral-500 py-12">No projects. Click "New project" to add one.</p>
        )}
      </div>
    </div>
  )
}

function emptyPost() {
  return {
    id: '',
    title: '',
    slug: '',
    date: new Date().toISOString().slice(0, 10),
    excerpt: '',
    tags: [],
    body: '# New Post\n\nWrite your post here.',
  }
}

function BlogTab() {
  const [items, setItems] = useState(blog)
  const [mode, setMode] = useState('list')
  const [editingIndex, setEditingIndex] = useState(-1)
  const [draft, setDraft] = useState(emptyPost())
  const [tagsStr, setTagsStr] = useState('')
  const [pendingDeletes, setPendingDeletes] = useState([])
  const [loadingBody, setLoadingBody] = useState(false)

  function startNew() {
    setDraft(emptyPost())
    setTagsStr('')
    setEditingIndex(-1)
    setMode('edit')
  }

  async function startEdit(i) {
    const p = items[i]
    setLoadingBody(true)
    setEditingIndex(i)
    setMode('edit')
    const body = await loadPostBody(p.slug)
    setDraft({ ...p, body: body || '' })
    setTagsStr((p.tags || []).join(', '))
    setLoadingBody(false)
  }

  function remove(i) {
    const post = items[i]
    if (!confirm(`Delete "${post.title}"?\n\nThis removes it from blog.json in memory. You'll also need to manually delete src/data/posts/${post.slug}.md from the repo and commit.`)) return
    setItems(items.filter((_, idx) => idx !== i))
    setPendingDeletes([...pendingDeletes, post.slug])
  }

  function saveDraft() {
    const slug = draft.slug || slugify(draft.title)
    if (!draft.title || !slug) { alert('Title is required'); return }
    const tags = tagsStr.split(',').map((t) => t.trim()).filter(Boolean)
    const entry = {
      id: slug,
      title: draft.title,
      slug,
      date: draft.date,
      excerpt: draft.excerpt,
      tags,
    }

    if (editingIndex === -1) {
      if (items.some((p) => p.slug === slug)) {
        alert(`Slug "${slug}" already exists. Pick a different title or slug.`)
        return
      }
      setItems([...items, entry])
    } else {
      const copy = [...items]
      copy[editingIndex] = entry
      setItems(copy)
    }

    downloadText(`${slug}.md`, draft.body)
    setMode('list')
  }

  function downloadIndex() {
    downloadJSON('blog.json', items)
  }

  function downloadBody() {
    const slug = draft.slug || slugify(draft.title)
    if (!slug) { alert('Title or slug required'); return }
    downloadText(`${slug}.md`, draft.body)
  }

  function resetToFile() {
    if (!confirm('Discard all in-memory blog changes?')) return
    setItems(blog)
    setPendingDeletes([])
  }

  if (mode === 'edit') {
    return (
      <div className="space-y-4">
        <button onClick={() => setMode('list')}
                className="inline-flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900">
          <ArrowLeft size={14} /> Back to list
        </button>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-bold">{editingIndex === -1 ? 'New post' : `Edit: ${items[editingIndex]?.title}`}</h3>
            <Field label="Title *" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} />
            <Field label="Slug (auto from title if empty)" value={draft.slug} onChange={(v) => setDraft({ ...draft, slug: v })} />
            <Field label="Date" type="date" value={draft.date} onChange={(v) => setDraft({ ...draft, date: v })} />
            <Field label="Excerpt" value={draft.excerpt} onChange={(v) => setDraft({ ...draft, excerpt: v })} />
            <Field label="Tags (comma-separated)" value={tagsStr} onChange={setTagsStr} />
            <div>
              <label className="block text-sm font-medium mb-1">Body (Markdown)</label>
              {loadingBody ? (
                <div className="px-3 py-8 text-center text-neutral-500 text-sm border border-neutral-300 dark:border-neutral-700 rounded-md">Loading…</div>
              ) : (
                <textarea rows="14"
                          value={draft.body}
                          onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={saveDraft}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-md text-sm font-medium">
                <Save size={14} /> Save + download .md
              </button>
              <button onClick={downloadBody}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md text-sm font-medium">
                <Download size={14} /> Download .md only
              </button>
              <button onClick={() => setMode('list')}
                      className="px-4 py-2 text-sm text-neutral-500">
                Cancel
              </button>
            </div>
            <p className="text-xs text-neutral-500">
              Save updates blog.json in memory and downloads the .md file. After all edits, click <strong>Download blog.json</strong> on the list view and place files into the repo.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-sm">Source preview</h3>
            <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 max-h-150 overflow-y-auto">
              <pre className="text-xs whitespace-pre-wrap font-mono">{draft.body}</pre>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const posts = [...items].sort((a, b) => (a.date < b.date ? 1 : -1))

  const dirty = JSON.stringify(items) !== JSON.stringify(blog) || pendingDeletes.length > 0

  return (
    <div className="space-y-4">
      <EditWorkflowBanner filePath="src/data/blog.json" fileLabel="blog.json (+ .md files in src/data/posts/)" />

      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
        <p className="text-sm">
          <strong>{items.length}</strong> post{items.length !== 1 ? 's' : ''}
          {dirty && <span className="ml-2 text-amber-600 dark:text-amber-400 font-medium">● unsaved</span>}
        </p>
        <div className="flex flex-wrap gap-2">
          <button onClick={startNew}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-md text-sm font-medium">
            <Plus size={14} /> New post
          </button>
          <button onClick={downloadIndex}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-md text-sm font-bold">
            <Save size={14} /> Save (download blog.json)
          </button>
          <button onClick={resetToFile}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-neutral-500 hover:text-red-600">
            Reset
          </button>
        </div>
      </div>

      {pendingDeletes.length > 0 && (
        <div className="rounded-md border border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/20 p-3 text-sm text-amber-800 dark:text-amber-200">
          <strong>Pending file deletions:</strong> Also delete these from <code>src/data/posts/</code> and commit: {pendingDeletes.map((s) => `${s}.md`).join(', ')}
        </div>
      )}

      <div className="space-y-2">
        {posts.map((p) => {
          const i = items.indexOf(p)
          return (
            <div key={p.slug} className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3 flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold truncate">{p.title}</span>
                  <span className="text-xs text-neutral-500">{p.date}</span>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5 truncate">{p.excerpt}</p>
              </div>
              <div className="flex items-center gap-1">
                <IconBtn onClick={() => startEdit(i)} title="Edit"><Pencil size={14} /></IconBtn>
                <IconBtn onClick={() => remove(i)} title="Delete" danger><Trash2 size={14} /></IconBtn>
              </div>
            </div>
          )
        })}
        {posts.length === 0 && (
          <p className="text-center text-neutral-500 py-12">No posts. Click "New post" to add one.</p>
        )}
      </div>
    </div>
  )
}

function ProfileTab() {
  const [data, setData] = useState(profile)
  const dirty = JSON.stringify(data) !== JSON.stringify(profile)

  function update(field, value) {
    setData({ ...data, [field]: value })
  }

  function updateSocial(key, value) {
    setData({ ...data, socials: { ...data.socials, [key]: value } })
  }

  function save() {
    downloadJSON('profile.json', data)
  }

  function reset() {
    if (!confirm('Discard your unsaved profile changes?')) return
    setData(profile)
  }

  const SaveBar = () => (
    <div className="flex flex-wrap gap-2 items-center p-3 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
      <button onClick={save}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-md text-sm font-bold">
        <Save size={16} /> Save Profile (download profile.json)
      </button>
      {dirty && <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">● unsaved changes</span>}
      {dirty && (
        <button onClick={reset} className="text-xs text-neutral-500 hover:text-red-600 ml-auto">
          Discard changes
        </button>
      )}
    </div>
  )

  return (
    <div className="space-y-4 max-w-3xl">
      <EditWorkflowBanner filePath="src/data/profile.json" fileLabel="profile.json" />
      <SaveBar />

      <div className="grid sm:grid-cols-2 gap-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5">
        <Field label="Name" value={data.name} onChange={(v) => update('name', v)} />
        <Field label="Short name" value={data.shortName} onChange={(v) => update('shortName', v)} />
        <Field label="Role" value={data.role} onChange={(v) => update('role', v)} />
        <Field label="Location" value={data.location} onChange={(v) => update('location', v)} />
        <Field label="Email" value={data.email} onChange={(v) => update('email', v)} />
        <Field label="CV path" value={data.cv || ''} onChange={(v) => update('cv', v)} />
        <Field label="GitHub URL" value={data.socials?.github || ''} onChange={(v) => updateSocial('github', v)} />
        <Field label="LinkedIn URL" value={data.socials?.linkedin || ''} onChange={(v) => updateSocial('linkedin', v)} />
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Tagline</label>
          <textarea rows="2" value={data.tagline}
                    onChange={(e) => update('tagline', e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea rows="5" value={data.bio}
                    onChange={(e) => update('bio', e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
        </div>
      </div>

      <SaveBar />
    </div>
  )
}

function FilesTab() {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <CvUpdater />
      <ScreenshotUpdater />
    </div>
  )
}

function CvUpdater() {
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')

  function onPick(e) {
    const f = e.target.files?.[0]
    setError('')
    if (!f) { setFile(null); return }
    if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) {
      setError('Please select a PDF file.')
      setFile(null)
      return
    }
    setFile(f)
  }

  function save() {
    if (!file) return
    downloadBlob('cv.pdf', file)
  }

  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 space-y-3">
      <h3 className="font-bold flex items-center gap-2"><FileText size={16} /> Update CV</h3>
      <p className="text-xs text-neutral-500">
        Pick a PDF, click Save — it downloads as <code>cv.pdf</code>. Place it into <code>public/cv.pdf</code> and commit.
      </p>

      <div className="rounded-md border-2 border-dashed border-neutral-300 dark:border-neutral-700 p-4 text-center">
        <input id="cv-file" type="file" accept="application/pdf,.pdf" onChange={onPick} className="hidden" />
        <label htmlFor="cv-file"
               className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800">
          <Upload size={14} /> Choose PDF
        </label>
        {file && (
          <p className="mt-3 text-sm">
            <span className="font-medium">{file.name}</span>{' '}
            <span className="text-neutral-500">({fmtSize(file.size)})</span>
          </p>
        )}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      <div className="flex gap-2">
        <button onClick={save} disabled={!file}
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:bg-neutral-400 text-white rounded-md text-sm font-medium">
          <Save size={14} /> Save as cv.pdf
        </button>
        <a href="/cv.pdf" target="_blank" rel="noreferrer noopener"
           className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md text-sm font-medium">
          <ExternalLink size={14} /> View current
        </a>
      </div>
    </div>
  )
}

function imagePathFor(project) {
  if (project.image) return project.image
  return `/assets/projects/${project.id}.png`
}

function ScreenshotUpdater() {
  const [projectId, setProjectId] = useState(projects[0]?.id || '')
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')

  const project = projects.find((p) => p.id === projectId)
  const targetPath = project ? imagePathFor(project) : ''
  const targetName = targetPath.split('/').pop() || ''
  const ext = (file?.name.split('.').pop() || '').toLowerCase()
  const targetBase = targetName.replace(/\.[^.]+$/, '')
  const downloadName = file ? `${targetBase}.${ext}` : targetName

  function onPick(e) {
    const f = e.target.files?.[0]
    setError('')
    setPreviewUrl('')
    if (!f) { setFile(null); return }
    if (!f.type.startsWith('image/')) {
      setError('Please select an image file.')
      setFile(null)
      return
    }
    setFile(f)
    setPreviewUrl(URL.createObjectURL(f))
  }

  function save() {
    if (!file || !project) return
    downloadBlob(downloadName, file)
  }

  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 space-y-3">
      <h3 className="font-bold flex items-center gap-2"><ImageIcon size={16} /> Update Project Screenshot</h3>
      <p className="text-xs text-neutral-500">
        Select a project, pick an image. Downloads with the correct filename. Place into <code>public/assets/projects/</code> and commit.
      </p>

      <div>
        <label className="block text-sm font-medium mb-1">Project</label>
        <select value={projectId} onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
          {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {project && (
        <p className="text-xs text-neutral-500">
          Target: <code>public{targetPath}</code>
        </p>
      )}

      <div className="rounded-md border-2 border-dashed border-neutral-300 dark:border-neutral-700 p-4 text-center">
        <input id="shot-file" type="file" accept="image/*" onChange={onPick} className="hidden" />
        <label htmlFor="shot-file"
               className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800">
          <Upload size={14} /> Choose image
        </label>
        {file && (
          <div className="mt-3">
            <p className="text-sm">
              <span className="font-medium">{file.name}</span>{' '}
              <span className="text-neutral-500">({fmtSize(file.size)})</span>
            </p>
            {previewUrl && (
              <img src={previewUrl} alt="preview"
                   className="mt-3 max-h-40 mx-auto rounded border border-neutral-200 dark:border-neutral-800" />
            )}
          </div>
        )}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      <div className="flex gap-2">
        <button onClick={save} disabled={!file || !project}
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:bg-neutral-400 text-white rounded-md text-sm font-medium">
          <Save size={14} /> Save as {downloadName}
        </button>
        {project && project.image && (
          <a href={project.image} target="_blank" rel="noreferrer noopener"
             className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md text-sm font-medium">
            <ExternalLink size={14} /> View current
          </a>
        )}
      </div>

      <p className="text-xs text-neutral-500">
        Tip: keep screenshots under 200KB. Use WebP for best Lighthouse scores.
      </p>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input type={type} value={value} placeholder={placeholder}
             onChange={(e) => onChange(e.target.value)}
             className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
    </div>
  )
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium pt-6">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)}
             className="rounded border-neutral-300 dark:border-neutral-700 text-brand-600 focus:ring-brand-500" />
      {label}
    </label>
  )
}

function IconBtn({ children, onClick, disabled, title, danger }) {
  return (
    <button onClick={onClick} disabled={disabled} title={title}
            className={`p-1.5 rounded-md text-sm transition-colors ${
              disabled ? 'text-neutral-300 dark:text-neutral-600 cursor-not-allowed' :
              danger ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20' :
              'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}>
      {children}
    </button>
  )
}
