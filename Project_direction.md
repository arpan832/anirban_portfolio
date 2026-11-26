# Anirban Creates - Portfolio Build Direction

## 1. Project objective

Build a cinematic, editorial photography portfolio for Anirban Creates. The site should feel like a carefully directed visual story rather than a generic gallery: quiet, warm, immersive, image-led, and easy to navigate.

The visual language is a creamy neutral palette with deep charcoal text, restrained accents, refined typography, generous whitespace, and deliberate motion. Every animation should support the photographs and the story. Avoid decorative effects that compete with the work.

The site must be responsive, accessible, performant, and maintainable. It should work well on touch devices as well as desktop screens, respect `prefers-reduced-motion`, provide useful alt text, and remain usable when media is slow to load.

## 2. Brand and content source

Use the following file as the source of truth for the About section and contact details:

- `src/assets/ABOUTME/aboutme.md`

Content currently available there:

- Name: Anirban
- Profession: freelance photographer
- Specialisations: portrait, fashion, wedding, event, concert, and product photography
- Instagram: `https://www.instagram.com/anirban.creats/` named- @anirban.Creates
- Email: creatsbyanirban@gmail.com
- Contact No - Contact no - 9153910966

The site theme is photography. Preserve the meaning and voice of the supplied biography; only make small editorial adjustments if needed for layout or readability.

## 3. Experience and page flow

Implement the main experience as a cinematic home page plus dedicated internal category pages. The home page is the entry story; every portfolio category cover is a clickable navigation target that opens its own page. Use reusable components and stable route slugs so the structure can grow without duplicating layouts.

Use client-side routing with browser history support. The required routes are `/`, `/work/concerts`, `/work/model-photoshoot`, `/work/photographs`, `/work/wedding`, and `/work/product-shoot`. A category page must support direct loading, browser back/forward, a visible back-to-portfolio action, and a graceful not-found fallback. Do not use hash-only navigation for category pages.

Recommended flow:

1. **Opening / hero**
   - Use `src/assets/Hero.jpg`.
   - Start with a restrained, smaller framed image and a strong typographic introduction.
   - As the user scrolls, progressively scale and reveal the image until it becomes the dominant hero composition.
   - Include a clear navigation cue and a short introduction to Anirban Creates.
   - Keep the first viewport visually calm and fast to load.

2. **Selected work preview**
   - Show three preview cards using `src/assets/PREVIEWS/preview01.jpg`, `src/assets/PREVIEWS/preview02.jpg`, and `src/assets/PREVIEWS/preview03.jpg`.
   - Use subtle parallax or depth movement, not aggressive 3D effects.
   - Each card should link or scroll to the matching body-of-work section where appropriate.

3. **About Anirban**
   - Use `src/assets/ABOUTME/me.jpg` for the portrait.
   - Read the copy from `src/assets/ABOUTME/aboutme.md`.
   - Present the biography as a designed editorial block with a clear transition into the work.

4. **Photography categories**
   - Build reusable category sections or cards for: `CONCERTS`, `MODEL PHOTOSHOOT`, `PHOTOGRAPHS`, `WEDDING`, and `PRODUCT SHOOT`.
   - Use the category cover assets listed in Section 4.
   - Each category cover must be a keyboard-accessible link to its dedicated route: `/work/concerts`, `/work/model-photoshoot`, `/work/photographs`, `/work/wedding`, or `/work/product-shoot`.
   - The home page must show the category covers only. Do not render the category sub-images or artist galleries on the home page.
   - Each category page should show the cover treatment, category introduction, complete gallery, frame count, and a clear link to the next/previous category or home page.
   - Use cinematic grids with varied image sizes while preserving a clear reading order and good mobile behavior.

5. **Concert artist gallery**
   - Put the concert artist gallery only on the `/work/concerts` page using the artist folders under `src/assets/CONCERT MOMENT/CONCERT MOMENT/`.
   - Group images by the artist folder name and display a clear artist name heading directly above that artist's pictures.
   - Use a reusable artist gallery component rather than hardcoding a separate component for each artist.

6. **Behind the scenes**
   - Keep the existing `Behind the scenes` / `Between the frames` section on the home page. Do not move it to another route or redesign its composition.
   - Use the videos in `src/assets/BTS/` as silent, muted, looping previews.
   - Videos must be `playsInline`, muted, `preload="metadata"` or `preload="none"`, and safely paused when not visible.
   - Use `IntersectionObserver` or an equivalent visibility hook so only videos near the viewport play. Never start all BTS videos at once.
   - Keep the concert cover video muted and viewport-aware, with `src/assets/COVER_PICTURES/concert-cover/T.R.A.P.jpg` as its poster fallback.
   - Respect `prefers-reduced-motion`: pause decorative video autoplay and show poster imagery instead.
   - Do not autoplay sound. If a future music layer is added, it must be opt-in through an obvious navigation control and must not begin without the visitor's action.

7. **Contact / closing section**
   - Make the final action immediately understandable: invite visitors to discuss a shoot or collaboration.
   - Link to the Instagram URL from `aboutme.md`.
   - Do not render a broken email link while the email field is blank. Use a placeholder state or omit it until the real address is added.
   - End with a quiet visual conclusion and a simple footer.

## 4. Exact asset map

All paths below are relative to the project root `anirban_portfolio/`. Preserve the capitalization and spaces exactly; do not rename existing asset folders or files casually because import paths can be case-sensitive.

### Application files

- `index.html` — Vite document shell.
- `src/main.tsx` — React entry point.
- `src/App.tsx` — main application composition and page sections.
- `src/App.css` — application/component styling.
- `src/index.css` — global styles, design tokens, reset, typography, and responsive defaults.
- `vite.config.ts` — Vite configuration.
- `tsconfig.json` — shared TypeScript configuration.
- `tsconfig.app.json` — application TypeScript configuration.
- `tsconfig.node.json` — tooling TypeScript configuration.
- `package.json` — scripts and dependencies. If GSAP, Lenis, Tailwind, or a router is introduced, update this file and the lockfile consistently.
- `package-lock.json` — npm dependency lockfile.

### Public files

- `public/favicon.svg` — browser favicon.
- `public/icons.svg` — shared SVG symbol sheet, if needed by the finished design.

### Hero, previews, and profile

- `src/assets/Hero.jpg` — primary hero image. Note the capital `H` and `.jpg` extension.
- `src/assets/PREVIEWS/preview01.jpg`
- `src/assets/PREVIEWS/preview02.jpg`
- `src/assets/PREVIEWS/preview03.jpg`
- `src/assets/ABOUTME/me.jpg` — About section portrait.
- `src/assets/ABOUTME/aboutme.md` — biography, theme, Instagram, and contact source.

### Category cover assets

- `src/assets/COVER_PICTURES/concert-cover/T.R.A.P.jpg` — concert cover image.
- `src/assets/COVER_PICTURES/concert-cover-video.mp4` — concert cover video; use when supported as a muted preview.
- `src/assets/COVER_PICTURES/modelpictures-cover/IMG_5332 (1).jpg` — model photoshoot cover.
- `src/assets/COVER_PICTURES/photograph-cover/IMG_0165.jpg` — photographs cover.
- `src/assets/COVER_PICTURES/Product-cover/1779813968611.jpg` — product shoot cover.
- `src/assets/COVER_PICTURES/weeding-cover/weeding.jpg` — wedding cover. The existing folder is spelled `weeding-cover`; keep that exact path unless deliberately migrating it.

### Full category galleries

- `src/assets/CONCERT MOMENT/CONCERT MOMENT/` — concert images grouped into artist folders. Current artist folders are `ANIRBAN BHATTACHARYA`, `ARUNITA KANJILAL`, `NANDY SISTERS`, `SNIGDHAJIT BHOWMIK`, and `T.R.A.P`.
- `src/assets/MODEL PHOTOSHOOT/MODEL PHOTOSHOOT/` — model photoshoot images.
- `src/assets/PHOTOGRAPHS/PHOTOGRAPHS/` — general photography images, including its `Hero.jpg`.
- `src/assets/PRODUCT SHOOT/PRODUCT SHOOT/` — product shoot images.
- `src/assets/WEDDING/WEDDING/` — wedding images.

### Behind-the-scenes media

- `src/assets/BTS/AFTER MOVIE/lv_0_20251230132800.mp4`
- `src/assets/BTS/VID-20251030-WA0053.mp4`
- `src/assets/BTS/workingbts.mp4`

For media-heavy sections, lazy-load below-the-fold images and videos, use intrinsic dimensions or aspect-ratio boxes to prevent layout shift, and provide graceful fallbacks.

To include every file in a gallery without maintaining a fragile hand-written list, use Vite's `import.meta.glob` from a module inside `src/`. Use URL imports and filter by extension, for example:

```ts
const weddingImages = import.meta.glob(
  './assets/WEDDING/WEDDING/**/*.{jpg,JPG,jpeg,png,webp}',
  { eager: true, query: '?url', import: 'default' },
)
```

Apply the same pattern to these complete gallery scopes:

- `./assets/CONCERT MOMENT/CONCERT MOMENT/**/*.{jpg,JPG,jpeg,png,webp}`
- `./assets/MODEL PHOTOSHOOT/MODEL PHOTOSHOOT/**/*.{jpg,JPG,jpeg,png,webp}`
- `./assets/PHOTOGRAPHS/PHOTOGRAPHS/**/*.{jpg,JPG,jpeg,png,webp}`
- `./assets/PRODUCT SHOOT/PRODUCT SHOOT/**/*.{jpg,JPG,jpeg,png,webp}`
- `./assets/WEDDING/WEDDING/**/*.{jpg,JPG,jpeg,png,webp}`
- `./assets/BTS/**/*.{mp4,MP4,webm,mov}`

For the concert scope, derive the artist group from the first folder below `CONCERT MOMENT/CONCERT MOMENT/`. Sort items deterministically so the visual order does not change between builds.

## 5. Data and component architecture

Keep media metadata in typed data objects rather than scattering file imports and labels throughout JSX. The data model should make it simple to add a new image, artist, category, or video.

Suggested shapes:

```ts
type MediaItem = {
  src: string
  alt: string
  kind?: 'image' | 'video'
  poster?: string
}

type PortfolioCategory = {
  id: string
  title: string
  cover: MediaItem
  items: MediaItem[]
}

type ArtistGallery = {
  id: string
  name: string
  items: MediaItem[]
}
```

Suggested reusable components:

- `SiteNavigation`
- `RouteView` or a small route resolver
- `HeroSection`
- `ScrollReveal` or a small motion wrapper
- `PreviewStrip`
- `AboutSection`
- `CategorySection`
- `MediaCard`
- `GalleryGrid`
- `ArtistGallery`
- `BtsSection`
- `ContactSection`
- `SiteFooter`

These can initially live in `src/App.tsx` if the project is still small, but move them into `src/components/` when the file becomes difficult to navigate. Keep asset/data definitions separate from presentation when practical, for example under `src/data/portfolio.ts`.

## 6. Motion and technical direction

- Use React and TypeScript as the foundation.
- Use GSAP with `ScrollTrigger` for the hero scale/reveal, section entrances, and carefully controlled parallax.
- Use Lenis for smooth scrolling only on the active page; destroy and recreate it cleanly when the route changes. Native scrolling must remain functional and accessible.
- Tailwind is optional. The current project does not have Tailwind installed, so either add and configure it deliberately or continue with the existing CSS architecture. Do not mix styling systems without a clear reason.
- Keep animation timelines scoped and clean them up on unmount.
- Avoid scroll-jacking, excessive pinned sections, flashing transitions, and motion that makes content hard to read.
- Use `prefers-reduced-motion: reduce` to disable or simplify parallax, scaling, and decorative transitions.
- Respect mobile constraints: reduce animation distance, avoid hover-only interactions, and ensure every gallery works with tap and keyboard input.
- Use semantic headings, landmarks, buttons, links, visible focus states, descriptive alt text, and keyboard-accessible dialogs/lightboxes if one is added.

## 7. Visual direction

- Palette: warm cream, soft sand, muted taupe, charcoal, and a restrained earthy accent.
- Typography: pair an expressive editorial display face with a clean, highly readable sans-serif. Load fonts intentionally and include fallbacks.
- Composition: use asymmetry, large image crops, thin rules, restrained labels, and generous whitespace.
- Image treatment: preserve photographic character; use overlays only when required for contrast.
- Navigation: minimal, persistent or easy to rediscover, with clear section labels and a visible contact action.
- Tone: intimate, confident, cinematic, and professional - not flashy or template-like.

## 8. Definition of done

The implementation is complete when:

- The starter Vite screen is fully replaced by the portfolio experience.
- Every asset import points to a real path in the asset map above.
- The hero, previews, About, five cover-only category links, dedicated category pages, concert artist galleries, BTS, contact, and footer are present.
- The home page contains no wedding, model, photograph, product, or concert sub-gallery images.
- The BTS section remains on the home page with its existing visual treatment.
- Clicking every category cover opens the correct dedicated page without a full browser reload.
- Direct route loading and browser back/forward work for every category page.
- Adding an image to a typed data collection is enough to make it appear in the correct gallery.
- The blank email field is handled honestly and does not produce a broken link.
- The layout works at mobile, tablet, and desktop widths.
- Images and videos are lazy-loaded or otherwise optimized where appropriate.
- Only visible or near-visible videos play; off-screen videos are paused and do not compete for bandwidth or CPU.
- Reduced-motion, keyboard, focus, and video-audio behavior are handled safely.
- `npm run build` succeeds, and `npm run lint` is run and any relevant issues are addressed.

## 9. Implementation guardrails

- Treat this file and `src/assets/ABOUTME/aboutme.md` as the primary product brief and content source.
- Verify paths against the actual filesystem before adding imports. In particular, note `Hero.jpg`, uppercase folder names, spaces in filenames, and the existing `weeding-cover` spelling.
- Replace the starter imports in the template (`hero.png`, `react.svg`, and `vite.svg`) because those files are not part of the current project asset tree.
- Do not fabricate personal details, client names, email addresses, credits, or social accounts.
- Do not delete or rename original media as part of routine UI work.
- Keep the architecture extensible, but do not add unnecessary abstractions before they solve a real problem.
- Preserve the cinematic story: the photographs and Anirban's work should remain the focus of every design decision.
