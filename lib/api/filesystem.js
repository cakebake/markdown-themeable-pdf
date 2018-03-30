'use babel'

import { access, readdirSync, readFile as _readFile, writeFile as _writeFile, existsSync, copy } from 'fs-extra'
import { resolve as resolvePath, join, extname, dirname, basename } from 'path'
import { parse } from 'url'
import { get } from 'lodash'
import charsetDetector from 'charset-detector'
import { convert as convertEncoding } from 'encoding'
import { base64Sync } from 'base64-img'
import { PACKAGE_NAME } from '../config'

export const getDefaultExportFilePath = (srcFilePath, exportFileExtension) => {
  return join(getFileDirectory(srcFilePath), `${getFileName(srcFilePath)}.${exportFileExtension}`)
}

export const pathExists = (path) => {
  return new Promise((resolve) => {
    try {
      access(path, (e) => {
        if (e) {
          resolve(false)
        } else {
          resolve(true)
        }
      })
    } catch (e) {
      resolve(false)
    }
  })
}

export const getFileDirectory = (filePath) => dirname(filePath)

export const getFileName = (filePath, withExt = false) => withExt ? basename(filePath) : basename(filePath, getFileExt(filePath))

export const getFileExt = (filePath) => extname(filePath)

export const base64Src = (src, baseDir) => {
  if (parse(src).protocol) {
    return src
  }
  const resolvedPath = resolvePath(src) === src || !baseDir ? src : resolvePath(baseDir, src)
  return existsSync(resolvedPath) ? base64Sync(resolvedPath) : src
}

export const writeFile = (data, destination, charset) => {
  return new Promise((resolve, reject) => {
    _writeFile(destination, data, charset, (e) => {
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
    let error
    for (let path of paths) {
      try {
        content += await readFile(path, charset)
        if (lineBreakAfterFile) {
          content += '\n'
        }
      } catch (e) {
        error = e
        break
      }
    }
    if (error) {
      reject(error)
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

export const copyCustomTemplateFiles = async (dest) => {
  return new Promise(async (resolve, reject) => {
    const src = resolvePath(__dirname, `../../${PACKAGE_NAME}`)
    try {
      await copy(src, dest, {
        overwrite: false,
        errorOnExist: false
      })
      resolve(dest)
    } catch (_) {
      reject(Error(`Custom template coul not created at ${dest}. Please copy the files manualy from ${src}`))
    }
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
