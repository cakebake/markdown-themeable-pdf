'use babel'

import { CompositeDisposable } from 'atom'
import { set } from 'lodash'
import { convertContentToPDF, convertContentToImage, convertContentToHTML, convertFileToPDF, convertFileToImage, convertFileToHTML } from './commands'
import { config, PACKAGE_NAME } from './config'
import { copyCustomTemplateFiles, getHighlightJsStyles } from './api/filesystem'
import { notification, pageBreakStyling } from './api/atom'

const commands = () => {
  let c = {}
  set(c, `${PACKAGE_NAME}:convertContentToPDF`, convertContentToPDF)
  set(c, `${PACKAGE_NAME}:convertContentToImage`, convertContentToImage)
  set(c, `${PACKAGE_NAME}:convertContentToHTML`, convertContentToHTML)
  set(c, `${PACKAGE_NAME}:convertFileToPDF`, convertFileToPDF)
  set(c, `${PACKAGE_NAME}:convertFileToImage`, convertFileToImage)
  set(c, `${PACKAGE_NAME}:convertFileToHTML`, convertFileToHTML)
  return c
}

export default {
  config: config(getHighlightJsStyles()),
  activate () {
    copyCustomTemplateFiles((e) => {
      if (e) {
        notification(e, 'error')
      }
    })
    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(atom.commands.add('atom-workspace', commands()))
    this.subscriptions.add(atom.workspace.observeTextEditors(pageBreakStyling))
  },
  deactivate() {
    this.subscriptions.dispose()
  }
}
