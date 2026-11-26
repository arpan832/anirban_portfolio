import { instagram } from '../data/portfolio'
import { Icon } from './Icon'

/**
 * Contact intentionally leans on Instagram: the biography source does not
 * include a working email address, so no email link is rendered.
 */
export const ContactSection = () => (
  <section className="contact" id="contact" aria-labelledby="contact-title">
    <div className="contact-inner">
      <p className="eyebrow" data-reveal>
        Commissions &amp; collaborations
      </p>
      <h2 className="display contact-title" id="contact-title" data-lines>
        <span className="line">
          <span className="line-inner">Have a story </span>
        </span>
        <span className="line">
          <span className="line-inner">
            to <em>tell?</em>{' '}
          </span>
        </span>
      </h2>

      <div className="contact-bottom">
        <p className="contact-lede" data-reveal>
          Tell me about the moment you want to keep — a portrait, a wedding, a night of
          music, a product in the right light. The quickest way to reach me is Instagram.
        </p>
        <div className="contact-actions" data-reveal>
          <a
            className="button"
            href={instagram.url}
            target="_blank"
            rel="noreferrer"
          >
            <span>Start a conversation</span>
            <Icon name="arrow-up-right" size={15} />
          </a>
          <a
            className="contact-handle"
            href={instagram.url}
            target="_blank"
            rel="noreferrer"
          >
            {instagram.handle}
          </a>
        </div>
      </div>
    </div>
  </section>
)
