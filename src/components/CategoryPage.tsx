import type { MediaItem, PortfolioCategory } from '../data/portfolio'
import { artists, categories, formatCount } from '../data/portfolio'
import { ArtistGallery, GalleryGrid } from './Gallery'
import { Icon } from './Icon'
import { InternalLink } from './InternalLink'
import { CoverMedia, SmartImage } from './Media'

const Words = ({ text }: { text: string }) => (
  <>
    {text.split(' ').map((word, index) => (
      <span className="word" key={`${word}-${index}`}>
        <span className="line-inner">{word} </span>
      </span>
    ))}
  </>
)

const NextCard = ({
  category,
  direction,
}: {
  category: PortfolioCategory
  direction: 'previous' | 'next'
}) => (
  <InternalLink href={category.path} className={`next-card next-card--${direction}`}>
    <span className="next-card-label">
      {direction === 'next' ? 'Next story' : 'Previous story'}
      <span className="next-card-number">{category.number}</span>
    </span>
    <span className="next-card-media">
      <SmartImage
        item={category.cover as MediaItem}
        sizes="(min-width: 900px) 44vw, 92vw"
      />
    </span>
    <span className="next-card-row">
      <span className="next-card-title">{category.title}</span>
      <Icon name={direction === 'next' ? 'arrow-right' : 'arrow-left'} size={16} />
    </span>
  </InternalLink>
)

export const CategoryPage = ({ category }: { category: PortfolioCategory }) => {
  const index = categories.findIndex((entry) => entry.id === category.id)
  const next = categories[(index + 1) % categories.length]
  const previous = categories[(index - 1 + categories.length) % categories.length]

  return (
    <main className="category-page" id="main">
      <header className="cat-hero">
        <div className="cat-container cat-top">
          <InternalLink href="/" className="back-link">
            <Icon name="arrow-left" size={13} />
            <span>All work</span>
          </InternalLink>
          <span className="cat-counter">
            {category.number} / {formatCount(categories.length)}
          </span>
        </div>

        <div className="cat-container">
          <p className="eyebrow cat-eyebrow">
            {category.eyebrow} — {category.items.length} frames
          </p>
          <h1 className="display cat-title" data-words>
            <Words text={category.title} />
          </h1>
        </div>

        <figure className="cat-cover" data-reveal-image>
          <div className="cat-cover-zoom" data-cover-zoom>
            <CoverMedia
              item={category.cover}
              className="cat-cover-media"
              sizes="100vw"
              eager
            />
          </div>
          <figcaption className="cat-cover-caption">
            <span>{category.cover.alt}</span>
            <span>{category.number}</span>
          </figcaption>
        </figure>

        <div className="cat-container cat-intro">
          <p className="cat-intro-text" data-reveal>
            {category.intro}
          </p>
          <dl className="cat-facts" data-reveal>
            <div>
              <dt>Frames</dt>
              <dd>{category.items.length}</dd>
            </div>
            <div>
              <dt>Discipline</dt>
              <dd>{category.eyebrow}</dd>
            </div>
            <div>
              <dt>Archive</dt>
              <dd>
                {category.number} / {formatCount(categories.length)}
              </dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="cat-container cat-body">
        {category.id === 'concerts' ? (
          <ArtistGallery artists={artists} />
        ) : (
          <GalleryGrid items={category.items} label={`${category.title} photograph`} />
        )}
      </div>

      <nav className="cat-container cat-next" aria-label="More bodies of work">
        <NextCard category={previous} direction="previous" />
        <NextCard category={next} direction="next" />
      </nav>

      <div className="cat-container cat-outro">
        <InternalLink href="/" className="back-link">
          <Icon name="arrow-left" size={13} />
          <span>Back to all work</span>
        </InternalLink>
        <span className="cat-outro-mark">Anirban Creates — photography</span>
      </div>
    </main>
  )
}

export const NotFoundPage = () => (
  <main className="not-found" id="main">
    <div className="cat-container">
      <p className="eyebrow">404 — Outside the frame</p>
      <h1 className="display not-found-title" data-words>
        <Words text="This frame is not in the archive." />
      </h1>
      <p className="not-found-note">
        The page you were looking for may have moved. The photographs are still where you
        left them.
      </p>
      <InternalLink href="/" className="button">
        <span>Return home</span>
        <Icon name="arrow-right" size={15} />
      </InternalLink>
    </div>
  </main>
)
