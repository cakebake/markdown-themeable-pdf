'use babel'

import { get, set, toUpper, isEmpty } from 'lodash'
import _convert from './api/convert'
import { getHighlightJsStylePathByName, getDefaultExportFilePath, getFileName } from './api/filesystem'
import { PACKAGE_NAME } from './config'
import {
  showSaveDialog,
  notification,
  options as _options,
  getCssFilePaths,
  getProjectRootPathByFilePath,
  openFile,
  getActiveTextEditor,
  getConfig
} from './atom'

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
  const editor = getActiveTextEditor() || null
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
  const options = _options()
  if (type === 'img') {
    type = get(options, 'imageExportFileType')
  }
  const dialogTitle = `Save ${toUpper(type)}`
  const savePath = showSaveDialog(dialogTitle, getDefaultExportFilePath(path, type), dialogTitle, type)
  if (savePath) {
    try {
      notification(`Start Print/Convert ${getFileName(path, true)} to ${toUpper(type)}`)
      const cssFilePaths = getCssFilePaths(
        get(options, 'customStylesPath'),
        getProjectRootPathByFilePath(path),
        get(options, 'markdownIt.enableCodeHighlighting') ? getHighlightJsStylePathByName(get(options, 'codeHighlightingTheme')) : null
      )
      const convertedFilePath = await _convert(path, type, options, cssFilePaths, savePath)
      notification(`${toUpper(type)} created in ${convertedFilePath}`, 'success')
      if (getConfig('openFile')) {
        openFile(convertedFilePath, type)
      }
    } catch (e) {
      notification(e, 'error')
      console.error(e)
    }
  } else {
    notification('Canceled')
  }
}

export default commands
