'use babel'

import { CompositeDisposable } from 'atom'
import { convertContentToPDF, convertContentToImage, convertContentToHTML, convertFileToPDF, convertFileToImage, convertFileToHTML } from './commands'
import config from './config'
import { copyCustomTemplateFiles } from './api/filesystem'
import { notification, pageBreakStyling } from './api/atom'

const commands = {
  'markdown-themeable-pdf:convertContentToPDF': convertContentToPDF,
  'markdown-themeable-pdf:convertContentToImage': convertContentToImage,
  'markdown-themeable-pdf:convertContentToHTML': convertContentToHTML,
  'markdown-themeable-pdf:convertFileToPDF': convertFileToPDF,
  'markdown-themeable-pdf:convertFileToImage': convertFileToImage,
  'markdown-themeable-pdf:convertFileToHTML': convertFileToHTML
}

export default {
  config,
  activate () {
    copyCustomTemplateFiles((e) => {
      if (e) {
        notification(e, 'error')
      }
    })
    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(atom.commands.add('atom-workspace', commands))
    this.subscriptions.add(atom.workspace.observeTextEditors(pageBreakStyling))
  },
  deactivate() {
    this.subscriptions.dispose()
  }
}
