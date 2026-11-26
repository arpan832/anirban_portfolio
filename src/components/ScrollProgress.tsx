import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'

/** A hairline of accent colour that draws itself as the story unfolds. */
export const ScrollProgress = () => {
  const barRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const bar = barRef.current
    if (!bar) return
    const tween = gsap.to(bar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.4 },
    })
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  return (
    <div className="scroll-progress" aria-hidden="true">
      <span ref={barRef} />
    </div>
  )
}
