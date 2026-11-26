import { useEffect, useState } from 'react'
import { instagram } from '../data/portfolio'
import { useRouter } from '../lib/router'
import { scrollToSection, scrollToTop } from '../lib/scroll'
import { Icon } from './Icon'
import { InternalLink } from './InternalLink'

const formatIndiaTime = () =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date())

export const SiteFooter = () => {
  const { route, navigate } = useRouter()
  const [time, setTime] = useState(formatIndiaTime)
  const [year] = useState(() => new Date().getFullYear())

  useEffect(() => {
    const timer = window.setInterval(() => setTime(formatIndiaTime()), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  const goToSection = (section: string) => {
    if (route === '/') scrollToSection(section)
    else navigate('/', { section })
  }

  return (
    <footer className="footer">
      <div className="footer-top">
        <InternalLink
          href="/"
          className="footer-brand"
          aria-label="Anirban Creates — home"
          onClick={() => {
            if (route === '/') scrollToTop()
          }}
        >
          <span>Anirban</span>
          <span className="footer-brand-italic">Creates</span>
        </InternalLink>
        <p className="footer-tagline">Every moment has a story.</p>
        <p className="footer-clock">
          <span>India</span>
          <span className="footer-clock-time">{time} IST</span>
        </p>
      </div>

      <div className="footer-bottom">
        <span className="footer-copy">© {year} Anirban Creates</span>
        <nav className="footer-nav" aria-label="Footer">
          {[
            { id: 'work', label: 'Work' },
            { id: 'about', label: 'About' },
            { id: 'contact', label: 'Contact' },
          ].map((item) => (
            <a
              key={item.id}
              href={route === '/' ? `#${item.id}` : `/#${item.id}`}
              onClick={(event) => {
                event.preventDefault()
                goToSection(item.id)
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <a className="footer-social" href={instagram.url} target="_blank" rel="noreferrer">
          Instagram
          <Icon name="arrow-up-right" size={12} />
        </a>
        <button type="button" className="footer-top-link" onClick={scrollToTop}>
          Back to top
          <Icon name="arrow-up" size={12} />
        </button>
      </div>
    </footer>
  )
}
