'use babel'

import { isEmpty, get } from 'lodash'
import markdownToHTML from './convert/markdownToHTML'
import { pdf, capture } from './convert/headlessChrome'
import { document, header, footer } from './template'
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
        const markdown = await readFile(filePath, CHARSET)
        const html = await markdownToHTML(
          markdown,
          exportFileType === 'html',
          get(options, 'markdownIt'),
          getFileDirectory(filePath)
        )
        const css = await readFilesCombine(cssFilePaths, CHARSET)
        const htmlTemplate = await document(
          html,
          getFileName(filePath),
          CHARSET,
          css
        )
        switch (exportFileType) {
          case 'pdf':
            data = await pdf(
              htmlTemplate,
              {
                ...get(options, 'puppeteer.pdf'),
                headerTemplate: header(),
                footerTemplate: footer()
              }
            )
            break
          case 'jpeg':
            data = await capture(
              htmlTemplate,
              {
                ...get(options, 'puppeteer.jpeg'),
                type: exportFileType
              }
            )
            break
          case 'png':
            data = await capture(
              htmlTemplate,
              {
                ...get(options, 'puppeteer.png'),
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
