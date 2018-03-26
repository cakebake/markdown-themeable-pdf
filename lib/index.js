'use babel'

import { CompositeDisposable } from 'atom'
import { resolve } from 'path'
import commands from './commands'
import { config, PACKAGE_NAME } from './config'
import { copyCustomTemplateFiles, getHighlightJsStyles } from './api/filesystem'
import { notification, pageBreakStyling, getUserAtomPath, addCommand, observeTextEditors } from './atom'
import downloadChromiumNotification from './atom/downloadChromiumNotification'

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
    this.subscriptions.add(addCommand('atom-workspace', commands()))
    this.subscriptions.add(observeTextEditors(pageBreakStyling))
    try {
      await downloadChromiumNotification()
    } catch (e) {
      console.error(e)
    }
  },
  deactivate () {
    this.subscriptions.dispose()
  }
}
