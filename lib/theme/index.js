'use babel'

import { resolve } from 'path'
import { getBootswatchThemePathByName } from './bootswatch'
import { getHighlightJsStylePathByName } from './highlightJs'
import { getConfig, getCustomCssFilePath } from '../api/atom'

export const getCssFilePaths = (customPath, projectRootPath, type) => {
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
