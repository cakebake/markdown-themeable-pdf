'use babel'

import { isEmpty, get } from 'lodash'
import markdownToHTML from './convert/markdownToHTML'
import phantomJS from './convert/phantomJS'
import electronPrint from './convert/electronPrint'
import template from './template'
import { CHARSET } from '../config'
import {
  readFile,
  readFilesCombine,
  writeFile,
  getFileDirectory,
  getFileName
} from './filesystem'

const convert = (filePath, exportFileType, options, cssFilePaths, savePath) => {
  return new Promise(async (resolve, reject) => {
    if (!isEmpty(filePath)) {
      try {
        let data
        const htmlIsFinalFormat = (exportFileType === 'html')
        const markdown = await readFile(filePath, CHARSET)
        const html = await markdownToHTML(
          markdown,
          htmlIsFinalFormat,
          get(options, 'markdownIt'),
          getFileDirectory(filePath)
        )
        const css = await readFilesCombine(cssFilePaths, CHARSET)
        const htmlTemplate = await template(
          html,
          getFileName(filePath),
          htmlIsFinalFormat,
          CHARSET,
          css
        )
        if (htmlIsFinalFormat) {
          data = htmlTemplate
        } else {
          if (exportFileType === 'pdf') {
            data = await electronPrint(htmlTemplate, {})
          } else {
            // merge
            // - header
            // - footer
            data = await phantomJS(
              htmlTemplate,
              {
                ...get(options, 'phantomJS'),
                type: exportFileType
              }
            )
          }
        }
        const exportFilePath = await writeFile(data, savePath, CHARSET)
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
