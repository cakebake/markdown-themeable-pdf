'use babel'

import { base64, requestBase64 } from 'base64-img'
import { parse } from 'url' // eslint-disable-line node/no-deprecated-api
import { resolve } from 'path'
import { isEmpty, get } from 'lodash'
import postcss from 'postcss'
import postcssUrl from 'postcss-url'

export const base64Src = (src, baseDir) => {
  return new Promise((resolve) => {
    src = decodeURI(src)
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

export const postCssProcessor = (css, filePath) => {
  return new Promise(async (resolve) => {
    try {
      const processed = await postcss()
        .use(postcssUrl({ url: 'inline', encodeType: 'base64', optimizeSvgEncode: true }))
        .process(css, { from: filePath })
      resolve(get(processed, 'css', css))
    } catch (e) {
      console.error(e)
      resolve(css)
    }
  })
}

export const resolveSrc = (src, baseDir) => {
  src = decodeURI(src)
  if (!isExternalSrc(src)) {
    src = resolve(src) === src || !baseDir ? src : resolve(baseDir, src)
  }
  return slash(src)
}

const isExternalSrc = (src) => {
  return !isEmpty(parse(src).hostname)
}

const slash = (input) => {
  const isExtendedLengthPath = /^\\\\\?\\/.test(input)
  const hasNonAscii = /[^\u0000-\u0080]+/.test(input) // eslint-disable-line no-control-regex
  if (isExtendedLengthPath || hasNonAscii) {
    return input
  }
  return input.replace(/\\/g, '/')
}
