# CreativeWorld

CreativeWorld is a small personal homepage experiment.

The current page is a liquid-glass landing built with React + TypeScript + Vite +
Tailwind CSS + framer-motion. The previous generative-field page is preserved at
[`legacy/`](legacy/index.html).

## Structure

- `index.html`, `assets/` — built output served by GitHub Pages (do not edit by hand)
- `app/` — source (Vite project)
- `legacy/` — previous static homepage

## Develop & publish

```sh
cd app
npm install
npm run dev      # local dev server
npm run build    # type-check + production build into app/dist
npm run export   # copy app/dist output to the repo root
```

Commit the regenerated `index.html` and `assets/` after running `export`.
