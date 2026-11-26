import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import './App.css'
import { findCategory } from './data/portfolio'
import {
  EASE_IN_OUT,
  gsap,
  prefersReducedMotion,
  ScrollTrigger,
} from './lib/gsap'
import { usePageReveals } from './lib/motion'
import { RouterProvider } from './lib/RouterProvider'
import { readPath } from './lib/router'
import {
  getSmoothScroll,
  scrollToSection,
  scrollToTop,
  setSmoothScroll,
} from './lib/scroll'
import { AboutSection } from './components/AboutSection'
import { BtsSection } from './components/BtsSection'
import { CategoryPage, NotFoundPage } from './components/CategoryPage'
import { ContactSection } from './components/ContactSection'
import { Hero } from './components/Hero'
import { IntroCurtain } from './components/IntroCurtain'
import { PreviewStrip, Ticker } from './components/PreviewStrip'
import { ScrollProgress } from './components/ScrollProgress'
import { SiteFooter } from './components/SiteFooter'
import { SiteNav } from './components/SiteNav'
import { WorkIndex } from './components/WorkIndex'

const INTRO_KEY = 'anirban-creates:intro'

const shouldShowIntro = () => {
  if (readPath() !== '/') return false
  if (prefersReducedMotion()) return false
  try {
    return window.sessionStorage.getItem(INTRO_KEY) !== 'seen'
  } catch {
    return false
  }
}

const pageTitle = (route: string) => {
  const category = findCategory(route)
  if (category) return `${category.title} — Anirban Creates`
  if (route !== '/') return 'Not found — Anirban Creates'
  return 'Anirban Creates — Photography'
}

const HomePage = ({ heroReady }: { heroReady: boolean }) => (
  <main id="main">
    <Hero ready={heroReady} />
    <PreviewStrip />
    <Ticker />
    <AboutSection />
    <WorkIndex />
    <BtsSection />
    <ContactSection />
  </main>
)

function App() {
  const shellRef = useRef<HTMLDivElement>(null)
  const veilRef = useRef<HTMLDivElement>(null)
  const pendingSection = useRef<string | null>(null)
  const transitioning = useRef(false)
  const [route, setRoute] = useState(readPath)
  const [introActive, setIntroActive] = useState(shouldShowIntro)
  const [heroReady, setHeroReady] = useState(() => !shouldShowIntro())

  usePageReveals(shellRef, route)

  /* Smooth scrolling — rebuilt for each page, cleaned up on the way out. */
  useEffect(() => {
    if (prefersReducedMotion()) return

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.09,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    })
    setSmoothScroll(lenis)

    const update = () => ScrollTrigger.update()
    const raf = (time: number) => lenis.raf(time * 1000)

    lenis.on('scroll', update)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    ScrollTrigger.refresh()

    return () => {
      gsap.ticker.remove(raf)
      lenis.off('scroll', update)
      lenis.destroy()
      setSmoothScroll(null)
    }
  }, [route])

  /* Lock the page while the opening titles are on screen. */
  useEffect(() => {
    const lenis = getSmoothScroll()
    if (introActive) {
      lenis?.stop()
      document.body.style.overflow = 'hidden'
    } else {
      lenis?.start()
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [introActive, route])

  /* New page: start at the top, refresh measurements, update the title. */
  useLayoutEffect(() => {
    window.history.scrollRestoration = 'manual'
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    scrollToTop()
    document.title = pageTitle(route)
    const timer = window.setTimeout(() => ScrollTrigger.refresh(), 60)
    return () => window.clearTimeout(timer)
  }, [route])

  /* A deep link like /#about should land on that section once painted. */
  useEffect(() => {
    if (introActive || route !== '/') return
    const id = window.location.hash.slice(1)
    if (!id) return
    const timer = window.setTimeout(() => {
      scrollToSection(id)
      ScrollTrigger.refresh()
    }, 420)
    return () => window.clearTimeout(timer)
  }, [introActive, route])

  useEffect(() => {
    const onPopState = () => setRoute(readPath())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  /* If a nav link asked for a section on the next page, honour it after paint. */
  useEffect(() => {
    const section = pendingSection.current
    if (!section) return
    pendingSection.current = null
    if (route !== '/') return

    const timer = window.setTimeout(() => {
      scrollToSection(section)
      ScrollTrigger.refresh()
    }, 420)
    return () => window.clearTimeout(timer)
  }, [route])

  const navigate = useCallback((path: string, options?: { section?: string }) => {
    const current = readPath()
    if (path === current) {
      if (options?.section) scrollToSection(options.section)
      return
    }

    pendingSection.current = options?.section ?? null
    const commit = () => {
      window.history.pushState({}, '', path)
      setRoute(path)
    }

    const veil = veilRef.current
    if (!veil || prefersReducedMotion()) {
      commit()
      return
    }

    if (transitioning.current) return
    transitioning.current = true

    gsap
      .timeline({
        onComplete: () => {
          transitioning.current = false
        },
      })
      .set(veil, { pointerEvents: 'auto' })
      .to(veil, { autoAlpha: 1, duration: 0.32, ease: EASE_IN_OUT })
      .call(commit)
      .to(veil, { autoAlpha: 0, duration: 0.62, ease: 'power2.out' }, 0.1)
      .set(veil, { pointerEvents: 'none' })
  }, [])

  const handleIntroReveal = useCallback(() => {
    setHeroReady(true)
    ScrollTrigger.refresh()
  }, [])

  const handleIntroDone = useCallback(() => {
    try {
      window.sessionStorage.setItem(INTRO_KEY, 'seen')
    } catch {
      /* private mode — the intro simply plays again next time */
    }
    setIntroActive(false)
    setHeroReady(true)
    ScrollTrigger.refresh()
  }, [])

  const activeCategory = findCategory(route)
  const isHome = route === '/'
  const isKnown = isHome || Boolean(activeCategory)

  return (
    <RouterProvider value={{ route, navigate }}>
      <div className="grain" aria-hidden="true" />
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <ScrollProgress />
      <SiteNav />

      <div className="site-shell" ref={shellRef}>
        {introActive ? (
          <IntroCurtain onReveal={handleIntroReveal} onDone={handleIntroDone} />
        ) : null}

        {isHome ? (
          <HomePage heroReady={heroReady} />
        ) : activeCategory ? (
          <CategoryPage category={activeCategory} />
        ) : isKnown ? null : (
          <NotFoundPage />
        )}

        <SiteFooter />
      </div>

      <div className="route-veil" ref={veilRef} aria-hidden="true">
        <span>Anirban Creates</span>
      </div>
    </RouterProvider>
  )
}

export default App
