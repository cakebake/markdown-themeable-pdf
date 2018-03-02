'use babel'

import { get, toUpper, isEmpty } from 'lodash'
import _convert from './api/convert'
import { getConfig, getCoreConfig, notification } from './api/atom'
import { parse } from 'path'

export const convertContentToPDF = () => convertContent('pdf')

export const convertContentToHTML = () => convertContent('html')

export const convertFileToPDF = (event) => convertFile(event, 'pdf')

export const convertFileToHTML = (event) => convertFile(event, 'html')

const convertContent = (type) => {
  const editor = atom.workspace.getActiveTextEditor() || null
  if (isEmpty(editor) || editor.isEmpty()) {
    notification('Current editor is empty - nothing to do!', 'warning')
  } else {
    if (editor.isModified()) {
      notification('Any unsaved changes are ignored. Please save your changes before exporting.', 'warning')
    }
    convert(editor.getPath(), type)
  }
}

const convertFile = (event, type) => {
  convert(get(event, 'target.dataset.path'), type)
}

const convert = async (path, type) => {
  const exportFileType = type || getConfig('exportFileType')
  notification(`Start Print/Convert ${get(parse(path), 'base')} to ${toUpper(exportFileType)}`)
  try {
    const convertedFilePath = await _convert(path, exportFileType)
    notification(`${toUpper(exportFileType)} created in ${convertedFilePath}`, 'success')
  } catch (e) {
    notification(e, 'error')
    console.error(e)
  }
}
