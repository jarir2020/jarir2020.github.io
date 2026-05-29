export function setSEO({ title, description }) {
  if (typeof document === 'undefined') return
  if (title) document.title = title
  if (description) {
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', description)
  }
}
