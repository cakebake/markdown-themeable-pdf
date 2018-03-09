'use babel'

import { create } from 'html-pdf'

const process = (html, options) => {
  return new Promise((resolve, reject) => {
    create(html, options)
      .toBuffer((e, buffer) => {
        if (e) {
          reject(e)
        } else {
          resolve(buffer)
        }
      })
  })
}

export default process
