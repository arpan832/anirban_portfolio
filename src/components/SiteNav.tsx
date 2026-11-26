import { useEffect, useState } from 'react'
import { instagram } from '../data/portfolio'
import { useRouter } from '../lib/router'
import { scrollToSection, scrollToTop } from '../lib/scroll'
import { Icon } from './Icon'
import { InternalLink } from './InternalLink'

const sections = [
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
]

export const SiteNav = () => {
  const { route, navigate } = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const onHome = route === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [route])

  const handleSection = (section: string) => {
    if (route === '/') {
      scrollToSection(section)
      return
    }
    navigate('/', { section })
  }

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}`}>
      <InternalLink
        href="/"
        className="nav-brand"
        aria-label="Anirban Creates — home"
        onClick={() => {
          if (route === '/') scrollToTop()
        }}
      >
        <span className="nav-brand-name">Anirban</span>
        <span className="nav-brand-suffix">Creates</span>
      </InternalLink>

      <nav className="nav-links" aria-label="Primary">
        {sections.map((section) => (
          <a
            key={section.id}
            href={onHome ? `#${section.id}` : `/#${section.id}`}
            className={section.id === 'work' && !onHome ? 'is-active' : undefined}
            aria-current={section.id === 'work' && !onHome ? 'page' : undefined}
            onClick={(event) => {
              event.preventDefault()
              handleSection(section.id)
            }}
          >
            {section.label}
          </a>
        ))}
      </nav>

      <a
        className="nav-social"
        href={instagram.url}
        target="_blank"
        rel="noreferrer"
        aria-label={`Instagram — ${instagram.handle}`}
      >
        <span>Instagram</span>
        <Icon name="arrow-up-right" size={13} />
      </a>
    </header>
  )
}
