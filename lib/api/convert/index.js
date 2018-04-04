'use babel'

import { get } from 'lodash'
import markdownToHTML from './markdownToHTML'
import { pdf, capture } from './headlessChrome'
import { body, header, footer } from './template'

const convert = (type, savePath, docBody, docHeader, docFooter, options, charset) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data
      const html = await markdownToHTML(get(docBody, 'template', null), get(options, 'html'))
      const doc = await body(html, charset, get(docBody, 'css', null), get(docBody, 'basePath', null))
      switch (type) {
        case 'pdf':
          const margin = get(options, 'pdf.margin')
          data = await pdf(doc, {
            ...get(options, 'pdf'),
            headerTemplate: await header(get(docHeader, 'template', null), get(docHeader, 'css', null), margin, get(docHeader, 'basePath', null)),
            footerTemplate: await footer(get(docFooter, 'template', null), get(docFooter, 'css', null), margin, get(docFooter, 'basePath', null))
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
