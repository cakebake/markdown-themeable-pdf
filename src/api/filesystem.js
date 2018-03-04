'use babel'

import { readdirSync, readFile as _readFile } from 'fs'
import { resolve, extname, parse as parseFile } from 'path'
import { parse } from 'url'
import { ncp } from 'ncp'
import { get } from 'lodash'
import charsetDetector from 'charset-detector'
import { convert as convertEncoding } from 'encoding'

export const getFileDirectory = (filePath) => get(parseFile(filePath), 'dir')

export const resolveImgSrc = (imgSrc, fileDirectory) => {
  if (parse(imgSrc).protocol || resolve(imgSrc) === imgSrc) {
    return imgSrc
  }
  return ('file:///' + resolve(fileDirectory, imgSrc)).replace(/\\/g, '/')
}

export const readFile = (path) => {
  return new Promise((resolve, reject) => {
    _readFile(path, (e, buffer) => {
      if (e) {
        reject(e)
      } else {
        try {
          const fileCharset = get(charsetDetector(buffer), '0.charsetName')
          const content = convertEncoding(buffer, 'UTF-8', fileCharset).toString()
          resolve(content)
        } catch (e) {
          reject(e)
        }
      }
    })
  })
}

export const copyCustomTemplateFiles = (cb, dest = null) => {
  dest = dest || resolve(atom.config.configDirPath, 'markdown-themeable-pdf')
  const src = resolve(__dirname, '../../markdown-themeable-pdf')
  ncp(src, dest, { clobber: false }, (e) => {
    let msg = null
    if (e) {
      msg = `Custom template coul not created at ${dest}. Please copy the files manualy from ${src}`
      console.error(msg, e)
    }
    cb(msg)
  })
}

export const getHighlightJsStyles = () => {
  const _files = readdirSync(resolve(__dirname, '../../node_modules/highlight.js/styles'))
  let files = []
  for (let i = 0; i < _files.length; i++) {
    if (extname(_files[i]) === '.css') {
      files.push(_files[i])
    }
  }
  return files
}
