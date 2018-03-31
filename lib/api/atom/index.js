'use babel'

import { get, startsWith } from 'lodash'
import { existsSync } from 'fs'
import { join, resolve, sep } from 'path'
import { config, PACKAGE_NAME } from '../../config'
import { getBootswatchThemePathByName } from '../../theme/bootswatch'
import { getHighlightJsStylePathByName } from '../../theme/highlightJs'

export const openInWorkspace = (fullPath) => atom.workspace.open(fullPath, { searchAllPanes: true })

export const isPackageLoaded = (name) => atom.packages.isPackageLoaded(name)

export const observeTextEditors = (callback) => atom.workspace.observeTextEditors(callback)

export const addCommand = (scope, commands) => atom.commands.add(scope, commands)

export const getActiveTextEditor = () => atom.workspace.getActiveTextEditor()

export const getHeaderFilePath = (customPath, projectRootPath) => getCustomConfigFilePath(customPath, projectRootPath)

export const getFooterFilePath = (customPath, projectRootPath) => getCustomConfigFilePath(customPath, projectRootPath)

export const getCssFilePaths = (customPath, projectRootPath, type) => {
  const files = []
  // files.push(resolve(__dirname, '../../node_modules/bootstrap/dist/css/bootstrap.min.css'))
  if (getConfig('enableCodeHighlighting')) {
    files.push(getHighlightJsStylePathByName(getConfig('codeHighlightingTheme')))
  }
  files.push(getBootswatchThemePathByName(getConfig('theme')))
  files.push(resolve(__dirname, '../../css/all.css'))
  if (type === 'pdf') {
    files.push(resolve(__dirname, '../../css/pdf.css'))
  }
  if (type === 'jpeg' || type === 'png') {
    files.push(resolve(__dirname, '../../css/capture.css'))
  }
  const customCssFile = getCustomConfigFilePath(customPath, projectRootPath)
  if (customCssFile) {
    files.push(customCssFile)
  }
  return files
}

const getCustomConfigFilePath = (configFilePath, projectRootPath) => {
  const projectConfigFile = join(projectRootPath, configFilePath)
  if (existsSync(projectConfigFile)) {
    return projectConfigFile
  }
  const userConfigFile = join(getUserAtomPath(), configFilePath)
  if (existsSync(userConfigFile)) {
    return userConfigFile
  }
  return null
}

export const getUserAtomPath = () => atom.getConfigDirPath()

export const getProjectRootPathByFilePath = (filePath) => {
  const projectPaths = atom.project.getPaths()
  let path = null
  for (var i = 0; i < projectPaths.length; i++) {
    if (startsWith(filePath, projectPaths[i] + sep)) {
      path = projectPaths[i]
    }
  }
  if (path == null) {
    path = projectPaths[0]
  }
  return path
}

export const notification = (detail, type = 'info', options = {}) => {
  if (isPackageLoaded('notifications')) {
    let model
    switch (type) {
      case 'error':
        model = atom.notifications.addError(PACKAGE_NAME, { ...options, detail, dismissable: true, icon: 'markdown' })
        break
      case 'warning':
        model = atom.notifications.addWarning(PACKAGE_NAME, { ...options, detail, icon: 'markdown' })
        break
      case 'success':
        model = atom.notifications.addSuccess(PACKAGE_NAME, { ...options, detail, icon: 'markdown' })
        break
      default:
        model = atom.notifications.addInfo(PACKAGE_NAME, { ...options, detail, icon: 'markdown' })
    }
    return model
  } else {
    if (!get(options, 'buttons.buttons')) {
      window.alert(`${PACKAGE_NAME}: ${detail}`)
      let dismissAction = () => {}
      return {
        dismiss () {
          dismissAction()
        },
        onDidDismiss (action) {
          dismissAction = action
        }
      }
    } else {
      console.error('Notification package disabled')
    }
  }
}

export const pageBreakStyling = (editor) => {
  let decorations = []
  let subscriptions = []
  const regex = new RegExp('^<div class="page-break"></div>$', 'g')
  const styleIt = () => {
    setTimeout(() => {
      editor.scan(regex, (res) => {
        const marker = editor.markBufferRange(res.range, { invalidate: 'touch' })
        const options = { type: 'line', class: `${PACKAGE_NAME}-page-break` }
        decorations.push(editor.decorateMarker(marker, options))
      })
    }, 10)
  }
  const unstyleIt = () => {
    if (decorations.length) {
      decorations.forEach((d) => d.destroy())
    }
  }
  editor.observeGrammar((grammar) => {
    if (get(grammar, 'scopeName') === 'source.gfm') {
      styleIt()
      subscriptions.push(editor.onDidStopChanging(() => styleIt()))
    } else {
      unstyleIt()
      if (subscriptions.length) {
        subscriptions.forEach((s) => s.dispose())
      }
    }
  })
}

export const getConfig = (key, loadDefault = false) => {
  const setting = atom.config.get(`${PACKAGE_NAME}.${key}`)
  return (!loadDefault && typeof setting !== 'undefined') ? setting : get(config(), `${key}.default`)
}

export const setConfig = (key, value) => {
  atom.config.set(`${PACKAGE_NAME}.${key}`, value)
}
