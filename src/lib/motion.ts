import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'
import { EASE, gsap, prefersReducedMotion, ScrollTrigger } from './gsap'

/**
 * Sets up the shared scroll narrative for a page: masked line reveals, soft
 * fades, parallax, cover zooms and batched gallery entrances. Everything is
 * scoped to the page root and reverted on route change.
 */
export const usePageReveals = (rootRef: RefObject<HTMLElement | null>, key: string) => {
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    if (prefersReducedMotion()) {
      ScrollTrigger.refresh()
      return
    }

    const context = gsap.context(() => {
      /* Masked headline lines ------------------------------------------------ */
      gsap.utils.toArray<HTMLElement>('[data-lines]', root).forEach((heading) => {
        const lines = heading.querySelectorAll<HTMLElement>('.line-inner')
        if (!lines.length) return
        gsap.from(lines, {
          yPercent: 118,
          duration: 1.15,
          stagger: 0.09,
          ease: EASE,
          delay: Number(heading.dataset.linesDelay ?? 0),
          scrollTrigger: { trigger: heading, start: 'top 92%', once: true },
        })
      })

      /* Masked display words (category titles) ------------------------------ */
      gsap.utils.toArray<HTMLElement>('[data-words]', root).forEach((heading) => {
        const words = heading.querySelectorAll<HTMLElement>('.word .line-inner')
        if (!words.length) return
        gsap.from(words, {
          yPercent: 118,
          duration: 1.05,
          stagger: 0.055,
          ease: EASE,
          scrollTrigger: { trigger: heading, start: 'top 92%', once: true },
        })
      })

      /* Soft element reveals ------------------------------------------------- */
      gsap.utils.toArray<HTMLElement>('[data-reveal]', root).forEach((element) => {
        gsap.from(element, {
          autoAlpha: 0,
          y: 30,
          duration: 1.05,
          ease: EASE,
          delay: Number(element.dataset.revealDelay ?? 0),
          scrollTrigger: {
            trigger: element,
            start: `top ${element.dataset.revealStart ?? '88%'}`,
            once: true,
          },
        })
      })

      /* Framed image reveals ------------------------------------------------ */
      gsap.utils.toArray<HTMLElement>('[data-reveal-image]', root).forEach((element) => {
        gsap.fromTo(
          element,
          { clipPath: 'inset(10% 5% 10% 5%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.5,
            ease: EASE,
            scrollTrigger: { trigger: element, start: 'top 90%', once: true },
          },
        )
      })

      /* Quiet parallax ------------------------------------------------------ */
      gsap.utils.toArray<HTMLElement>('[data-parallax]', root).forEach((element) => {
        const strength = Number(element.dataset.parallax || 6)
        gsap.fromTo(
          element,
          { yPercent: -strength },
          {
            yPercent: strength,
            ease: 'none',
            scrollTrigger: {
              trigger: element.closest('figure, .preview-card, .about-portrait') ?? element,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      })

      /* Cover zooms --------------------------------------------------------- */
      gsap.utils.toArray<HTMLElement>('[data-cover-zoom]', root).forEach((element) => {
        gsap.fromTo(
          element,
          { scale: 1.12 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: element.parentElement ?? element,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      })

      /* Gallery entrances --------------------------------------------------- */
      const frames = gsap.utils.toArray<HTMLElement>('[data-frame]', root)
      if (frames.length) {
        gsap.set(frames, { autoAlpha: 0, y: 26 })
        ScrollTrigger.batch(frames, {
          start: 'top 94%',
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: 1,
              stagger: 0.07,
              ease: EASE,
              overwrite: true,
            }),
        })
      }

      /* Small moving details ------------------------------------------------ */
      gsap.utils.toArray<HTMLElement>('[data-drift]', root).forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 14 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: EASE,
            delay: 0.2,
            scrollTrigger: { trigger: element, start: 'top 95%', once: true },
          },
        )
      })
    }, root)

    const refresh = () => ScrollTrigger.refresh()
    void document.fonts?.ready.then(refresh)
    const timer = window.setTimeout(refresh, 700)
    window.addEventListener('load', refresh)

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('load', refresh)
      context.revert()
    }
  }, [rootRef, key])
}
