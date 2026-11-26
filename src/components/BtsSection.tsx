import { btsSection, formatCount } from '../data/portfolio'
import { SmartVideo } from './Media'

export const BtsSection = () => (
  <section className="bts" id="bts" aria-labelledby="bts-title">
    <div className="bts-inner">
      <div className="bts-head">
        <div>
          <p className="eyebrow eyebrow--light" data-reveal>
            {btsSection.eyebrow}
          </p>
          <h2 className="display display--light" id="bts-title" data-lines>
            <span className="line">
              <span className="line-inner">Between </span>
            </span>
            <span className="line">
              <span className="line-inner">
                the <em>frames.</em>{' '}
              </span>
            </span>
          </h2>
        </div>
        <p className="bts-note" data-reveal>
          {btsSection.note}
        </p>
      </div>

      <div className="bts-grid">
        {btsSection.videos.map((video, index) => (
          <figure
            className="bts-film"
            key={video.src}
            data-reveal
            data-reveal-delay={index * 0.08}
          >
            <div className="bts-film-media">
              <SmartVideo
                src={video.src}
                poster={video.poster}
                label={video.alt}
                className="bts-video"
                controls
              />
            </div>
            <figcaption className="bts-caption">
              <span className="bts-caption-index">{formatCount(index + 1)}</span>
              <span>{video.label}</span>
              <span className="bts-caption-note">Silent loop</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
)
