'use babel'

import { readdirSync, readFile } from 'fs'
import { resolve, extname } from 'path'
import { ncp } from 'ncp'
import { startCase, kebabCase, replace } from 'lodash'
import { detectFile } from 'chardet'

export const readFileContent = (path, encoding) => {
  return new Promise((resolve, reject) => {
    readFile(path, encoding, (e, content) => {
      if (e) {
        reject(e)
      } else {
        resolve(content)
      }
    })
  })
}

export const detectFileEncoding = (path, fallback = 'utf8') => {
  return new Promise((resolve) => {
    detectFile(path, (e, encoding) => {
      resolve(e ? fallback : encoding)
    })
  })
}

export const copyCustomTemplateFiles = (cb) => {
  const dest = resolve(atom.config.configDirPath, 'markdown-themeable-pdf')
  const src = resolve(__dirname, '../../markdown-themeable-pdf')
  ncp(src, dest, { clobber: false }, (e) => {
    if (e) {
      const msg = `Custom template coul not created at ${dest}. Please copy the files manualy from ${src}`
      cb(msg)
      console.error(msg, e)
    }
  })
}

export const getHighlightJsStyles = (readable = false) => {
  const _files = readdirSync(resolve(__dirname, '../../node_modules/highlight.js/styles'))
  let files = []
  for (let i = 0; i < _files.length; i++) {
    if (extname(_files[i]) === '.css') {
      if (readable) {
        files.push(convertCssFilename(_files[i]))
      } else {
        files.push(_files[i])
      }
    }
  }
  return files
}

const convertCssFilename = (name, readable = true) => {
  if (readable) {
    return startCase(replace(name, '.css', ''))
  }
  return `${kebabCase(name)}.css`
}
