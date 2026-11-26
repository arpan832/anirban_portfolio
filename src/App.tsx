import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import heroImage from './assets/Hero.jpg'
import aboutImage from './assets/ABOUTME/me.jpg'
import concertCover from './assets/COVER_PICTURES/concert-cover/T.R.A.P.jpg'
import concertCoverVideo from './assets/COVER_PICTURES/concert-cover-video.mp4'
import modelCover from './assets/COVER_PICTURES/modelpictures-cover/IMG_5332 (1).jpg'
import photographCover from './assets/COVER_PICTURES/photograph-cover/IMG_0165.jpg'
import productCover from './assets/COVER_PICTURES/Product-cover/1779813968611.jpg'
import weddingCover from './assets/COVER_PICTURES/weeding-cover/weeding.jpg'
import previewOne from './assets/PREVIEWS/preview01.jpg'
import previewTwo from './assets/PREVIEWS/preview02.jpg'
import previewThree from './assets/PREVIEWS/preview03.jpg'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

const currentYear = new Date().getFullYear()

type MediaItem = {
  src: string
  alt: string
  kind?: 'image' | 'video'
  poster?: string
}

type PortfolioCategory = {
  id: string
  path: string
  title: string
  eyebrow: string
  cover: MediaItem
  items: MediaItem[]
}

type ArtistGallery = {
  id: string
  name: string
  items: MediaItem[]
}

const concertImageModules = import.meta.glob<string>(
  './assets/CONCERT MOMENT/CONCERT MOMENT/**/*.{jpg,JPG,jpeg,png,webp}',
  { eager: true, query: '?url', import: 'default' },
) 
const modelImageModules = import.meta.glob<string>(
  './assets/MODEL PHOTOSHOOT/MODEL PHOTOSHOOT/**/*.{jpg,JPG,jpeg,png,webp}',
  { eager: true, query: '?url', import: 'default' },
)
const photographImageModules = import.meta.glob<string>(
  './assets/PHOTOGRAPHS/PHOTOGRAPHS/**/*.{jpg,JPG,jpeg,png,webp}',
  { eager: true, query: '?url', import: 'default' },
)
const productImageModules = import.meta.glob<string>(
  './assets/PRODUCT SHOOT/PRODUCT SHOOT/**/*.{jpg,JPG,jpeg,png,webp}',
  { eager: true, query: '?url', import: 'default' },
)
const weddingImageModules = import.meta.glob<string>(
  './assets/WEDDING/WEDDING/**/*.{jpg,JPG,jpeg,png,webp}',
  { eager: true, query: '?url', import: 'default' },
)
const btsVideoModules = import.meta.glob<string>(
  './assets/BTS/**/*.{mp4,MP4,webm,mov}',
  { eager: true, query: '?url', import: 'default' },
)

const fileLabel = (path: string) => {
  const filename = path.split('/').pop()?.replace(/\.[^.]+$/, '') ?? 'photograph'
  return filename.replace(/[_-]+/g, ' ')
}

const modulesToMedia = (
  modules: Record<string, string>,
  subject: string,
): MediaItem[] =>
  Object.entries(modules)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([path, src]) => ({
      src,
      alt: `${subject} photograph - ${fileLabel(path)}`,
    }))

const concertArtists = (): ArtistGallery[] => {
  const groups = new Map<string, MediaItem[]>()

  Object.entries(concertImageModules)
    .sort(([left], [right]) => left.localeCompare(right))
    .forEach(([path, src]) => {
      const segments = path.split('/')
      const artist = segments[4] ?? 'Concert moments'
      const items = groups.get(artist) ?? []
      items.push({
        src,
        alt: `${artist} concert photograph - ${fileLabel(path)}`,
      })
      groups.set(artist, items)
    })

  return Array.from(groups, ([name, items]) => ({
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name,
    items,
  }))
}

const categories: PortfolioCategory[] = [
  {
    id: 'concerts',
    path: '/work/concerts',
    title: 'Concerts',
    eyebrow: 'Live energy',
    cover: {
      src: concertCoverVideo,
      alt: 'Concert performance photographed by Anirban',
      kind: 'video',
      poster: concertCover,
    },
    items: modulesToMedia(concertImageModules, 'Concert'),
  },
  {
    id: 'model-photoshoot',
    path: '/work/model-photoshoot',
    title: 'Model Photoshoot',
    eyebrow: 'Portrait and fashion',
    cover: { src: modelCover, alt: 'Model photoshoot portrait' },
    items: modulesToMedia(modelImageModules, 'Model photoshoot'),
  },
  {
    id: 'photographs',
    path: '/work/photographs',
    title: 'Photographs',
    eyebrow: 'Everyday poetry',
    cover: { src: photographCover, alt: 'Editorial photograph' },
    items: modulesToMedia(photographImageModules, 'Photography'),
  },
  {
    id: 'wedding',
    path: '/work/wedding',
    title: 'Wedding',
    eyebrow: 'Meaningful moments',
    cover: { src: weddingCover, alt: 'Wedding celebration photograph' },
    items: modulesToMedia(weddingImageModules, 'Wedding'),
  },
  {
    id: 'product-shoot',
    path: '/work/product-shoot',
    title: 'Product Shoot',
    eyebrow: 'Details in focus',
    cover: { src: productCover, alt: 'Product photographed in studio light' },
    items: modulesToMedia(productImageModules, 'Product shoot'),
  },
]

const btsVideos = Object.entries(btsVideoModules)
  .sort(([left], [right]) => left.localeCompare(right))
  .map(([path, src]) => ({
    src,
    alt: `Behind the scenes video - ${fileLabel(path)}`,
  }))

const previews: MediaItem[] = [
  { src: previewOne, alt: 'Selected work preview one' },
  { src: previewTwo, alt: 'Selected work preview two' },
  { src: previewThree, alt: 'Selected work preview three' },
]

const currentPath = () => {
  const path = window.location.pathname.replace(/\/+$/, '')
  return path || '/'
}

function InternalLink({
  href,
  onNavigate,
  children,
  className,
}: {
  href: string
  onNavigate: (path: string) => void
  children: ReactNode
  className?: string
}) {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }

    event.preventDefault()
    onNavigate(href)
  }

  return <a className={className} href={href} onClick={handleClick}>{children}</a>
}

function MediaImage({ item, className = '' }: { item: MediaItem; className?: string }) {
  return (
    <img
      src={item.src}
      alt={item.alt}
      className={className}
      loading="lazy"
      decoding="async"
    />
  )
}

function SmartVideo({
  src,
  poster,
  alt,
  className = '',
  preload = 'none',
}: {
  src: string
  poster?: string
  alt: string
  className?: string
  preload?: 'none' | 'metadata' | 'auto'
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      video.pause()
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => undefined)
        } else {
          video.pause()
        }
      },
      { rootMargin: '180px 0px', threshold: 0.12 },
    )

    observer.observe(video)
    return () => {
      observer.disconnect()
      video.pause()
    }
  }, [])

  return (
    <video
      ref={videoRef}
      className={className}
      muted
      loop
      playsInline
      preload={preload}
      poster={poster}
      aria-label={alt}
    >
      <source src={src} type="video/mp4" />
    </video>
  )
}

function CoverMedia({ item, className = '' }: { item: MediaItem; className?: string }) {
  if (item.kind === 'video') {
    return <SmartVideo src={item.src} poster={item.poster} alt={item.alt} className={className} preload="metadata" />
  }

  return <MediaImage item={item} className={className} />
}

function PortfolioCategorySection({
  category,
  onNavigate,
}: {
  category: PortfolioCategory
  onNavigate: (path: string) => void
}) {
  return (
    <section id={category.id} className="portfolio-section category-section">
      <div className="section-heading" data-reveal>
        <p className="eyebrow">{category.eyebrow}</p>
        <h2>{category.title}</h2>
        <span className="section-count">{String(category.items.length).padStart(2, '0')} frames</span>
      </div>

      <InternalLink href={category.path} onNavigate={onNavigate} className="category-cover-link">
        <div className="category-cover" data-reveal>
          <CoverMedia item={category.cover} className="cover-media" />
          <div className="cover-caption">
            <span>{category.title}</span>
            <span>Explore the story ↓</span>
          </div>
        </div>
      </InternalLink>

    </section>
  )
}

function CategoryPage({
  category,
  onNavigate,
}: {
  category: PortfolioCategory
  onNavigate: (path: string) => void
}) {
  const categoryIndex = categories.findIndex((item) => item.id === category.id)
  const nextCategory = categories[(categoryIndex + 1) % categories.length]

  return (
    <main className="category-page">
      <section className="category-page-hero">
        <InternalLink href="/" onNavigate={onNavigate} className="back-link">
          ← Back to the archive
        </InternalLink>
        <p className="eyebrow">{category.eyebrow}</p>
        <h1>{category.title}</h1>
        <p className="category-page-intro">
          A collection of frames shaped by light, movement, and the atmosphere of the moment.
        </p>
      </section>

      <section className="category-page-media">
        <div className="category-page-cover">
          <CoverMedia item={category.cover} className="cover-media" />
        </div>
        {category.id === 'concerts' ? (
          <div className="artist-list category-page-artists">
            {concertArtists().map((artist) => (
              <article key={artist.id} className="artist-group" id={artist.id}>
                <div className="artist-heading">
                  <h2>{artist.name}</h2>
                  <span>{String(artist.items.length).padStart(2, '0')} frames</span>
                </div>
                <div className="artist-grid">
                  {artist.items.map((item) => <MediaImage key={item.src} item={item} />)}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="gallery-grid category-page-grid">
            {category.items.map((item) => <MediaImage key={item.src} item={item} />)}
          </div>
        )}
      </section>

      <nav className="category-page-next" aria-label="Portfolio page navigation">
        <span>Next story</span>
        <InternalLink href={nextCategory.path} onNavigate={onNavigate}>
          {nextCategory.title} <span>↗</span>
        </InternalLink>
      </nav>
    </main>
  )
}

function NotFoundPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <main className="category-page not-found-page">
      <p className="eyebrow">404 / Not found</p>
      <h1>This frame is<br />not in the archive.</h1>
      <InternalLink href="/" onNavigate={onNavigate} className="back-link">
        ← Return home
      </InternalLink>
    </main>
  )
}

function App() {
  const pageRef = useRef<HTMLDivElement>(null)
  const [route, setRoute] = useState(currentPath)
  const activeCategory = categories.find((category) => category.path === route)

  const navigate = (path: string) => {
    if (path === currentPath()) return
    window.history.pushState({}, '', path)
    setRoute(path)
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }

  useEffect(() => {
    const handlePopState = () => setRoute(currentPath())
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    const page = pageRef.current
    if (!page) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.08,
    })
    const context = gsap.context(() => {
      gsap.fromTo(
        '[data-hero-image]',
        { scale: 0.82, clipPath: 'inset(9% 11% 9% 11%)' },
        {
          scale: 1,
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'none',
          scrollTrigger: {
            trigger: '[data-hero]',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        },
      )

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 36 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 84%',
              once: true,
            },
          },
        )
      })

      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((element) => {
        gsap.to(element, {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            scrub: true,
          },
        })
      })
    }, page)

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000)
    }
    const updateScrollTrigger = () => ScrollTrigger.update()

    lenis.on('scroll', updateScrollTrigger)
    gsap.ticker.add(updateLenis)
    gsap.ticker.lagSmoothing(0)

    return () => {
      context.revert()
      lenis.off('scroll', updateScrollTrigger)
      gsap.ticker.remove(updateLenis)
      lenis.destroy()
    }
  }, [route])

  return (
    <div ref={pageRef} className="site-shell">
      <header className="site-nav">
        <InternalLink href="/" onNavigate={navigate} className="wordmark">
          Anirban Creates
        </InternalLink>
        <nav aria-label="Primary navigation">
          {route === '/' ? <a href="#work">Work</a> : <InternalLink href="/" onNavigate={navigate}>Work</InternalLink>}
          {route === '/' ? <a href="#about">About</a> : <InternalLink href="/" onNavigate={navigate}>About</InternalLink>}
          {route === '/' ? <a href="#contact">Contact</a> : <InternalLink href="/" onNavigate={navigate}>Contact</InternalLink>}
        </nav>
      </header>

      {route === '/' ? <main id="top">
        <section className="hero-section" data-hero>
          <div className="hero-copy" data-reveal>
            <p className="eyebrow">Photography / Kolkata, India</p>
            <h1>Every moment<br />has a story.</h1>
            <p className="hero-intro">
              Thoughtful photographs of people, places, energy, and the quiet details in between.
            </p>
            <a className="text-link" href="#work">Enter the archive <span>↓</span></a>
          </div>
          <div className="hero-image-wrap">
            <img data-hero-image src={heroImage} alt="Anirban's featured photography" />
          </div>
          <div className="hero-meta">
            <span>01 / 07</span>
            <span>Scroll to explore</span>
          </div>
        </section>

        <section className="portfolio-section preview-section" id="work">
          <div className="section-heading" data-reveal>
            <p className="eyebrow">A selection</p>
            <h2>Images with<br />an atmosphere.</h2>
          </div>
          <div className="preview-grid">
            {previews.map((item, index) => (
              <figure key={item.src} className={`preview-card preview-card-${index + 1}`} data-reveal>
                <div className="preview-image-wrap" data-parallax>
                  <MediaImage item={item} className="preview-image" />
                </div>
                <figcaption>0{index + 1} / selected frame</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="portfolio-section about-section" id="about">
          <div className="about-image-wrap" data-reveal>
            <MediaImage item={{ src: aboutImage, alt: 'Portrait of Anirban' }} />
          </div>
          <div className="about-copy" data-reveal>
            <p className="eyebrow">About Anirban</p>
            <h2>Light, presence,<br />and perspective.</h2>
            <p>
              Hi, I'm Anirban, a freelance photographer passionate about capturing people,
              emotions and meaningful moments through my lens.
            </p>
            <p>
              I specialise in portrait, fashion, wedding, event, concert and product photography,
              creating images that capture the atmosphere, personality and details of every subject.
            </p>
            <p className="about-signoff">Every moment has a story. I'm here to capture it.</p>
          </div>
        </section>

        {categories.map((category) => (
          <PortfolioCategorySection key={category.id} category={category} onNavigate={navigate} />
        ))}

        <section className="portfolio-section bts-section">
          <div className="section-heading" data-reveal>
            <p className="eyebrow">Behind the scenes</p>
            <h2>Between<br />the frames.</h2>
          </div>
          <div className="bts-grid">
            {btsVideos.map((video) => (
              <SmartVideo key={video.src} src={video.src} alt={video.alt} className="bts-video" />
            ))}
          </div>
        </section>

        <section className="contact-section" id="contact" data-reveal>
          <p className="eyebrow">Let's make something meaningful</p>
          <h2>Have a story<br />to tell?</h2>
          <a className="contact-link" href="https://www.instagram.com/anirban.creats/" target="_blank" rel="noreferrer">
            Connect on Instagram <span>↗</span>
          </a>
        </section>
      </main> : activeCategory ? <CategoryPage category={activeCategory} onNavigate={navigate} /> : <NotFoundPage onNavigate={navigate} />}

      <footer className="site-footer">
        <span>© {currentYear} Anirban Creates</span>
        <span>Photography with intent.</span>
      </footer>
    </div>
  )
}

export default App
