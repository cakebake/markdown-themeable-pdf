'use babel'

import _convert from './api/convert'
import { readFile, getFileDirectory, readFilesCombine, writeFile } from './api/filesystem'
import {
  getProjectRootPathByFilePath,
  getConfig,
  getHeaderFilePath,
  getFooterFilePath
} from './api/atom'
import { getCssFilePaths } from './theme'
import { CHARSET } from './config'

const convert = async (markdownPath, savePath, type, options) => {
  return new Promise(async (resolve, reject) => {
    try {
      const projectRootPath = getProjectRootPathByFilePath(markdownPath)
      const cssFilePaths = getCssFilePaths(
        getConfig('customStylesPath'),
        projectRootPath,
        type
      )
      const headerFilePath = (type === 'pdf') ? getHeaderFilePath(getConfig('customHeaderPath'), projectRootPath) : null
      const footerFilePath = (type === 'pdf') ? getFooterFilePath(getConfig('customFooterPath'), projectRootPath) : null
      const basePath = getFileDirectory(markdownPath)
      const markdown = await readFile(markdownPath, CHARSET)
      const css = await readFilesCombine(cssFilePaths, CHARSET)
      const headerTemplate = headerFilePath ? await readFile(headerFilePath, CHARSET) : null
      const footerTemplate = footerFilePath ? await readFile(footerFilePath, CHARSET) : null
      const headerBasePath = headerFilePath ? getFileDirectory(headerFilePath) : null
      const footerBasePath = footerFilePath ? getFileDirectory(footerFilePath) : null
      const data = await _convert(markdown, type, options, css, headerTemplate, footerTemplate, savePath, basePath, headerBasePath, footerBasePath, CHARSET)
      const convertedFilePath = await writeFile(data, savePath, CHARSET)
      resolve(convertedFilePath)
    } catch (e) {
      reject(e)
    }
  })
}

export default convert
