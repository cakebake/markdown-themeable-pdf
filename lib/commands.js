'use babel'

import { get, set, toUpper } from 'lodash'
import _convert from './api/convert'
import { getHighlightJsStylePathByName, getDefaultExportFilePath, getFileName } from './api/filesystem'
import {
  notification,
  getCssFilePaths,
  getProjectRootPathByFilePath,
  getActiveTextEditor,
  getConfig,
  getHeaderFilePath,
  getFooterFilePath
} from './atom'
import downloadChromium from './ui/downloadChromium'
import _options from './options'
import { openItem, showSaveDialog } from './electron'

const commands = () => {
  let c = {}
  set(c, `markdown-themeable-PDF:convert-to-PDF`, async ({ target }) => {
    try {
      convert(await getPath(target), 'pdf')
    } catch (e) {
      notification(e, 'error')
    }
  })
  set(c, `markdown-themeable-PDF:convert-to-Image`, async ({ target }) => {
    try {
      convert(await getPath(target), 'img')
    } catch (e) {
      notification(e, 'error')
    }
  })
  set(c, `markdown-themeable-PDF:convert-to-HTML`, async ({ target }) => {
    try {
      convert(await getPath(target), 'html')
    } catch (e) {
      notification(e, 'error')
    }
  })
  return c
}

const getPath = (target) => {
  return new Promise((resolve, reject) => {
    const treeViewPath = get(target, 'dataset.path')
    const editor = getActiveTextEditor()
    if (editor) {
      const editorPath = editor.getPath()
      const empty = editor.isEmpty()
      const modified = editor.isModified()
      if (treeViewPath) {
        if (treeViewPath === editorPath) {
          if (modified) {
            reject(Error(`Unsaved file ${editor.getLongTitle()}`))
          } else {
            if (empty) {
              reject(Error(`Empty file ${editor.getLongTitle()}`))
            } else {
              resolve(treeViewPath)
            }
          }
        } else {
          resolve(treeViewPath)
        }
      } else {
        if (modified) {
          reject(Error(`Please save your changes`))
        } else {
          if (empty) {
            reject(Error(`Editor is empty`))
          } else {
            resolve(editorPath)
          }
        }
      }
    } else {
      if (!treeViewPath) {
        reject(Error('Could not get tree-view or editor path'))
      } else {
        resolve(treeViewPath)
      }
    }
  })
}

const convert = async (path, type) => {
  try {
    const enabled = type !== 'html' ? await downloadChromium() : true
    if (enabled) {
      const options = _options()
      if (type === 'img') {
        type = getConfig('imageExportFileType')
      }
      const dialogTitle = `Save ${toUpper(type)}`
      const savePath = await showSaveDialog(dialogTitle, getDefaultExportFilePath(path, type), dialogTitle, type)
      if (savePath) {
        notification(`Start Print/Convert ${getFileName(path, true)} to ${toUpper(type)}`)
        const projectRootPath = getProjectRootPathByFilePath(path)
        const cssFilePaths = getCssFilePaths(
          getConfig('customStylesPath'),
          projectRootPath,
          get(options, 'html.enableCodeHighlighting') ? getHighlightJsStylePathByName(getConfig('codeHighlightingTheme')) : null,
          type
        )
        const headerFilePath = (type === 'pdf') ? getHeaderFilePath(getConfig('customHeaderPath'), projectRootPath) : null
        const footerFilePath = (type === 'pdf') ? getFooterFilePath(getConfig('customFooterPath'), projectRootPath) : null
        const convertedFilePath = await _convert(path, type, options, cssFilePaths, headerFilePath, footerFilePath, savePath)
        notification(`${toUpper(type)} created in ${convertedFilePath}`, 'success')
        if (getConfig('openFile')) {
          openItem(convertedFilePath, type)
        }
      }
    } else {
      notification('Abort because we need Chromium!', 'warning')
    }
  } catch (e) {
    notification(e.message, 'error')
    console.error(e)
  }
}

export default commands
