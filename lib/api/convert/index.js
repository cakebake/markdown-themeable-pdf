'use babel'

import { get } from 'lodash'
import markdownToHTML from './markdownToHTML'
import { pdf, capture } from './headlessChrome'
import { body, header, footer } from './template'

const convert = (markdown, type, options, css, headerTemplate, footerTemplate, savePath, mdBasePath, headerBasePath, footerBasePath, charset) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data
      const html = await markdownToHTML(markdown, type === 'html', get(options, 'html'), mdBasePath)
      const doc = await body(html, charset, css)
      switch (type) {
        case 'pdf':
          const margin = get(options, 'pdf.margin')
          data = await pdf(doc, {
            ...get(options, 'pdf'),
            headerTemplate: await header(headerTemplate, css, margin, headerBasePath),
            footerTemplate: await footer(footerTemplate, css, margin, footerBasePath)
          })
          break
        case 'jpeg':
          data = await capture(doc, {
            ...get(options, 'jpeg'),
            type
          })
          break
        case 'png':
          data = await capture(doc, {
            ...get(options, 'png'),
            type
          })
          break
        default:
          data = doc
      }
      resolve(data)
    } catch (e) {
      reject(e)
    }
  })
}

export default convert
