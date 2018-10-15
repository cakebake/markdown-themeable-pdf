'use babel'

import { CompositeDisposable } from 'atom'
import { resolve } from 'path'
import commands from './commands'
import { config, PACKAGE_NAME } from './config'
import { copyCustomTemplateFiles } from './api/filesystem'
import { getUserAtomPath, addCommand, observeTextEditors, setConfig, getConfig } from './api/atom'
import notification from './ui/notification'
import pageBreakStyling from './ui/pageBreakStyling'
import downloadChromium from './ui/downloadChromium'

export default {
  config: config(),
  async activate () {
    try {
      await copyCustomTemplateFiles(resolve(getUserAtomPath(), PACKAGE_NAME))
    } catch (e) {
      notification(e.message, 'error')
    }
    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(addCommand('atom-workspace', commands()))
    this.subscriptions.add(observeTextEditors(pageBreakStyling))
    if (getConfig('downloadChromiumOnActivation')) {
      try {
        if (!await downloadChromium()) {
          setConfig('downloadChromiumOnActivation', false)
        }
      } catch (e) {
        notification(e.message, 'error')
      }
    }
  },
  deactivate () {
    if (this.subscriptions) {
      this.subscriptions.dispose()
    }
  }
}
