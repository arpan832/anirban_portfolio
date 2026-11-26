import concertCoverVideo from '../assets/_optimized-video/concert-cover.mp4'
import btsStageVideo from '../assets/_optimized-video/bts-stage.mp4'
import btsWorkingVideo from '../assets/_optimized-video/bts-working.mp4'
import btsAfterMovieVideo from '../assets/_optimized-video/bts-after-movie.mp4'
import btsAfterMoviePoster from '../assets/_optimized-video/bts-after-movie.webp'
import btsStagePoster from '../assets/_optimized-video/bts-stage.webp'
import btsWorkingPoster from '../assets/_optimized-video/bts-working.webp'
import { mediaDimensions } from './media-dimensions'

/**
 * Portfolio content model.
 *
 * Photographs are discovered from the asset tree with Vite's import.meta.glob.
 * The site serves optimised derivatives (src/assets/_optimized*) and enumerates
 * them directly, which keeps a deploy light: 610 MB of originals become ~14 MB
 * of web images. After adding new photographs run `npm run media` to generate
 * derivatives — they then appear in the matching gallery automatically.
 *
 * media() also accepts an original path, so covers and the hero can be authored
 * with the exact filenames from the asset map.
 */

export type MediaItem = {
  src: string
  srcSet?: string
  alt: string
  kind?: 'image' | 'video'
  /** Video source for cover items that play a silent loop. */
  videoSrc?: string
  poster?: string
  /** Intrinsic size of the large derivative, for width/height attributes. */
  width?: number
  height?: number
}

export type PortfolioCategory = {
  id: string
  path: string
  number: string
  title: string
  eyebrow: string
  summary: string
  intro: string
  cover: MediaItem
  items: MediaItem[]
}

export type ArtistGroup = {
  id: string
  name: string
  items: MediaItem[]
}

const optimized = import.meta.glob<string>('../assets/_optimized/**/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
})

const optimizedSmall = import.meta.glob<string>(
  '../assets/_optimized-small/**/*.webp',
  { eager: true, query: '?url', import: 'default' },
)

const optimizedKey = (path: string) =>
  path.replace('../assets/', '../assets/_optimized/').replace(/\.[^.]+$/, '.webp')

const smallKey = (key: string) => key.replace('/_optimized/', '/_optimized-small/')

const sortKeys = (keys: string[]) => [...keys].sort((a, b) => a.localeCompare(b))

const buildMedia = (key: string, alt: string): MediaItem => {
  const largeSrc = optimized[key]
  const smallSrc = optimizedSmall[smallKey(key)]
  const size = mediaDimensions[key.replace('../assets/_optimized/', '')]

  return {
    src: largeSrc ?? '',
    srcSet:
      largeSrc && smallSrc ? `${smallSrc} 860w, ${largeSrc} 1800w` : undefined,
    alt,
    width: size?.[0],
    height: size?.[1],
  }
}

const media = (originalPath: string, alt: string) =>
  buildMedia(optimizedKey(originalPath), alt)

const galleryKeys = (prefix: string) => sortKeys(Object.keys(optimized).filter((key) => key.startsWith(prefix)))

const buildGallery = (
  prefix: string,
  describe: (key: string, index: number) => string,
): MediaItem[] =>
  galleryKeys(prefix)
    .map((key, index) => buildMedia(key, describe(key, index)))
    .filter((item) => item.src)

/* --------------------------------------------------------------------------
   Galleries
-------------------------------------------------------------------------- */

const CONCERT_PREFIX = '../assets/_optimized/CONCERT MOMENT/CONCERT MOMENT/'

/** Proper display names for the folders inside the concert archive. */
const artistNames: Record<string, string> = {
  'ANIRBAN BHATTACHARYA': 'Anirban Bhattacharya',
  'ARUNITA KANJILAL': 'Arunita Kanjilal',
  'NANDY SISTERS': 'Nandy Sisters',
  'SNIGDHAJIT BHOWMIK': 'Snigdhajit Bhowmik',
  'T.R.A.P': 'T.R.A.P',
}

const artistOf = (key: string) => {
  const folder = key.slice(CONCERT_PREFIX.length).split('/')[0]
  return { folder, name: artistNames[folder] ?? folder }
}

const buildArtistGroups = (): ArtistGroup[] => {
  const groups = new Map<string, MediaItem[]>()

  galleryKeys(CONCERT_PREFIX).forEach((key) => {
    const { name } = artistOf(key)
    const items = groups.get(name) ?? []
    items.push(
      buildMedia(
        key,
        `${name} live in concert, photographed by Anirban — frame ${items.length + 1}`,
      ),
    )
    groups.set(name, items)
  })

  return Array.from(groups, ([name, items]) => ({
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name,
    items,
  }))
}

const concertImages = buildGallery(CONCERT_PREFIX, (key, index) => {
  const { name } = artistOf(key)
  return `${name} live in concert, photographed by Anirban — frame ${index + 1}`
})

const modelImages = buildGallery(
  '../assets/_optimized/MODEL PHOTOSHOOT/MODEL PHOTOSHOOT/',
  (_key, index) => `Model photoshoot by Anirban — portrait frame ${index + 1}`,
)

const photographImages = buildGallery(
  '../assets/_optimized/PHOTOGRAPHS/PHOTOGRAPHS/',
  (_key, index) => `Documentary photograph by Anirban — frame ${index + 1}`,
)

const productImages = buildGallery(
  '../assets/_optimized/PRODUCT SHOOT/PRODUCT SHOOT/',
  (_key, index) => `Product photograph by Anirban — frame ${index + 1}`,
)

const weddingImages = buildGallery(
  '../assets/_optimized/WEDDING/WEDDING/',
  (_key, index) => `Wedding photograph by Anirban — frame ${index + 1}`,
)

/* --------------------------------------------------------------------------
   Content
-------------------------------------------------------------------------- */

const concertPoster = media(
  '../assets/COVER_PICTURES/concert-cover/T.R.A.P.jpg',
  'T.R.A.P performing under violet stage lights',
)

export const hero = {
  eyebrow: 'Freelance photographer — India',
  lede: 'Portraits, weddings, concerts and products — photographed for the atmosphere of a moment, the light falling through it, and the things that are easy to miss.',
  image: media(
    '../assets/Hero.jpg',
    'Two children pushing a bicycle across open ground in the early morning haze',
  ),
  meta: 'Portrait · Fashion · Wedding · Event · Concert · Product',
}

export const previewHeading = {
  eyebrow: 'Selected work',
  note: 'Three frames from the archive — a stage in violet light, an unhurried afternoon, and a bride in her own quiet moment.',
}

export const previews: Array<MediaItem & { caption: string; label: string; href: string }> = [
  {
    ...media(
      '../assets/PREVIEWS/preview01.jpg',
      'Violinist performing on a stage washed in blue and violet light',
    ),
    caption: 'Live stage',
    label: 'Concerts',
    href: '/work/concerts',
  },
  {
    ...media(
      '../assets/PREVIEWS/preview02.jpg',
      'Three children resting by a tree beside a bicycle',
    ),
    caption: 'Unhurried hours',
    label: 'Photographs',
    href: '/work/photographs',
  },
  {
    ...media(
      '../assets/PREVIEWS/preview03.jpg',
      'A bride in red and gold, surrounded by henna, jewellery and flowers',
    ),
    caption: 'The bride',
    label: 'Wedding',
    href: '/work/wedding',
  },
]

export const about = {
  eyebrow: 'About Anirban',
  portrait: media(
    '../assets/ABOUTME/me.jpg',
    'Anirban holding a camera in an open field',
  ),
  paragraphs: [
    "Hi, I'm Anirban, a freelance photographer passionate about capturing people, emotions and meaningful moments through my lens.",
    'I specialise in portrait, fashion, wedding, event, concert and product photography, creating images that capture the atmosphere, personality and details of every subject.',
    "Whether it's documenting the energy of a live concert, preserving the emotions of a special occasion, or creating striking portraits, I aim to deliver photographs that are visually engaging and meaningful. I enjoy exploring creativity through light, composition and perspective, bringing every frame together with my own visual approach.",
  ],
  quote: "Every moment has a story. I'm here to capture it.",
  practices: ['Portrait', 'Fashion', 'Wedding', 'Event', 'Concert', 'Product'],
}

export const instagram = {
  url: 'https://www.instagram.com/anirban.creats/',
  handle: '@anirban.Creates',
}

export const categories: PortfolioCategory[] = [
  {
    id: 'concerts',
    path: '/work/concerts',
    number: '01',
    title: 'Concerts',
    eyebrow: 'Live energy',
    summary: 'Sweat, spotlights and the hush before a chorus.',
    intro:
      'Music moves faster than the eye. Working with the light the stage gives me, I look for the moments between the notes — a held breath, a hand in the air, a crowd singing back.',
    cover: {
      ...concertPoster,
      alt: 'T.R.A.P performing under violet stage lights',
      kind: 'video',
      videoSrc: concertCoverVideo,
      poster: concertPoster.src,
    },
    items: concertImages,
  },
  {
    id: 'model-photoshoot',
    path: '/work/model-photoshoot',
    number: '02',
    title: 'Model Photoshoot',
    eyebrow: 'Portrait & fashion',
    summary: 'A portrait is a conversation, not a pose.',
    intro:
      'We find the light together, then wait for the expression that belongs to the person rather than the camera — the half-second where a portrait becomes someone you recognise.',
    cover: media(
      '../assets/COVER_PICTURES/modelpictures-cover/IMG_5332 (1).jpg',
      'Model seen through glass in soft, diffused light',
    ),
    items: modelImages,
  },
  {
    id: 'photographs',
    path: '/work/photographs',
    number: '03',
    title: 'Photographs',
    eyebrow: 'Everyday poetry',
    summary: 'The everyday, held still for a second.',
    intro:
      'Not commissioned, not staged. Frames collected while walking — morning haze on an open ground, a face in a crowd, a scene that asked quietly to be kept.',
    cover: media(
      '../assets/COVER_PICTURES/photograph-cover/IMG_0165.jpg',
      'A crowd with raised hands and flags in warm evening light',
    ),
    items: photographImages,
  },
  {
    id: 'wedding',
    path: '/work/wedding',
    number: '04',
    title: 'Wedding',
    eyebrow: 'Meaningful moments',
    summary: 'Vows, heirlooms and held breath.',
    intro:
      'Wedding days move in a blur of people and feeling. I look for the small, unposed truths inside it — a grandmother adjusting a veil, a stolen glance, the stillness just before the vows.',
    cover: media(
      '../assets/COVER_PICTURES/weeding-cover/weeding.jpg',
      'Bride seated in a white and red lehenga beside a river',
    ),
    items: weddingImages,
  },
  {
    id: 'product-shoot',
    path: '/work/product-shoot',
    number: '05',
    title: 'Product Shoot',
    eyebrow: 'Details in focus',
    summary: 'Objects distilled into light and shadow.',
    intro:
      'Shape, texture and shadow arranged with intent, until a bottle or a box stops being an object and becomes a story about the people who make it.',
    cover: media(
      '../assets/COVER_PICTURES/Product-cover/1779813968611.jpg',
      'Amber glass bottle in dramatic studio light',
    ),
    items: productImages,
  },
]

export const btsSection = {
  eyebrow: 'Behind the scenes',
  note: 'The unposed hours — setting the light, waiting for the moment, and the slow work that makes a photograph look effortless.',
  videos: [
    {
      src: btsAfterMovieVideo,
      poster: btsAfterMoviePoster,
      label: 'Behind the scenes — film 01',
      alt: 'Concert after-movie: a singer on stage under blue light, filmed from the crowd',
    },
    {
      src: btsStageVideo,
      poster: btsStagePoster,
      label: 'Behind the scenes — film 02',
      alt: 'Behind the scenes: a photographer framing a model in a blue gown',
    },
    {
      src: btsWorkingVideo,
      poster: btsWorkingPoster,
      label: 'Behind the scenes — film 03',
      alt: 'Behind the scenes: a videographer setting up beside a rack of camera bags',
    },
  ],
}

export const tickerWords = [
  'Portrait',
  'Fashion',
  'Wedding',
  'Event',
  'Concert',
  'Product',
  'Light',
  'Atmosphere',
]

export const artists = buildArtistGroups()

export const findCategory = (path: string) =>
  categories.find((category) => category.path === path)

export const formatCount = (value: number) => String(value).padStart(2, '0')

