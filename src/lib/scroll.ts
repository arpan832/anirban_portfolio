import Lenis from 'lenis'
import { prefersReducedMotion } from './gsap'

let instance: Lenis | null = null

export const setSmoothScroll = (lenis: Lenis | null) => {
  instance = lenis
}

export const getSmoothScroll = () => instance

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

/** Clear the fixed navigation bar when a section is scrolled to. */
const NAV_OFFSET = 88

/** Scrolls to a section, using Lenis when it is running. */
export const scrollToSection = (id: string) => {
  const target = document.getElementById(id.replace(/^#/, ''))
  if (!target) return

  if (instance) {
    instance.scrollTo(target, {
      offset: -NAV_OFFSET,
      duration: 1.35,
      easing: easeOutCubic,
    })
    return
  }

  target.scrollIntoView({
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'start',
  })
}

/** Scrolls to a vertical position (0 = top of the page). */
export const scrollToTop = () => {
  if (instance) {
    instance.scrollTo(0, { immediate: true })
    return
  }
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
}

export const scrollToY = (top: number) => {
  if (instance) {
    instance.scrollTo(top, { immediate: true })
    return
  }
  window.scrollTo({ top, left: 0, behavior: 'auto' })
}
