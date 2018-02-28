'use babel'

import { get, toUpper } from 'lodash'
import convert from './api/convert'
import { getConfig, getCoreConfig, notification } from './api/atom'
import { parse } from 'path'

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
    _convert(editor.getPath(), type, editor.getEncoding())
  }
}

const convertFile = (event, type) => {
  _convert(get(event, 'target.dataset.path', null), type)
}

const _convert = async (path, type, encoding) => {
  const exportFileType = type || getConfig('exportFileType')
  const fileInfo = parse(path)
  encoding = encoding || getCoreConfig('fileEncoding')

  notification(`Start Print/Convert ${get(fileInfo, 'base')} to ${toUpper(exportFileType)}`)
  try {
    const convertedFilePath = await convert(path, exportFileType, fileInfo, encoding)
    notification(`${toUpper(exportFileType)} created in ${convertedFilePath}`, 'success')
  } catch (e) {
    notification(e, 'error')
    console.error(e)
  }
}
