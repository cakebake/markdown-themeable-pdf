'use babel'

import { resolve } from 'path'
import { CHARSET } from '../config'
import { getHighlightJsStylePathByName } from './highlightJs'
import { getConfig } from '../api/atom'
import { getCustomCssFilePath, getHeaderFilePath, getFooterFilePath } from '../api/atom/customOptions'
import { readFile, readFilesCombine, getFileDirectory } from '../api/filesystem'

export const getBody = (file, projectRootPath, type) => {
  return new Promise(async (resolve, reject) => {
    try {
      const basePath = getFileDirectory(file)
      const template = await readFile(file, CHARSET)
      const css = await getBodyCss(projectRootPath, type)
      resolve({ file, basePath, template, css })
    } catch (e) {
      reject(e)
    }
  })
}

export const getHeader = (projectRootPath) => {
  return new Promise(async (resolve, reject) => {
    try {
      const file = getHeaderFilePath(getConfig('customHeaderPath'), projectRootPath)
      const basePath = getFileDirectory(file)
      const template = await readFile(file, CHARSET)
      const css = await getHeaderFooterCss()
      resolve({ file, basePath, template, css })
    } catch (e) {
      reject(e)
    }
  })
}

export const getFooter = (projectRootPath) => {
  return new Promise(async (resolve, reject) => {
    try {
      const file = getFooterFilePath(getConfig('customFooterPath'), projectRootPath)
      const basePath = getFileDirectory(file)
      const template = await readFile(file, CHARSET)
      const css = '/* not needed */'
      resolve({ file, basePath, template, css })
    } catch (e) {
      reject(e)
    }
  })
}

export const getHeaderFooterCss = () => {
  const files = []
  if (getConfig('enableDefaultStyles')) {
    files.push(resolve(__dirname, './css/public/default.css'))
  }
  files.push(resolve(__dirname, './css/private/pdfHeaderFooter.css'))
  return readFilesCombine(files, CHARSET)
}

export const getBodyCss = (projectRootPath, type) => {
  const files = []
  if (getConfig('enableCodeHighlighting')) {
    files.push(getHighlightJsStylePathByName(getConfig('codeHighlightingTheme')))
  }
  if (getConfig('enableDefaultStyles')) {
    files.push(resolve(__dirname, './css/public/default.css'))
  }
  files.push(resolve(__dirname, './css/private/all.css'))
  if (type === 'pdf') {
    files.push(resolve(__dirname, './css/private/pdf.css'))
  }
  if (type === 'jpeg' || type === 'png') {
    files.push(resolve(__dirname, './css/private/capture.css'))
  }
  const customCssFile = getCustomCssFilePath(getConfig('customStylesPath'), projectRootPath)
  if (customCssFile) {
    files.push(customCssFile)
  }
  return readFilesCombine(files, CHARSET)
}
