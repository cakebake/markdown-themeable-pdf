'use babel'

import { isEmpty } from 'lodash'
import markdownToHTML from './convert/markdownToHTML'
import { detectFileEncoding, readFileContent } from './filesystem'

const convert = (filePath, exportFileType, fileInfo, encoding) => {
  return new Promise(async (resolve, reject) => {
    if (!isEmpty(filePath)) {
      encoding = await detectFileEncoding(filePath, encoding)
      try {
        const markdown = await readFileContent(filePath, encoding)
        switch (exportFileType) {
          case 'html':
            try {
              const exportFile = await markdownToHTML(markdown, true)
              resolve(exportFile)
            } catch (e) {
              reject(e)
            }
            break
          case 'pdf':
            try {
              const html = await markdownToHTML(markdown)
              console.log(html)
              resolve(filePath)
            } catch (e) {
              reject(e)
            }
            break
          case 'jpeg':
            try {
              const html = await markdownToHTML(markdown)
              console.log(html)
              resolve(filePath)
            } catch (e) {
              reject(e)
            }
            break
          case 'png':
            try {
              const html = await markdownToHTML(markdown)
              console.log(html)
              resolve(filePath)
            } catch (e) {
              reject(e)
            }
            break
          default:
            reject(`Export file type "${exportFileType}" is not supported`)
        }
      } catch (e) {
        console.error(e);
        reject(e)
      }
    } else {
      reject('File path to markdown file is unknown')
    }
  })
}

export default convert
