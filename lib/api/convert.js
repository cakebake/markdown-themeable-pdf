'use babel'

import { isEmpty, get } from 'lodash'
import markdownToHTML from './convert/markdownToHTML'
import phantomJS from './convert/phantomJS'
import template from './template'
import { CHARSET } from '../config'
import {
  readFile,
  readFilesCombine,
  writeFile,
  getFileDirectory,
  getFileName
} from './filesystem'

const convert = (filePath, exportFileType, options, cssFilePaths) => {
  return new Promise(async (resolve, reject) => {
    if (!isEmpty(filePath)) {
      if (exportFileType === 'img') {
        exportFileType = get(options, 'imageExportFileType')
      }
      try {
        let data
        const htmlIsFinalFormat = (exportFileType === 'html')
        const directory = getFileDirectory(filePath)
        const fileName = getFileName(filePath)
        const markdown = await readFile(filePath, CHARSET)
        const html = await markdownToHTML(
          markdown,
          htmlIsFinalFormat,
          get(options, 'markdownIt'),
          directory
        )
        const css = await readFilesCombine(cssFilePaths, CHARSET)
        const htmlTemplate = await template(
          html,
          fileName,
          htmlIsFinalFormat,
          CHARSET,
          css
        )
        if (htmlIsFinalFormat) {
          data = htmlTemplate
        } else {
          data = await phantomJS(htmlTemplate, { type: exportFileType })
        }
        const exportFilePath = await writeFile(
          data,
          directory,
          fileName,
          exportFileType,
          CHARSET
        )
        resolve(exportFilePath)
      } catch (e) {
        reject(e)
      }
    } else {
      reject('File path to markdown file is unknown')
    }
  })
}

export default convert
