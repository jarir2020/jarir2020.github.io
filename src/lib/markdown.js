const postModules = import.meta.glob('../data/posts/*.md', { query: '?raw', import: 'default' })

export async function loadPostBody(slug) {
  const key = `../data/posts/${slug}.md`
  const loader = postModules[key]
  if (!loader) return null
  return await loader()
}

export function listPostSlugs() {
  return Object.keys(postModules).map((p) => p.replace('../data/posts/', '').replace('.md', ''))
}
