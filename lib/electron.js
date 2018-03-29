'use babel'

import { remote, shell } from 'electron'
import { toUpper } from 'lodash'
import { isPackageLoaded, openInWorkspace } from './atom'

export const openExternal = (url) => shell.openExternal(url)

export const openItem = (fullPath, type) => {
  return new Promise(async (resolve) => {
    switch (type) {
      case 'html':
        shell.openItem(fullPath)
        break
      case 'pdf':
        if (isPackageLoaded('pdf-view')) {
          await openInWorkspace(fullPath, { searchAllPanes: true })
        } else {
          shell.openItem(fullPath)
        }
        break
      default:
        await openInWorkspace(fullPath, { searchAllPanes: true })
    }
    resolve()
  })
}

export const showSaveDialog = (title, defaultPath, buttonLabel, type = null) => {
  return new Promise((resolve, reject) => {
    try {
      const filters = []
      if (type) {
        filters.push({name: toUpper(type), extensions: [type]})
      }
      resolve(remote.dialog.showSaveDialog({ title, defaultPath, buttonLabel, filters }))
    } catch (e) {
      reject(e)
    }
  })
}
