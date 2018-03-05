'use babel'

import { readdirSync, readFile as _readFile, writeFile as _writeFile } from 'fs'
import { resolve as resolvePath, join, extname, parse as parseFile } from 'path'
import { parse } from 'url'
import { ncp } from 'ncp'
import { get } from 'lodash'
import charsetDetector from 'charset-detector'
import { convert as convertEncoding } from 'encoding'
import { getUserAtomPath, getProjectRootPathByFilePath } from './atom'

export const getFileDirectory = (filePath) => get(parseFile(filePath), 'dir')

export const getFileName = (filePath) => get(parseFile(filePath), 'name')

export const resolveImgSrc = (imgSrc, fileDirectory) => {
  if (parse(imgSrc).protocol || resolvePath(imgSrc) === imgSrc) {
    return imgSrc
  }
  return ('file:///' + resolvePath(fileDirectory, imgSrc)).replace(/\\/g, '/')
}

export const writeFile = (content, directory, fileName, fileExtension, charset) => {
  return new Promise((resolve, reject) => {
    const destination = join(directory, `${fileName}.${fileExtension}`)
    _writeFile(destination, content, charset, (e) => {
      if (e) {
        reject(e)
      } else {
        resolve(destination)
      }
    })
  })
}

export const readFilesCombine = (paths, charset) => {
  return new Promise((resolve, reject) => {
    resolve('html, body { color: cyan }')
  })
}

export const readFile = (path, charset) => {
  return new Promise((resolve, reject) => {
    _readFile(path, (e, buffer) => {
      if (e) {
        reject(e)
      } else {
        try {
          const fileCharset = get(charsetDetector(buffer), '0.charsetName')
          const content = convertEncoding(buffer, charset, fileCharset).toString()
          resolve(content)
        } catch (e) {
          reject(e)
        }
      }
    })
  })
}

// @todo check configDirPath for problems in spec
export const copyCustomTemplateFiles = (cb, dest = null) => {
  dest = dest || resolvePath(atom.config.configDirPath, 'markdown-themeable-pdf')
  const src = resolvePath(__dirname, '../../markdown-themeable-pdf')
  ncp(src, dest, { clobber: false }, (e) => {
    let msg = null
    if (e) {
      msg = `Custom template coul not created at ${dest}. Please copy the files manualy from ${src}`
      console.error(msg, e)
    }
    cb(msg)
  })
}

// @todo make async
export const getHighlightJsStyles = () => {
  const _files = readdirSync(resolvePath(__dirname, '../../node_modules/highlight.js/styles'))
  let files = []
  for (let i = 0; i < _files.length; i++) {
    if (extname(_files[i]) === '.css') {
      files.push(_files[i])
    }
  }
  return files
}
