'use babel'

import { stat, readdirSync, readFile as _readFile, writeFile as _writeFile } from 'fs'
import { resolve as resolvePath, join, extname, dirname, basename } from 'path'
import { parse } from 'url'
import { ncp } from 'ncp'
import { get, isEmpty } from 'lodash'
import charsetDetector from 'charset-detector'
import { convert as convertEncoding } from 'encoding'
import { PACKAGE_NAME } from '../config'

export const getFileDirectory = (filePath) => dirname(filePath)

export const getFileName = (filePath, withExt = false) => withExt ? basename(filePath) : basename(filePath, getFileExt(filePath))

export const getFileExt = (filePath) => extname(filePath)

export const resolveImgSrc = (imgSrc, fileDirectory) => {
  if (parse(imgSrc).protocol || resolvePath(imgSrc) === imgSrc) {
    return imgSrc
  }
  return ('file://' + resolvePath(fileDirectory, imgSrc)).replace(/\\/g, '/')
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

export const readFilesCombine = (paths, charset, lineBreakAfterFile = true) => {
  return new Promise(async (resolve, reject) => {
    let content = ''
    let errors = []
    for (path of paths) {
      try {
        content += await readFile(path, charset)
        if (lineBreakAfterFile) {
          content += '\n'
        }
      } catch (e) {
        errors.push(e)
      }
    }
    content = content.trim()
    if (!isEmpty(errors)) {
      console.error(errors)
    }
    if (isEmpty(content)) {
      reject(errors)
    } else {
      resolve(content)
    }
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

export const copyCustomTemplateFiles = (dest) => {
  return new Promise((resolve, reject) => {
    stat(dest, (statError, stats) => {
      if (statError) {
        const src = resolvePath(__dirname, `../../${PACKAGE_NAME}`)
        ncp(src, dest, { clobber: false }, (e) => {
          if (e) {
            reject(`Custom template coul not created at ${dest}. Please copy the files manualy from ${src}`)
            console.error(e)
          } else {
            resolve(dest)
          }
        })
      } else {
        resolve()
      }
    })
  })
}

export const getHighlightJsStyles = () => {
  const _files = readdirSync(resolvePath(__dirname, '../../node_modules/highlight.js/styles'))
  let files = []
  for (let i = 0; i < _files.length; i++) {
    if (getFileExt(_files[i]) === '.css') {
      files.push(_files[i])
    }
  }
  return files
}

export const getHighlightJsStylePathByName = (fileName) => {
  return resolvePath(__dirname, '../../node_modules/highlight.js/styles', fileName)
}
