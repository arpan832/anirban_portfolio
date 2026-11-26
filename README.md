# Anirban Creates — photography portfolio

A cinematic, editorial portfolio for Anirban Creates. Warm cream paper, charcoal
ink, one burnt-sienna accent, Fraunces for display type and Inter Tight for the
quiet interface text. Photographs lead; motion supports them.

## The experience

- **Opening titles** — a short wordmark curtain on first visit, skipped on repeat
  visits and for visitors who prefer reduced motion.
- **Hero** — a framed photograph beside the headline. Scrolling pins the opening
  shot and expands the frame to full bleed while the type steps away.
- **Selected work** — three preview frames with gentle parallax, each linking to
  the matching body of work.
- **About** — the biography as an editorial block with a drop cap, portrait and
  a quiet pulled quote.
- **Bodies of work** — five full-bleed covers (concerts, model photoshoot,
  photographs, wedding, product shoot), each opening its own page. Galleries are
  untitled masonry columns with one gutter everywhere, so no frame is cropped and
  the rhythm stays clean.
- **Between the frames** — behind-the-scenes films that load and play only when
  visible, with a play/pause control and silence by design.
- **Contact** — a single, obvious invitation, plus the Instagram handle. There is
  no email link until a working address exists in the content source.
- **Category pages** — cover, introduction, frame count, cinematic gallery,
  keyboard-accessible full-screen viewer, and previous/next stories.
- **Concert page** — photographs grouped by artist with sticky artist headings.

## Stack

React 19 · TypeScript · Vite · GSAP + ScrollTrigger · Lenis · self-hosted
Fraunces and Inter Tight fonts. Plain CSS with design tokens; no Tailwind.

## Project structure

```
src/
  App.tsx                 routing shell, smooth scroll, intro, page transitions
  index.css               design tokens, reset, typography, shared utilities
  App.css                 page and component composition
  data/portfolio.ts       galleries, categories, copy — the content source
  data/media-dimensions.ts  generated intrinsic sizes (width/height attributes)
  lib/                    gsap setup, scroll helpers, reveal system, router
  components/             nav, hero, sections, gallery, lightbox, footer
scripts/optimize-media.mjs  generates web derivatives of the photographs
src/assets/               original media (never modified)
  _optimized/             generated long-edge 1800px WebP
  _optimized-small/       generated long-edge 860px WebP
  _optimized-video/       web-weight H.264 films and their WebP posters
public/                   favicon, film grain, SPA redirect rule
```

## Editing content

All copy and structure live in `src/data/portfolio.ts` (and the biography source
`src/assets/ABOUTME/aboutme.md`). The five categories are typed objects:

```ts
{
  id: 'wedding',
  path: '/work/wedding',
  title: 'Wedding',
  eyebrow: 'Meaningful moments',
  intro: '…',
  cover: media('../assets/COVER_PICTURES/weeding-cover/weeding.jpg', '…'),
  items: weddingImages,
}
```

Galleries are discovered from the asset folders with `import.meta.glob`, sorted
deterministically. Concert artists are grouped by their folder name and get
proper display names from the `artistNames` map.

### Adding photographs

1. Drop the new files into the relevant folder under `src/assets/` (keep the
   existing folder spelling, including `CONCERT MOMENT` and `weeding-cover`).
2. Run `npm run media` to generate optimised derivatives and refresh
   `src/data/media-dimensions.ts`. This needs [ImageMagick](https://imagemagick.org/)
   (`convert` and `identify`) on your machine.
3. That's it — the image appears in its gallery, sorted by path. The recorded
   dimensions reserve space before lazy images load, so the masonry never jumps.

New galleries appear on the site only through `categories` in
`src/data/portfolio.ts`, so a new body of work stays a deliberate editorial
decision.

### Adding films

Camera-original films are far too heavy to ship (the concert recap alone was
62 MB). The site imports web copies from `src/assets/_optimized-video/`, and the
originals stay in `src/assets/` untouched. Recreate a copy with ffmpeg:

```bash
# landscape cover loop — 720p, no audio, fast-start for progressive playback
ffmpeg -i "src/assets/COVER_PICTURES/concert-cover-video.mp4" -an \
  -vf scale=1280:720 -c:v libx264 -preset medium -crf 30 \
  -profile:v high -pix_fmt yuv420p -movflags +faststart \
  src/assets/_optimized-video/concert-cover.mp4

# the same film, cropped to the 3:4 behind-the-scenes tile
ffmpeg -i src/assets/_optimized-video/concert-cover.mp4 -an \
  -vf crop=540:720:620:0 -c:v libx264 -preset medium -crf 31 \
  -profile:v high -pix_fmt yuv420p -movflags +faststart \
  src/assets/_optimized-video/bts-after-movie.mp4

# a poster frame, cropped to the tile's portrait ratio
ffmpeg -ss 28 -i src/assets/_optimized-video/concert-cover.mp4 -frames:v 1 \
  -vf crop=540:720:620:0 -c:v libwebp -quality 82 \
  src/assets/_optimized-video/bts-after-movie.webp
```

Then point `btsSection.videos` (or a cover's `videoSrc` / `poster`) at the new
files. Every film ships with a poster so reduced-motion and small-screen
visitors see a photograph instead of a blank frame.

## Scripts

```bash
npm run dev      # local development
npm run build    # type-check + production build
npm run preview  # preview the build
npm run lint     # oxlint
npm run media    # regenerate optimised images (ImageMagick)
```

## Routing and deployment

The site uses the History API with direct-load support for `/`, `/work/concerts`,
`/work/model-photoshoot`, `/work/photographs`, `/work/wedding` and
`/work/product-shoot`. Unknown paths render a graceful not-found page.

Hosts must rewrite unknown paths to `index.html` so a deep link can boot the app.
`public/_redirects` covers Netlify and Cloudflare Pages; add an equivalent
rewrite rule on other static hosts.

## Motion and accessibility

- Every animation is scoped with `gsap.context` and reverted on unmount or route
  change. Lenis is destroyed and recreated per page.
- `prefers-reduced-motion: reduce` disables the intro, parallax, pinning, masked
  reveals and decorative video playback (a still frame is shown instead).
- Only visible or nearly-visible videos load and play; off-screen videos pause.
- Videos are muted, `playsInline` and never autoplay sound.
- The full-screen viewer uses the native dialog element for focus trapping and
  `Escape`; arrow keys step through frames and focus returns to the photograph
  that opened it. Images are contained inside the stage, so the whole frame is
  always visible — no crop on open or while stepping.
- Semantic headings, landmarks, a skip link, visible focus states and descriptive
  alt text are in place; muted text colours meet WCAG AA contrast.
- Section links account for the fixed navigation bar with `scroll-margin-top`
  and a matching Lenis offset.

## Performance

The production build is about 30 MB in total (down from 84 MB before the films
were transcoded): roughly 15 MB of video, 15 MB of WebP across both responsive
sizes, and one CSS and one JS bundle (about 39 kB / 8.4 kB gzipped and 421 kB /
135 kB gzipped). Videos stream with `preload="metadata"`, posters paint first,
and only the players near the viewport ever receive a `src`. Phones and
reduced-motion visitors get a responsive still instead of the cover film.
