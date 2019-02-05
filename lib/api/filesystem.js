'use babel'

import { access, readFile as _readFile, writeFile as _writeFile, copy } from 'fs-extra'
import { resolve as resolvePath, join, extname, dirname, basename } from 'path'
import { get } from 'lodash'
import charsetDetector from 'charset-detector'
import { convert as convertEncoding } from 'encoding'
import { postCssProcessor } from './convert/manipulation'
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
    _readFile(path, async (e, buffer) => {
      if (e) {
        reject(e)
      } else {
        try {
          const fileCharset = get(charsetDetector(buffer), '0.charsetName')
          let content = convertEncoding(buffer, charset, fileCharset).toString()
          if (getFileExt(path) === '.css') {
            content = await postCssProcessor(content, getFileDirectory(path))
          }
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
