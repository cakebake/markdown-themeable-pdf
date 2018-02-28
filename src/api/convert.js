'use babel'

import { isEmpty } from 'lodash'
import markdownToHTML from './convert/markdownToHTML'
import { detectFileEncoding, readFileContent } from './filesystem'

const convert = (filePath, exportFileType, encoding) => {
  return new Promise(async (resolve, reject) => {
    if (!isEmpty(filePath)) {
      encoding = await detectFileEncoding(filePath, encoding)
      try {
        const htmlIsFinalFormat = (exportFileType === 'html')
        const markdown = await readFileContent(filePath, encoding)
        const html = await markdownToHTML(markdown, htmlIsFinalFormat)
        if (htmlIsFinalFormat) {
          resolve(html)
        } else {
          resolve(html)
        }
      } catch (e) {
        reject(e)
      }
    } else {
      reject('File path to markdown file is unknown')
    }
  })
}

export default convert
