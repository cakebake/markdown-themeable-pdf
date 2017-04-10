'use babel'

import { get } from 'lodash'
import convert from './api/convert'

export const convertContent = () => {
  const editor = atom.workspace.getActiveTextEditor()
  if (editor.isEmpty()) {
    atom.notifications
      .addError('Current editor is empty')
  } else {
    if (editor.isModified()) {
        atom.notifications
          .addWarning('Any unsaved changes are ignored. Please save your changes before exporting.')
    }
    convert(editor.getPath())
  }
}

export const convertFile = (event) => {
  convert(get(event, 'target.dataset.path', null))
}
