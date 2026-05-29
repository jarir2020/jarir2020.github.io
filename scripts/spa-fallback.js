import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const dist = resolve(process.cwd(), 'dist')
const src = resolve(dist, 'index.html')
const dst = resolve(dist, '404.html')

if (!existsSync(src)) {
  console.error('dist/index.html missing — did vite build run?')
  process.exit(1)
}

const html = readFileSync(src, 'utf8')

// Inject a small redirect script so /jarir-panel etc. work on GitHub Pages refresh.
// 404.html captures the path, redirects to "/" with ?spa-redirect=<path>, and main.jsx
// rewrites history back to the original path so React Router renders the right route.
const redirectScript = `
<script>
  (function () {
    var path = window.location.pathname + window.location.search + window.location.hash;
    var base = '/';
    if (path !== base) {
      window.location.replace(base + '?spa-redirect=' + encodeURIComponent(path));
    }
  })();
</script>
`

const fourOhFour = html.replace('</head>', redirectScript + '</head>')
writeFileSync(dst, fourOhFour, 'utf8')
console.log('Wrote dist/404.html (SPA deep-link fallback for GitHub Pages)')
