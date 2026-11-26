import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { prefersReducedMotion } from '../lib/gsap'
import type { MediaItem } from '../data/portfolio'
import { Icon } from './Icon'

type SmartImageProps = {
  item: MediaItem
  /** Tell the browser how wide the image will be painted. */
  sizes?: string
  className?: string
  eager?: boolean
  style?: CSSProperties
}

export const SmartImage = ({
  item,
  sizes = '100vw',
  className,
  eager = false,
  style,
}: SmartImageProps) => (
  <img
    src={item.src}
    srcSet={item.srcSet}
    sizes={item.srcSet ? sizes : undefined}
    alt={item.alt}
    className={className}
    style={style}
    loading={eager ? 'eager' : 'lazy'}
    decoding="async"
    fetchPriority={eager ? 'high' : 'auto'}
    draggable={false}
  />
)

/**
 * Autoplay is best-effort: some browsers reject the promise, and a few webviews
 * throw synchronously. Neither should interrupt the page.
 */
const attemptPlay = (video: HTMLVideoElement) => {
  try {
    const result = video.play()
    if (result && typeof result.catch === 'function') result.catch(() => undefined)
  } catch {
    /* autoplay blocked — the poster stays */
  }
}

type SmartVideoProps = {
  src: string
  poster?: string
  label: string
  className?: string
  controls?: boolean
}

/**
 * Muted, looping preview that only fetches its file when it approaches the
 * viewport and only plays while visible. Reduced-motion visitors get the poster.
 */
export const SmartVideo = ({
  src,
  poster,
  label,
  className,
  controls = false,
}: SmartVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const inView = useRef(false)
  const [near, setNear] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [reduced] = useState(prefersReducedMotion)
  const allowed = !reduced

  useEffect(() => {
    const video = videoRef.current
    if (!video || !allowed) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting
        if (entry.isIntersecting) {
          setNear(true)
          if (!reduced) attemptPlay(video)
        } else {
          video.pause()
        }
      },
      { rootMargin: '220px 0px', threshold: 0.08 },
    )

    observer.observe(video)
    return () => {
      observer.disconnect()
      video.pause()
    }
  }, [allowed, reduced])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !allowed || !near || reduced) return
    if (!inView.current) return
    attemptPlay(video)
  }, [allowed, near, reduced])

  const toggle = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) attemptPlay(video)
    else video.pause()
  }

  return (
    <>
      <video
        ref={videoRef}
        className={className}
        src={allowed && near ? src : undefined}
        poster={poster}
        muted
        loop
        playsInline
        preload={near ? 'metadata' : 'none'}
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        tabIndex={-1}
      />
      {controls && allowed && !reduced ? (
        <button
          type="button"
          className="video-toggle"
          onClick={toggle}
          aria-label={playing ? `Pause ${label}` : `Play ${label}`}
        >
          <Icon name={playing ? 'pause' : 'play'} size={12} />
        </button>
      ) : null}
      {reduced ? <span className="sr-only">{label} — playing disabled for reduced motion</span> : null}
    </>
  )
}

/**
 * Category cover. Only wide screens with motion allowed receive the film;
 * phones and reduced-motion visitors get the same photograph as a responsive
 * `<img>`, which is cheaper and never depends on autoplay.
 */
export const CoverMedia = ({
  item,
  className,
  sizes = '100vw',
  eager = false,
}: {
  item: MediaItem
  className?: string
  sizes?: string
  eager?: boolean
}) => {
  const [allowVideo, setAllowVideo] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(min-width: 900px)').matches &&
      !prefersReducedMotion(),
  )

  useEffect(() => {
    const query = window.matchMedia('(min-width: 900px)')
    const update = () =>
      setAllowVideo(query.matches && !prefersReducedMotion())
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  if (item.kind === 'video' && item.videoSrc && allowVideo) {
    return (
      <SmartVideo
        src={item.videoSrc}
        poster={item.poster}
        label={item.alt}
        className={className}
      />
    )
  }

  return <SmartImage item={item} className={className} sizes={sizes} eager={eager} />
}
