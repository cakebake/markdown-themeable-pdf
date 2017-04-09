'use babel'

import { createCapture } from './api/capture'
import { get } from 'lodash'

const print = (filePath) => {
  if (!filePath) {
    atom.notifications
      .addError('Could not get file path')
  } else {
    createCapture(filePath)
  }
}

export const printContent = () => {
  const editor = atom.workspace.getActiveTextEditor()
  if (editor.isEmpty()) {
    atom.notifications
      .addError('Current editor is empty')
  } else {
    if (editor.isModified()) {
        atom.notifications
          .addWarning('Any unsaved changes are ignored. Please save your changes before exporting.')
    }
    print(editor.getPath())
  }
}

export const printFile = (event) => {
  print(get(event, 'target.dataset.path', null))
}
