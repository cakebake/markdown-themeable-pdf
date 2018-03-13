'use babel'

import { isEmpty, get } from 'lodash'
import markdownToHTML from './convert/markdownToHTML'
import phantomJS from './convert/phantomJS'
import { pdf } from './convert/headlessChrome'
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
        switch (exportFileType) {
          case 'pdf':
            data = await pdf(htmlTemplate, {
              format: 'A4',
              displayHeaderFooter: true,
              headerTemplate: '<div style="font-size: 12px;">Header: <span class="date"></span> Page <span class="pageNumber"></span>/<span class="totalPages"></span></div>',
              footerTemplate: '<div style="font-size: 12px;">Footer: <span class="date"></span> Page <span class="pageNumber"></span>/<span class="totalPages"></span></div>',
              printBackground: true,
              margin: {
                top: 100,
                right: 100,
                bottom: 100,
                left: 100
              }
            })
            break
          case 'jpeg':
            data = await phantomJS(
              htmlTemplate,
              {
                ...get(options, 'phantomJS'),
                type: exportFileType
              }
            )
            break
          case 'png':
            data = await phantomJS(
              htmlTemplate,
              {
                ...get(options, 'phantomJS'),
                type: exportFileType
              }
            )
            break
          default:
            data = htmlTemplate
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
