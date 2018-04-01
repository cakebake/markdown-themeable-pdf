'use babel'

import { base64Sync } from 'base64-img'
import { parse } from 'url'
import { resolve } from 'path'
import { existsSync } from 'fs'

export const base64Src = (src, baseDir) => {
  if (parse(src).protocol) {
    return src
  }
  const resolvedPath = resolve(src) === src || !baseDir ? src : resolve(baseDir, src)
  return existsSync(resolvedPath) ? base64Sync(resolvedPath) : src
}
