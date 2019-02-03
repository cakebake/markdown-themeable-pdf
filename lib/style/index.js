'use babel'

import { resolve } from 'path'
import { CHARSET } from '../config'
import { getHighlightJsStylePathByName } from './highlightJs'
import {
  getCustomCssFilePath,
  getHeaderFilePath,
  getFooterFilePath,
  removeOptionsFromContent
} from '../api/atom/customOptions'
import { readFile, readFilesCombine, getFileDirectory } from '../api/filesystem'
import { get } from 'lodash'

export const getBody = (file, markdownPath, type, options) => {
  return new Promise(async (resolve, reject) => {
    try {
      const basePath = getFileDirectory(file)
      const template = await removeOptionsFromContent(await readFile(file, CHARSET))
      const css = await getBodyCss(markdownPath, type, options)
      resolve({ file, basePath, template, css })
    } catch (e) {
      reject(e)
    }
  })
}

export const getHeader = (markdownPath, options) => {
  return new Promise(async (resolve, reject) => {
    try {
      const file = getHeaderFilePath(get(options, 'theme.customHeaderPath'), markdownPath)
      const basePath = getFileDirectory(file)
      const template = await readFile(file, CHARSET)
      const css = await getHeaderFooterCss(options)
      resolve({ file, basePath, template, css })
    } catch (e) {
      reject(e)
    }
  })
}

export const getFooter = (markdownPath, options) => {
  return new Promise(async (resolve, reject) => {
    try {
      const file = getFooterFilePath(get(options, 'theme.customFooterPath'), markdownPath)
      const basePath = getFileDirectory(file)
      const template = await readFile(file, CHARSET)
      const css = '/* not needed */'
      resolve({ file, basePath, template, css })
    } catch (e) {
      reject(e)
    }
  })
}

export const getHeaderFooterCss = (options) => {
  const files = []
  if (get(options, 'theme.enableDefaultStyles')) {
    files.push(resolve(__dirname, './css/public/default.css'))
  }
  files.push(resolve(__dirname, './css/private/pdfHeaderFooter.css'))
  return readFilesCombine(files, CHARSET)
}

export const getBodyCss = (markdownPath, type, options) => {
  const files = []
  if (get(options, 'html.enableCodeHighlighting')) {
    files.push(getHighlightJsStylePathByName(get(options, 'theme.codeHighlightingTheme')))
  }
  if (get(options, 'theme.enableDefaultStyles')) {
    files.push(resolve(__dirname, './css/public/default.css'))
  }
  files.push(resolve(__dirname, './css/private/all.css'))
  if (type === 'pdf') {
    files.push(resolve(__dirname, './css/private/pdf.css'))
  }
  if (type === 'jpeg' || type === 'png') {
    files.push(resolve(__dirname, './css/private/capture.css'))
  }
  const customCssFile = getCustomCssFilePath(get(options, 'theme.customStylesPath'), markdownPath)
  if (customCssFile) {
    files.push(customCssFile)
  }
  return readFilesCombine(files, CHARSET)
}
