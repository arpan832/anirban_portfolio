import { about, instagram } from '../data/portfolio'
import { Icon } from './Icon'
import { SmartImage } from './Media'

export const AboutSection = () => (
  <section className="section about" id="about" aria-labelledby="about-title">
    <div className="about-grid">
      <figure className="about-portrait" data-reveal-image>
        <div className="about-portrait-frame">
          <div className="about-portrait-parallax" data-parallax="4">
            <SmartImage
              item={about.portrait}
              className="about-portrait-image"
              sizes="(min-width: 900px) 34vw, 88vw"
            />
          </div>
        </div>
        <figcaption className="about-portrait-caption">
          <span>Anirban</span>
          <span>Freelance photographer</span>
        </figcaption>
      </figure>

      <div className="about-copy">
        <p className="eyebrow" data-reveal>
          {about.eyebrow}
        </p>
        <h2 className="display" id="about-title" data-lines>
          <span className="line">
            <span className="line-inner">Light, presence, </span>
          </span>
          <span className="line">
            <span className="line-inner">
              and <em>perspective.</em>{' '}
            </span>
          </span>
        </h2>

        <div className="about-text" data-reveal>
          {about.paragraphs.map((paragraph, index) => (
            <p className={index === 0 ? 'about-lead' : undefined} key={paragraph.slice(0, 24)}>
              {paragraph}
            </p>
          ))}
        </div>

        <blockquote className="about-quote" data-reveal>
          <span aria-hidden="true">“</span>
          {about.quote}
          <span aria-hidden="true">”</span>
        </blockquote>

        <div className="about-practices" data-reveal>
          <span className="about-practices-label">Practice</span>
          <ul>
            {about.practices.map((practice) => (
              <li key={practice}>{practice}</li>
            ))}
          </ul>
        </div>

        <a
          className="link-inline"
          href={instagram.url}
          target="_blank"
          rel="noreferrer"
          data-reveal
        >
          <span>Follow the work on Instagram</span>
          <Icon name="arrow-up-right" size={14} />
        </a>
      </div>
    </div>
  </section>
)
