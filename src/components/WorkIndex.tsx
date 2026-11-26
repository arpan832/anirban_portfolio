import { categories } from '../data/portfolio'
import { Icon } from './Icon'
import { InternalLink } from './InternalLink'
import { CoverMedia } from './Media'

export const WorkIndex = () => (
  <section className="archive" aria-labelledby="archive-title">
    <div className="section archive-head">
      <div className="archive-head-row">
        <div>
          <p className="eyebrow" data-reveal>
            Bodies of work
          </p>
          <h2 className="display" id="archive-title" data-lines>
            <span className="line">
              <span className="line-inner">Five ways </span>
            </span>
            <span className="line">
              <span className="line-inner">
                of <em>seeing.</em>{' '}
              </span>
            </span>
          </h2>
        </div>
        <div className="archive-head-aside" data-reveal>
          <p className="section-note">
            Five archives, one way of looking. Each cover opens a full body of work — no
            waiting rooms, no thumbnails.
          </p>
          <span className="archive-head-meta">01 — 05</span>
        </div>
      </div>
    </div>

    <div className="archive-list">
      {categories.map((category) => (
        <article className="work-card" key={category.id}>
          <InternalLink
            href={category.path}
            className="work-card-link"
            aria-label={`${category.title} — open the full body of work`}
          >
            <div className="work-card-media">
              <div className="work-card-zoom" data-cover-zoom>
                <CoverMedia
                  item={category.cover}
                  className="work-card-image"
                  sizes="100vw"
                />
              </div>
              <span className="work-card-scrim" aria-hidden="true" />
              <span className="work-card-frame" aria-hidden="true" />
              <div className="work-card-overlay">
                <div className="work-card-index">
                  <span className="work-card-number">{category.number}</span>
                  <span className="eyebrow">{category.eyebrow}</span>
                </div>
                <h3 className="work-card-title" data-lines>
                  <span className="line">
                    <span className="line-inner">{category.title}</span>
                  </span>
                </h3>
              </div>
            </div>

            <div className="work-card-foot">
              <p className="work-card-summary">{category.summary}</p>
              <span className="work-card-frames">{category.items.length} frames</span>
              <span className="work-card-cta">
                View story
                <Icon name="arrow-up-right" size={14} />
              </span>
            </div>
          </InternalLink>
        </article>
      ))}
    </div>
  </section>
)
