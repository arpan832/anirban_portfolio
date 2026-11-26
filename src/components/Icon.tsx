import type { SVGProps } from 'react'

const paths = {
  'arrow-up-right': <path d="M5.5 18.5 18.5 5.5M8 5.5h10.5V16" />,
  'arrow-down': <path d="M12 4v16M5.5 13.5 12 20l6.5-6.5" />,
  'arrow-left': <path d="M19.5 12H4.5M10.5 5.5 4 12l6.5 6.5" />,
  'arrow-right': <path d="M4.5 12h15M13.5 5.5 20 12l-6.5 6.5" />,
  'arrow-up': <path d="M12 20V4M5.5 10.5 12 4l6.5 6.5" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  expand: <path d="M9 3.5H3.5V9M15 20.5h5.5V15M20.5 9V3.5H15M3.5 15v5.5H9" />,
  pause: <path d="M9 5v14M15 5v14" />,
  play: <path d="M7 4.5 19.5 12 7 19.5Z" />,
  'chevron-left': <path d="M15 5 8 12l7 7" />,
  'chevron-right': <path d="m9 5 7 7-7 7" />,
} as const

export type IconName = keyof typeof paths

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName
  size?: number
}

export const Icon = ({ name, size = 16, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.4}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    {paths[name]}
  </svg>
)
