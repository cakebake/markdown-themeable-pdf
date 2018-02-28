'use babel'

import { isEmpty } from 'lodash'

const convert = (filePath, exportFileType) => {
  return new Promise((resolve, reject) => {
    if (!isEmpty(filePath)) {
      resolve(filePath)
    } else {
      reject('File path to markdown file is empty')
    }

    // if (!filePath) {
    //   reject('Could not get file path')
    // } else {
    //   markdownToHtml(filePath, exportFileType)
    //     .then((html) => {
    //       if (exportFileType === 'html') {
    //         resolve(html)
    //       } else {
    //         return html
    //       }
    //     })
    //     .then((html) => {
    //       return htmlToCapture(html, exportFileType)
    //     })
    //     .then((capture) => {
    //       resolve(capture)
    //     })
    //     .catch((e) => {
    //       reject(e)
    //     })
    // }
  })
}

// const markdownToHtml = (filePath, exportFileType) => {
//   return new Promise((resolve, reject) => {
//     const html = `
//       lorem ipsum
//       dolor sit
//     `
//     resolve(html)
//   })
// }
//
// const htmlToCapture = (html, exportFileType) => {
//   return new Promise((resolve, reject) => {
//     const capture = 'capture content. buffer?'
//     resolve(capture)
//   })
// }

export default convert
