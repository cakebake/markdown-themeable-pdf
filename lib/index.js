'use babel'

import { CompositeDisposable } from 'atom'
import { resolve } from 'path'
import commands from './commands'
import { config, PACKAGE_NAME } from './config'
import { copyCustomTemplateFiles, getHighlightJsStyles } from './api/filesystem'
import { notification, pageBreakStyling, getUserAtomPath } from './atom'

export default {
  config: config(getHighlightJsStyles()),
  async activate () {
    try {
      const customTemplateFilesDest = await copyCustomTemplateFiles(resolve(getUserAtomPath(), PACKAGE_NAME))
      if (customTemplateFilesDest) {
        notification(`Custom template files were copied to ${customTemplateFilesDest}`)
      }
    } catch (e) {
      notification(e, 'error')
    }
    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(atom.commands.add('atom-workspace', commands()))
    this.subscriptions.add(atom.workspace.observeTextEditors(pageBreakStyling))
  },
  deactivate () {
    this.subscriptions.dispose()
  }
}
