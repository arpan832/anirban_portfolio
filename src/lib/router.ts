import { createContext, useContext } from 'react'

export type NavigateOptions = { section?: string }

export type RouterValue = {
  route: string
  navigate: (path: string, options?: NavigateOptions) => void
}

export const readPath = () => {
  if (typeof window === 'undefined') return '/'
  const path = window.location.pathname.replace(/\/+$/, '')
  return path || '/'
}

export const RouterContext = createContext<RouterValue>({
  route: '/',
  navigate: () => undefined,
})

export const useRouter = () => useContext(RouterContext)
