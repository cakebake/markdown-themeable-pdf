'use babel'

import { resolve } from 'path'
import { CHARSET } from '../config'
import { getBootswatchThemePathByName } from './bootswatch'
import { getHighlightJsStylePathByName } from './highlightJs'
import { getConfig, getCustomCssFilePath, getHeaderFilePath, getFooterFilePath } from '../api/atom'
import { readFile, readFilesCombine, getFileDirectory } from '../api/filesystem'

export const getBody = (file) => {
  return new Promise(async (resolve, reject) => {
    try {
      const basePath = getFileDirectory(file)
      const template = await readFile(file, CHARSET)
      resolve({ file, basePath, template })
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
      resolve({ file, basePath, template })
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
      resolve({ file, basePath, template })
    } catch (e) {
      reject(e)
    }
  })
}

export const getBodyCss = async (projectRootPath, type) => {
  const files = getBodyCssFiles(
    getConfig('customStylesPath'),
    projectRootPath,
    type
  )
  return readFilesCombine(files, CHARSET)
}

const getBodyCssFiles = (customPath, projectRootPath, type) => {
  const files = []
  // files.push(resolve(__dirname, '../../node_modules/bootstrap/dist/css/bootstrap.min.css'))
  if (getConfig('enableCodeHighlighting')) {
    files.push(getHighlightJsStylePathByName(getConfig('codeHighlightingTheme')))
  }
  files.push(getBootswatchThemePathByName(getConfig('theme')))
  files.push(resolve(__dirname, './css/all.css'))
  if (type === 'pdf') {
    files.push(resolve(__dirname, './css/pdf.css'))
  }
  if (type === 'jpeg' || type === 'png') {
    files.push(resolve(__dirname, './css/capture.css'))
  }
  const customCssFile = getCustomCssFilePath(customPath, projectRootPath)
  if (customCssFile) {
    files.push(customCssFile)
  }
  return files
}
