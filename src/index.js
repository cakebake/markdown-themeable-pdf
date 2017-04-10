'use babel'

import { CompositeDisposable } from 'atom'
import { convertContent, convertFile } from './commands'
import config from './config'
import { copyCustomTemplateFiles } from './api/filesystem'

export default {
  config,
  activate () {
    const commands = {
      'markdown-themeable-pdf:convertContent': convertContent,
      'markdown-themeable-pdf:convertFile': convertFile
    }
    const pageBreakStyling = (editor) => {
      const regex = new RegExp('^<div class="page-break"></div>$', 'g')
      editor.onDidStopChanging(() => {
        editor.scan(regex, (res) => {
          const marker = editor.markBufferRange(res.range, { invalidate: 'touch' })
          editor.decorateMarker(marker, {
            type: 'line',
            class: 'markdown-themeable-pdf-page-break'
          })
        })
      })
    }
    copyCustomTemplateFiles((e) => {
      if (e) {
        atom.notifications
          .addError(e)
      }
    })
    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(atom.commands.add('atom-workspace', commands))
    this.subscriptions.add(atom.workspace.observeTextEditors(pageBreakStyling))
  },
  deactivate() {
    this.subscriptions
      .dispose()
  }
}
