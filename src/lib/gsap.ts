import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true })

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** The easing used for most narrative reveals — fast out, long settle. */
export const EASE = 'expo.out'
export const EASE_IN_OUT = 'power2.inOut'

export { gsap, ScrollTrigger }
