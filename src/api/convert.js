'use babel'

import { isEmpty } from 'lodash'
import markdownToHTML from './convert/markdownToHTML'

const convert = (filePath, exportFileType) => {
  return new Promise(async (resolve, reject) => {
    if (!isEmpty(filePath)) {
      switch (exportFileType) {
        case 'html':
          try {
            const exportFile = await markdownToHTML(filePath, true)
            resolve(exportFile)
          } catch (e) {
            reject(e)
          }
          break
        case 'pdf':
          try {
            const html = await markdownToHTML(filePath)
            console.log(html)
            resolve(filePath)
          } catch (e) {
            reject(e)
          }
          break
        case 'jpeg':
          try {
            const html = await markdownToHTML(filePath)
            console.log(html)
            resolve(filePath)
          } catch (e) {
            reject(e)
          }
          break
        case 'png':
          try {
            const html = await markdownToHTML(filePath)
            console.log(html)
            resolve(filePath)
          } catch (e) {
            reject(e)
          }
          break
        default:
          reject(`Export file type "${exportFileType}" is not supported`)
      }
    } else {
      reject('File path to markdown file is unknown')
    }
  })
}

export default convert
