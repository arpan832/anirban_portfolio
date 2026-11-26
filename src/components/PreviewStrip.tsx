import { formatCount, previewHeading, previews, tickerWords } from '../data/portfolio'
import { InternalLink } from './InternalLink'
import { SmartImage } from './Media'

export const Ticker = () => (
  <div className="ticker" aria-hidden="true">
    <div className="ticker-track">
      {[0, 1].map((copy) => (
        <div className="ticker-row" key={copy}>
          {tickerWords.map((word) => (
            <span className="ticker-item" key={`${copy}-${word}`}>
              {word}
              <span className="ticker-dot" />
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
)

export const PreviewStrip = () => (
  <section className="section previews" id="work" aria-labelledby="previews-title">
    <div className="section-head">
      <div className="section-head-main">
        <p className="eyebrow" data-reveal>
          {previewHeading.eyebrow}
        </p>
        <h2 className="display" id="previews-title" data-lines>
          <span className="line">
            <span className="line-inner">Images with </span>
          </span>
          <span className="line">
            <span className="line-inner">
              an <em>atmosphere.</em>{' '}
            </span>
          </span>
        </h2>
      </div>
      <p className="section-note" data-reveal>
        {previewHeading.note}
      </p>
    </div>

    <div className="preview-grid">
      {previews.map((preview, index) => (
        <InternalLink
          key={preview.src}
          href={preview.href}
          className={`preview-card preview-card-${index + 1}`}
          data-reveal
          data-reveal-delay={index * 0.07}
        >
          <figure className="preview-figure">
            <div className="preview-media">
              <div className="preview-parallax" data-parallax="4">
                <SmartImage
                  item={preview}
                  className="preview-image"
                  sizes="(min-width: 1000px) 32vw, (min-width: 700px) 48vw, 92vw"
                />
              </div>
              <span className="preview-badge" aria-hidden="true">
                {formatCount(index + 1)}
              </span>
            </div>
            <figcaption className="preview-caption">
              <span className="preview-caption-title">{preview.caption}</span>
              <span className="preview-caption-meta">
                {preview.label}
                <span className="preview-caption-arrow" aria-hidden="true">
                  ↗
                </span>
              </span>
            </figcaption>
          </figure>
        </InternalLink>
      ))}
    </div>
  </section>
)
