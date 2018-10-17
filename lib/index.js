'use babel'

import { CompositeDisposable } from 'atom'
import { resolve } from 'path'
import commands from './commands'
import { config, PACKAGE_NAME } from './config'
import { copyCustomTemplateFiles } from './api/filesystem'
import { getUserAtomPath, addCommand, setConfig, getConfig, addGrammarToMarkdownPreviewConfig, isSpec } from './api/atom'
import notification from './ui/notification'
import downloadChromium from './ui/downloadChromium'

export default {
  config: config(),
  async activate () {
    try {
      addGrammarToMarkdownPreviewConfig()
      await copyCustomTemplateFiles(resolve(getUserAtomPath(), PACKAGE_NAME))
    } catch (e) {
      notification(e.message, 'error')
    }
    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(addCommand('atom-workspace', commands()))
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
