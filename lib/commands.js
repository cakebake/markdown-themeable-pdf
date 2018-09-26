'use babel'

import { get, toUpper } from 'lodash'
import convert from './convert'
import { notification, getActiveTextEditor, getConfig } from './api/atom'
import options from './api/atom/convertOptions'
import downloadChromium from './ui/downloadChromium'
import { getDefaultExportFilePath, getFileName } from './api/filesystem'
import { showSaveDialog, openItem } from './api/electron'

const commands = () => {
  return {
    'markdown-themeable-PDF:convert-to-PDF': ({ target }) => execute(target, 'pdf'),
    'markdown-themeable-PDF:convert-to-Image': ({ target }) => execute(target, 'img'),
    'markdown-themeable-PDF:convert-to-HTML': ({ target }) => execute(target, 'html')
  }
}

const execute = async (target, type) => {
  try {
    const dependencyStatus = type !== 'html' ? await downloadChromium() : true
    if (dependencyStatus) {
      type = (type === 'img') ? getConfig('imageExportFileType') : type
      const markdownPath = await getMarkdownPath(target)
      const savePath = await getSavePath(markdownPath, type)
      if (savePath) {
        notification(`Start Print/Convert ${getFileName(markdownPath, true)} to ${toUpper(type)}`)
        const convertedFilePath = await convert(markdownPath, savePath, type, options())
        notification(`${toUpper(type)} created in ${convertedFilePath}`, 'success')
        openItem(convertedFilePath, type, getConfig('openFile'))
      } else {
        notification('Save dialog canceled')
      }
    } else {
      notification('Abort because we need Chromium!', 'warning')
    }
  } catch (e) {
    notification(e.message, 'error')
    console.error(e)
  }
}

const getSavePath = (markdownPath, type) => {
  const dialogTitle = `Save ${toUpper(type)}`
  return showSaveDialog(dialogTitle, getDefaultExportFilePath(markdownPath, type), dialogTitle, type)
}

const getMarkdownPath = (target) => {
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

export default commands
