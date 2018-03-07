'use babel'

import { get, set, toUpper, isEmpty } from 'lodash'
import _convert from './api/convert'
import { getConfig, notification, options } from './api/atom'
import { PACKAGE_NAME } from './config'
import { parse } from 'path'

const commands = () => {
  let c = {}
  set(c, `${PACKAGE_NAME}:convertContentToPDF`, () => convertContent('pdf'))
  set(c, `${PACKAGE_NAME}:convertContentToImage`, () => convertContent('img'))
  set(c, `${PACKAGE_NAME}:convertContentToHTML`, () => convertContent('html'))
  set(c, `${PACKAGE_NAME}:convertFileToPDF`, (event) => convertFile(event, 'pdf'))
  set(c, `${PACKAGE_NAME}:convertFileToImage`, (event) => convertFile(event, 'img'))
  set(c, `${PACKAGE_NAME}:convertFileToHTML`, (event) => convertFile(event, 'html'))
  return c
}

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
  notification(`Start Print/Convert ${get(parse(path), 'base')} to ${toUpper(type)}`)
  try {
    const convertedFilePath = await _convert(path, type, options())
    notification(`${toUpper(type)} created in ${convertedFilePath}`, 'success')
  } catch (e) {
    notification(e, 'error')
    console.error(e)
  }
}

export default commands
