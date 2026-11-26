import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { getSmoothScroll } from '../lib/scroll'
import type { MediaItem } from '../data/portfolio'
import { Icon } from './Icon'

/**
 * Full-screen viewer built on the native dialog element, so focus trapping,
 * Escape handling and the backdrop come from the platform.
 */
export const Lightbox = ({
  items,
  index,
  onClose,
  onIndexChange,
}: {
  items: MediaItem[]
  index: number | null
  onClose: () => void
  onIndexChange: (index: number) => void
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const isOpen = index !== null
  const item = index !== null ? items[index] : undefined

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen) {
      if (!dialog.open) {
        triggerRef.current =
          document.activeElement instanceof HTMLElement ? document.activeElement : null
        dialog.showModal()
      }
      return
    }
    if (dialog.open) dialog.close()
    triggerRef.current?.focus()
    triggerRef.current = null
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const lenis = getSmoothScroll()
    lenis?.stop()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
      lenis?.start()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || !imageRef.current || prefersReducedMotion()) return
    const tween = gsap.fromTo(
      imageRef.current,
      { autoAlpha: 0, y: 12 },
      { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' },
    )
    return () => {
      tween.kill()
    }
  }, [index, isOpen])

  const step = (direction: number) => {
    if (index === null) return
    const next = (index + direction + items.length) % items.length
    onIndexChange(next)
  }

  return (
    <dialog
      className="lightbox"
      ref={dialogRef}
      data-lenis-prevent
      aria-label="Photograph viewer"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose()
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') {
          event.preventDefault()
          step(1)
        }
        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          step(-1)
        }
      }}
    >
      {item ? (
        <div className="lightbox-inner">
          <div className="lightbox-stage">
            <img
              ref={imageRef}
              key={item.src}
              src={item.src}
              srcSet={item.srcSet}
              sizes="100vw"
              alt={item.alt}
              draggable={false}
            />
          </div>

          <div className="lightbox-bar">
            <div className="lightbox-nav">
              <button type="button" onClick={() => step(-1)} aria-label="Previous photograph">
                <Icon name="chevron-left" size={18} />
              </button>
              <button type="button" onClick={() => step(1)} aria-label="Next photograph">
                <Icon name="chevron-right" size={18} />
              </button>
            </div>
            <p className="lightbox-caption">{item.alt}</p>
            <p className="lightbox-count" aria-live="polite">
              {String((index ?? 0) + 1).padStart(2, '0')} /{' '}
              {String(items.length).padStart(2, '0')}
            </p>
            <button type="button" className="lightbox-close" onClick={onClose} aria-label="Close viewer">
              <Icon name="close" size={18} />
            </button>
          </div>
        </div>
      ) : null}
    </dialog>
  )
}
