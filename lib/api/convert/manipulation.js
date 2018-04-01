'use babel'

import { base64 } from 'base64-img'
import { parse } from 'url'
import { resolve } from 'path'

export const base64Src = (src, baseDir) => {
  return new Promise((resolve) => {
    if (!parse(src).protocol) {
      const resolvedPath = resolveSrc(src, baseDir)
      try {
        base64(resolvedPath, (e, data) => {
          if (e) {
            resolve(resolvedPath)
          } else {
            resolve(data)
          }
        })
      } catch (e) {
        resolve(resolvedPath)
      }
    } else {
      resolve(src)
    }
  })
}

export const resolveSrc = (src, baseDir) => {
  if (parse(src).protocol) {
    return src
  }
  return resolve(src) === src || !baseDir ? src : resolve(baseDir, src)
}
