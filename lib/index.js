'use babel'

import { CompositeDisposable } from 'atom'
import commands from './commands'
import config from './config'
import { copyCustomTemplateFiles, getHighlightJsStyles } from './api/filesystem'
import { notification, pageBreakStyling } from './api/atom'

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
