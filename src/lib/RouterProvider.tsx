import type { ReactNode } from 'react'
import { RouterContext } from './router'
import type { RouterValue } from './router'

export const RouterProvider = ({
  value,
  children,
}: {
  value: RouterValue
  children: ReactNode
}) => <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
