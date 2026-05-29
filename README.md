# jarir2020.github.io

Personal portfolio site. Static SPA built with Vite + React + Alpine.js + TailwindCSS, deployed to GitHub Pages.

## Stack

- **Vite + React 18** — static SPA build
- **TailwindCSS v4** — styling
- **Alpine.js** — sprinkled DOM interactivity
- **react-router-dom (HashRouter)** — gh-pages compatible routing
- **react-markdown + remark-gfm** — blog body rendering
- **lucide-react** — icons
- **Data layer:** static JSON + markdown files in `src/data/`
- **Deploy:** GitHub Action → GitHub Pages

## Local dev

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Build

```bash
npm run build
npm run preview
```

The build script copies `dist/index.html` to `dist/404.html` so that deep links work after a refresh on GitHub Pages.

## Admin panel

Hidden at `/#/jarir-panel`. Not linked from anywhere public. Password-gated client-side.

The panel is a composer, not a writer — it produces JSON/markdown files for download which I then commit to the repo by hand. Zero backend.

## Project structure

```
src/
├── components/   shared UI (Nav, Footer, ProjectCard, ...)
├── data/         JSON + markdown content
│   └── posts/    blog post bodies
├── lib/          helpers (theme, seo, admin gate, downloader)
├── pages/        route components
├── App.jsx
├── main.jsx
└── index.css     Tailwind v4 + custom prose styles
```

## Editing content

| What | How |
|------|-----|
| Profile / bio / socials | edit `src/data/profile.json` |
| Projects | edit `src/data/projects.json` |
| Work history | edit `src/data/work.json` |
| Blog post | add row to `src/data/blog.json` + create `src/data/posts/<slug>.md` |

Alternatively use the Jarir Panel to draft + download the files.
