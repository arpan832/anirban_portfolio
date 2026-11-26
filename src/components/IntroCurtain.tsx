import { useLayoutEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'

/**
 * A short opening title card. It sets the tone, hides font loading, and hands
 * over to the hero as it lifts away. Skipped on repeat visits in a session and
 * for visitors who prefer reduced motion.
 */
export const IntroCurtain = ({
  onReveal,
  onDone,
}: {
  onReveal: () => void
  onDone: () => void
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const handedOver = useRef(false)

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return

    if (prefersReducedMotion()) {
      onReveal()
      onDone()
      return
    }

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: 'expo.out' },
        onComplete: onDone,
      })

      timeline
        .from('[data-intro-line] .line-inner', {
          yPercent: 120,
          duration: 1,
          stagger: 0.085,
        })
        .from(
          '[data-intro-meta]',
          { autoAlpha: 0, y: 12, duration: 0.7, stagger: 0.08 },
          0.25,
        )
        .fromTo(
          '[data-intro-progress]',
          { scaleX: 0 },
          { scaleX: 1, duration: 1.1, ease: 'power2.inOut' },
          0.15,
        )
        .add(() => {
          if (handedOver.current) return
          handedOver.current = true
          onReveal()
        }, '+=0.1')
        .to(element, {
          yPercent: -100,
          duration: 0.9,
          ease: 'power4.inOut',
        })
    }, element)

    return () => ctx.revert()
  }, [onDone, onReveal])

  return (
    <div className="intro" ref={ref} aria-hidden="true">
      <div className="intro-inner">
        <p className="intro-eyebrow" data-intro-meta>
          Photography portfolio
        </p>
        <p className="intro-brand" data-intro-line>
          <span className="line">
            <span className="line-inner">Anirban</span>
          </span>
          <span className="line intro-brand-italic">
            <span className="line-inner">Creates</span>
          </span>
        </p>
        <p className="intro-note" data-intro-meta>
          Portrait · Fashion · Wedding · Event · Concert · Product
        </p>
      </div>
      <div className="intro-progress-track">
        <span className="intro-progress-bar" data-intro-progress />
      </div>
      <p className="intro-foot" data-intro-meta>
        India — Photographs with intent
      </p>
    </div>
  )
}
