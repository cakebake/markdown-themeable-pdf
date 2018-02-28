'use babel'

import { get, toUpper } from 'lodash'
import convert from './api/convert'
import { getConfig, notification } from './api/atom'

export const convertContentToPDF = () => convertContent('pdf')

export const convertContentToHTML = () => convertContent('html')

export const convertFileToPDF = (event) => convertFile(event, 'pdf')

export const convertFileToHTML = (event) => convertFile(event, 'html')

const convertContent = (type) => {
  const editor = atom.workspace.getActiveTextEditor()
  if (editor.isEmpty()) {
    notification('Current editor is empty - nothing to do!', 'warning')
  } else {
    if (editor.isModified()) {
      notification('Any unsaved changes are ignored. Please save your changes before exporting.', 'warning')
    }
    _convert(editor.getPath(), type)
  }
}

const convertFile = (event, type) => {
  _convert(get(event, 'target.dataset.path', null), type)
}

const _convert = async (path, type) => {
  const exportFileType = type || getConfig('exportFileType')
  notification(`Start Print/Convert to ${toUpper(exportFileType)}`)
  try {
    const convertedFilePath = await convert(path, exportFileType)
    notification(`${toUpper(exportFileType)} created in ${convertedFilePath}`, 'success')
  } catch (e) {
    notification(e, 'error')
    console.error(e)
  }
}
