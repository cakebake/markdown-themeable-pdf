'use babel'

import { isEmpty, get } from 'lodash'
import markdownToHTML from './convert/markdownToHTML'
import { pdf, capture } from './convert/headlessChrome'
import { document, header, footer } from './convert/template'
import { CHARSET } from '../config'
import {
  readFile,
  readFilesCombine,
  writeFile,
  getFileDirectory,
  getFileName
} from './filesystem'

const convert = (filePath, type, options, cssFilePaths, savePath) => {
  return new Promise(async (resolve, reject) => {
    if (!isEmpty(filePath)) {
      try {
        let data
        const md = await readFile(filePath, CHARSET)
        const html = await markdownToHTML(md, type === 'html', get(options, 'html'), getFileDirectory(filePath))
        const css = await readFilesCombine(cssFilePaths, CHARSET)
        const doc = await document(html, getFileName(filePath), CHARSET, css)
        switch (type) {
          case 'pdf':
            const margin = get(options, 'pdf.margin')
            data = await pdf(doc, {
              ...get(options, 'pdf'),
              headerTemplate: header(get(options, 'pdf.headerTemplate'), css, margin),
              footerTemplate: footer(get(options, 'pdf.footerTemplate'), css, margin)
            })
            break
          case 'jpeg':
            data = await capture(doc, {
              ...get(options, 'jpeg'),
              type: 'jpeg'
            })
            break
          case 'png':
            data = await capture(doc, {
              ...get(options, 'png'),
              type: 'png'
            })
            break
          default:
            data = doc
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
