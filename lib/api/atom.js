'use babel'

import { get, set, forEach, startsWith } from 'lodash'
import { sep } from 'path'
// import config from '../config'

const PACKAGE_NAME = 'markdown-themeable-pdf'

export const getProjectPathByFilePath = (filePath) => {
  const projectPaths = atom.project.getPaths()
  let path = null
  for (var i = 0; i < projectPaths.length; i++) {
    if (startsWith(filePath, projectPaths[i] + sep)) {
      path = projectPaths[i]
    }
  }
  if (path == null) {
    path = projectPaths[0]
  }
  return path
}

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

export const getConfig = (type, loadDefault = false) => {
  const c = atom.config.get(`${PACKAGE_NAME}.${type}`)
  return c
  // return (!loadDefault && typeof c !== 'undefined') ? c : get(config, `${type}.default`)
}

export const getCoreConfig = type => atom.config.get(`core.${type}`)
