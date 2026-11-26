#!/usr/bin/env node
/**
 * Generates web-ready derivatives of every photograph in src/assets.
 *
 *   src/assets/_optimized/<same path>.webp       long edge 1800px  (hero, covers, lightbox)
 *   src/assets/_optimized-small/<same path>.webp long edge 860px   (grids, thumbnails)
 *
 * Originals are never modified. The portfolio data module automatically uses a
 * derivative when one exists and falls back to the original otherwise, so the
 * site keeps working when new photographs are dropped in. Re-run this script
 * (npm run media) to optimise new files. Requires ImageMagick (`convert`).
 */
import { execFile } from 'node:child_process'
import { mkdir, readdir, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourceRoot = path.join(root, 'src/assets')
const variants = [
  { dir: '_optimized', longEdge: 1800, quality: 78 },
  { dir: '_optimized-small', longEdge: 860, quality: 72 },
]
const skipDirs = new Set(['_optimized', '_optimized-small'])
const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp'])

const walk = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (skipDirs.has(entry.name)) continue
      files.push(...(await walk(full)))
    } else if (imageExtensions.has(path.extname(entry.name).toLowerCase())) {
      files.push(full)
    }
  }
  return files
}

const convert = (args) =>
  new Promise((resolve, reject) => {
    execFile('convert', args, { maxBuffer: 1024 * 1024 * 4 }, (error) => {
      if (error) reject(error)
      else resolve()
    })
  })

const run = async () => {
  const files = await walk(sourceRoot)
  console.log(`Optimising ${files.length} images…`)

  let done = 0
  const queue = [...files]

  const worker = async () => {
    while (queue.length) {
      const file = queue.shift()
      if (!file) break
      const relative = path.relative(sourceRoot, file)
      const base = relative.replace(/\.[^.]+$/, '.webp')

      for (const variant of variants) {
        const output = path.join(sourceRoot, variant.dir, base)
        if (
          existsSync(output) &&
          (await stat(output)).mtimeMs > (await stat(file)).mtimeMs
        ) {
          continue
        }
        await mkdir(path.dirname(output), { recursive: true })
        await convert([
          file,
          '-auto-orient',
          '-strip',
          '-colorspace',
          'sRGB',
          '-resize',
          `${variant.longEdge}x${variant.longEdge}>`,
          '-quality',
          String(variant.quality),
          '-define',
          'webp:method=5',
          output,
        ])
      }

      done += 1
      if (done % 10 === 0) console.log(`  ${done}/${files.length}`)
    }
  }

  await Promise.all(Array.from({ length: 4 }, worker))
  console.log('Done.')
}

run().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
