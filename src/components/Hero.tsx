import { useLayoutEffect, useRef } from 'react'
import { hero } from '../data/portfolio'
import { gsap, prefersReducedMotion, ScrollTrigger } from '../lib/gsap'
import { scrollToSection } from '../lib/scroll'
import { Icon } from './Icon'

/**
 * The opening shot: a smaller framed photograph beside a typographic
 * introduction, held in place while scrolling expands the frame to full bleed.
 */
export const Hero = ({ ready }: { ready: boolean }) => {
  const rootRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || prefersReducedMotion()) return

    const context = gsap.context(() => {
      const matchMedia = gsap.matchMedia()

      matchMedia.add('(min-width: 901px)', () => {
        const media = root.querySelector('[data-hero-media]')
        const image = root.querySelector('[data-hero-image]')
        const ring = root.querySelector('[data-hero-ring]')
        const caption = root.querySelector('[data-hero-caption]')
        const copy = root.querySelector('[data-hero-copy]')
        const foot = root.querySelector('[data-hero-foot]')

        if (!media || !image) return

        /* Read the CSS frame so the opening clip is explicit to GSAP. It is a
           function so a resize (and ScrollTrigger's refresh) re-reads the
           breakpoint variables instead of keeping the first value. */
        const frameElement = media.parentElement ?? media
        const readOpeningClip = () => {
          const frame = getComputedStyle(frameElement)
          const frameValue = (name: string, fallback: string) =>
            frame.getPropertyValue(name).trim() || fallback
          return `inset(${frameValue('--frame-top', '9%')} ${frameValue(
            '--frame-right',
            '5.5%',
          )} ${frameValue('--frame-bottom', '12%')} ${frameValue(
            '--frame-left',
            '46%',
          )})`
        }

        gsap.set(image, { scale: 1.06 })

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: '+=110%',
            scrub: 0.55,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        timeline
          .fromTo(
            media,
            { clipPath: readOpeningClip },
            { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power1.inOut' },
            0,
          )
          .to(image, { scale: 1, ease: 'power1.inOut' }, 0)
          .to(ring, { autoAlpha: 0, duration: 0.3 }, 0)
          .to(caption, { autoAlpha: 0, duration: 0.18 }, 0)
          .to(copy, { autoAlpha: 0, y: -64, ease: 'power1.in' }, 0.05)
          .to(foot, { autoAlpha: 0, ease: 'power1.in' }, 0.05)

        return () => {
          gsap.set(image, { scale: 1 })
        }
      })
    }, root)

    ScrollTrigger.refresh()

    return () => context.revert()
  }, [])

  useLayoutEffect(() => {
    if (!ready) return
    const root = rootRef.current
    if (!root || prefersReducedMotion()) return

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'expo.out' } })
      timeline
        .from('[data-hero-line]', {
          yPercent: 122,
          duration: 1.35,
          stagger: 0.1,
          delay: 0.05,
        })
        .from(
          '[data-hero-fade]',
          { autoAlpha: 0, y: 22, duration: 1, stagger: 0.08 },
          0.35,
        )
        .fromTo(
          '[data-hero-media]',
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 1.1 },
          0.2,
        )
        .from('[data-hero-marks]', { autoAlpha: 0, duration: 1.2 }, 0.5)
        .from('[data-hero-foot]', { autoAlpha: 0, duration: 1 }, 0.8)
    }, root)

    return () => context.revert()
  }, [ready])

  return (
    <section className="hero" id="top" ref={rootRef} aria-labelledby="hero-title">
      <div className="hero-pin">
        <figure className="hero-media">
          <div className="hero-media-clip" data-hero-media>
            <img
              src={hero.image.src}
              srcSet={hero.image.srcSet}
              sizes="100vw"
              alt={hero.image.alt}
              data-hero-image
              fetchPriority="high"
              decoding="async"
              draggable={false}
            />
            <span className="hero-media-scrim" aria-hidden="true" />
          </div>
          <div className="hero-marks" data-hero-marks data-hero-ring>
            <span className="hero-media-ring" aria-hidden="true" />
          </div>
          <figcaption className="hero-media-caption" data-hero-caption>
            <span>Selected frame</span>
            <span>01 / 05</span>
          </figcaption>
        </figure>

        <div className="hero-copy" data-hero-copy>
          <p className="eyebrow hero-eyebrow" data-hero-fade>
            <span className="eyebrow-mark" aria-hidden="true" />
            {hero.eyebrow}
          </p>
          <h1 className="hero-title" id="hero-title">
            <span className="line">
              <span className="line-inner" data-hero-line>
                Every moment{' '}
              </span>
            </span>
            <span className="line">
              <span className="line-inner" data-hero-line>
                has a <em>story.</em>{' '}
              </span>
            </span>
          </h1>
          <p className="hero-lede" data-hero-fade>
            {hero.lede}
          </p>
          <a
            className="hero-cta"
            href="#work"
            data-hero-fade
            onClick={(event) => {
              event.preventDefault()
              scrollToSection('work')
            }}
          >
            <span>Enter the archive</span>
            <span className="hero-cta-arrow">
              <Icon name="arrow-down" size={14} />
            </span>
          </a>
        </div>

        <div className="hero-foot" data-hero-foot>
          <span className="hero-foot-item">01 — Selected work</span>
          <span className="hero-foot-item hero-foot-services">{hero.meta}</span>
          <span className="hero-scroll">
            <span className="hero-scroll-line" aria-hidden="true" />
            Scroll to unfold
          </span>
        </div>
      </div>
    </section>
  )
}
