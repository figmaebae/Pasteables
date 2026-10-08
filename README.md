# Vector Shelf

A Next.js (App Router) port of the "Vector Shelf" artifact: four full-height colour stripes (Mascot, Emote, Ghost, Cloud) that open galleries of 423 copy-ready SVG characters, with live Color / Style / Stroke / Eyes / Ink controls and copy-as SVG, React or Flutter.

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Deploy to Vercel

Push the folder to a Git repo and import it in Vercel (framework is auto-detected), or run `npx vercel`. No env vars or config needed; the home page is fully static.

## Layout

- `app/` layout (next/font for Montserrat, Bricolage Grotesque, DM Sans), page, global CSS
- `components/Shelf.tsx` hero stripes, hash deep links (`/#mascot`), Escape to close, toast
- `components/GalleryView.tsx` studio controls and tile grid
- `lib/transform.ts` recolour, outline, stroke, eye-scale and SVG/React/Flutter export helpers
- `data/*.json` the SVG data. Each gallery is a lazy chunk loaded on hover/click, so the home page stays small
- `scripts/extract.mjs` the one-off script that turned the original artifact HTML into `data/`
