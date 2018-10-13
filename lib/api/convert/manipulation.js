'use babel'

import { base64, requestBase64 } from 'base64-img'
import { parse } from 'url'
import { resolve } from 'path'
import slash from 'slash'
import { isEmpty } from 'lodash'

export const base64Src = (src, baseDir) => {
  return new Promise((resolve) => {
    if (!isExternalSrc(src)) {
      const resolvedPath = resolveSrc(src, baseDir)
      base64(resolvedPath, (e, data) => {
        if (e) {
          resolve(resolvedPath)
        } else {
          resolve(data)
        }
      })
    } else {
      requestBase64(src, (e, res, data) => {
        if (e) {
          resolve(src)
        } else {
          resolve(data)
        }
      })
    }
  })
}

export const resolveSrc = (src, baseDir) => {
  if (!isExternalSrc(src)) {
    src = resolve(src) === src || !baseDir ? src : resolve(baseDir, src)
  }
  return slash(src)
}

const isExternalSrc = (src) => {
  return !isEmpty(parse(src).hostname)
}
