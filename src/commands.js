'use babel'

import { get } from 'lodash'
import convert from './api/convert'
import { getConfig, notification } from './atom'

export const convertContent = () => {
  const editor = atom.workspace.getActiveTextEditor()
  if (editor.isEmpty()) {
    notification('Current editor is empty', 'error')
  } else {
    if (editor.isModified()) {
      notification('Any unsaved changes are ignored. Please save your changes before exporting.', 'warning')
    }
    _convert(editor.getPath())
  }
}

// @todo file is empty error
export const convertFile = (event) => {
  _convert(get(event, 'target.dataset.path', null))
}

const _convert = (path) => {
  const exportFileType = getConfig('exportFileType')
  notification(`Start converting markdown to ${exportFileType}`)
  convert(path, exportFileType)
    .then((content) => {
      console.log(exportFileType, content)
    })
    .catch((e) => {
      console.error(e)
    })
}
