import { useState } from 'react'
import type { CSSProperties } from 'react'
import type { MediaItem } from '../data/portfolio'
import { Icon } from './Icon'
import { Lightbox } from './Lightbox'
import { SmartImage } from './Media'

/** A varied 12-column rhythm; the pattern repeats so long galleries stay calm. */
const cellPattern = [
  { span: 7, ratio: '3 / 2' },
  { span: 5, ratio: '4 / 5' },
  { span: 4, ratio: '4 / 5' },
  { span: 4, ratio: '1 / 1' },
  { span: 4, ratio: '4 / 5' },
  { span: 6, ratio: '3 / 2' },
  { span: 6, ratio: '4 / 5' },
  { span: 5, ratio: '4 / 5' },
  { span: 7, ratio: '3 / 2' },
  { span: 4, ratio: '1 / 1' },
  { span: 4, ratio: '3 / 4' },
  { span: 4, ratio: '1 / 1' },
]

export const GalleryGrid = ({
  items,
  sizes = '(min-width: 1200px) 44vw, (min-width: 700px) 46vw, 92vw',
  label = 'photograph',
}: {
  items: MediaItem[]
  sizes?: string
  label?: string
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <>
      <div className="gallery">
        {items.map((item, index) => {
          const cell = cellPattern[index % cellPattern.length]
          return (
            <figure
              className="frame"
              key={item.src}
              data-frame
              style={
                {
                  '--span': cell.span,
                  '--ratio': cell.ratio,
                } as CSSProperties
              }
            >
              <button
                type="button"
                className="frame-button"
                onClick={() => setOpenIndex(index)}
                aria-label={`Open ${label} ${index + 1} of ${items.length} in full screen`}
              >
                <SmartImage item={item} className="frame-image" sizes={sizes} />
                <span className="frame-hover" aria-hidden="true">
                  <Icon name="expand" size={14} />
                  <span>View</span>
                </span>
              </button>
            </figure>
          )
        })}
      </div>

      <Lightbox
        items={items}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onIndexChange={setOpenIndex}
      />
    </>
  )
}

export const ArtistGallery = ({
  artists,
}: {
  artists: Array<{ id: string; name: string; items: MediaItem[] }>
}) => (
  <div className="artists">
    {artists.map((artist) => (
      <section className="artist" key={artist.id} id={`artist-${artist.id}`}>
        <header className="artist-head">
          <h2 className="artist-name">{artist.name}</h2>
          <span className="artist-count">
            {artist.items.length} frames
          </span>
        </header>
        <GalleryGrid
          items={artist.items}
          sizes="(min-width: 1200px) 30vw, (min-width: 700px) 46vw, 92vw"
          label={`${artist.name} concert photograph`}
        />
      </section>
    ))}
  </div>
)
