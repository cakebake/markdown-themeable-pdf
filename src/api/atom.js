'use babel'

import { get, set, forEach } from 'lodash'

const PACKAGE_NAME = 'markdown-themeable-pdf'

export const notification = (message = '', type = 'info') => {
  message = `${PACKAGE_NAME}: ${message}`
  switch (type) {
    case 'error':
      atom.notifications.addError(message)
      break;
    case 'warning':
      atom.notifications.addWarning(message)
      break;
    case 'success':
      atom.notifications.addSuccess(message)
      break;
    default:
      atom.notifications.addInfo(message)
  }
}

export const pageBreakStyling = (editor) => {
  const regex = new RegExp('^<div class="page-break"></div>$', 'g')
  editor.onDidStopChanging(() => {
    editor.scan(regex, (res) => {
      const marker = editor.markBufferRange(res.range, { invalidate: 'touch' })
      editor.decorateMarker(marker, {
        type: 'line',
        class: 'markdown-themeable-pdf-page-break'
      })
    })
  })
}

export const getConfig = type => atom.config.get(`${PACKAGE_NAME}.${type}`)

export const getCoreConfig = type => atom.config.get(`core.${type}`)

// export const configCollection = keys => {
//   const collection = {}
//   forEach(keys, (key) => {
//     set(collection, key, getConfig(key))
//   })
//   return collection
// }
