'use babel'

import { base64, requestBase64 } from 'base64-img'
import replace from 'string-replace-async'
import { parse } from 'url' // eslint-disable-line node/no-deprecated-api
import { resolve } from 'path'
import { isEmpty } from 'lodash'

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

export const base64UrlInCss = (css, baseDir) => {
  return new Promise(async (resolve) => {
    try {
      const urls = [
        /(@import\s+)(')(.+?)(')/gi,
        /(@import\s+)(")(.+?)(")/gi,
        /(url\s*\()(\s*')([^']+?)(')/gi,
        /(url\s*\()(\s*")([^"]+?)(")/gi,
        /(url\s*\()(\s*)([^\s'")].*?)(\s*\))/gi
      ]
      const replacer = (_all, lead, quoteStart, path, quoteEnd) => {
        return new Promise(async (resolve) => {
          path = await base64Src(path, baseDir)
          resolve(lead + quoteStart + path + quoteEnd)
        })
      }
      for (let url of urls) {
        css = await replace(css, url, replacer)
      }
    } catch (_e) {}
    resolve(css)
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
