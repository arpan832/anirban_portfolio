import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { useRouter } from '../lib/router'
import type { NavigateOptions } from '../lib/router'

type InternalLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string
  options?: NavigateOptions
  children: ReactNode
}

/**
 * Client-side link that keeps browser history intact and lets modified clicks
 * (new tab, new window, copy link) behave exactly as expected.
 */
export const InternalLink = ({
  href,
  options,
  children,
  onClick,
  ...props
}: InternalLinkProps) => {
  const { navigate } = useRouter()

  return (
    <a
      {...props}
      href={href}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        if (
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return
        }
        event.preventDefault()
        navigate(href, options)
      }}
    >
      {children}
    </a>
  )
}
