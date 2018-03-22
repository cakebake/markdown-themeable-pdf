'use babel'

import { remote, shell } from 'electron'
import { get, set, startsWith, toUpper } from 'lodash'
import { existsSync } from 'fs'
import { join, resolve, sep } from 'path'
import { config, PACKAGE_NAME } from './config'

export const options = (loadDefaults = false) => {
  return {
    html: {
      html: getConfig('enableHtmlInMarkdown', loadDefaults),
      linkify: getConfig('enableLinkify', loadDefaults),
      typographer: getConfig('enableTypographer', loadDefaults),
      xhtmlOut: getConfig('enableXHTML', loadDefaults),
      breaks: getConfig('enableBreaks', loadDefaults),
      quotes: getConfig('smartQuotes', loadDefaults),
      enableCodeHighlighting: getConfig('enableCodeHighlighting', loadDefaults),
      codeHighlightingAuto: getConfig('codeHighlightingAuto', loadDefaults),
      enableImSizeMarkup: getConfig('enableImSizeMarkup', loadDefaults),
      enableCheckboxes: getConfig('enableCheckboxes', loadDefaults),
      enableSmartArrows: getConfig('enableSmartArrows', loadDefaults),
      enableTOC: getConfig('enableTOC', loadDefaults),
      enableAnchor: getConfig('enableAnchor', loadDefaults),
      tocFirstLevel: getConfig('tocFirstLevel', loadDefaults),
      tocLastLevel: getConfig('tocLastLevel', loadDefaults),
      anchorLinkSymbol: getConfig('anchorLinkSymbol', loadDefaults),
      enableEmoji: getConfig('enableEmoji', loadDefaults),
      enableFootnotes: getConfig('enableFootnotes', loadDefaults)
    },
    pdf: {
      format: getConfig('format', loadDefaults),
      width: getConfig('width', loadDefaults),
      height: getConfig('height', loadDefaults),
      landscape: getConfig('orientation', loadDefaults) === 'landscape',
      displayHeaderFooter: getConfig('enablePdfHeaderAndFooter', loadDefaults),
      margin: {
        top: getConfig('pageBorderTopSize', loadDefaults),
        right: getConfig('pageBorderRightSize', loadDefaults),
        bottom: getConfig('pageBorderBottomSize', loadDefaults),
        left: getConfig('pageBorderLeftSize', loadDefaults)
      }
    },
    jpeg: {
      quality: getConfig('imageQuality', loadDefaults),
      width: getConfig('width', loadDefaults),
      height: getConfig('height', loadDefaults)
    },
    png: {
      width: getConfig('width', loadDefaults),
      height: getConfig('height', loadDefaults)
    }
  }
}

export const observeTextEditors = (callback) => atom.workspace.observeTextEditors(callback)

export const addCommand = (scope, commands) => atom.commands.add(scope, commands)

export const getActiveTextEditor = () => atom.workspace.getActiveTextEditor()

export const openFile = (fullPath, type) => {
  return new Promise(async (resolve) => {
    switch (type) {
      case 'html':
        shell.openItem(fullPath)
        break
      case 'pdf':
        if (atom.packages.isPackageLoaded('pdf-view')) {
          await atom.workspace.open(fullPath, { searchAllPanes: true })
        } else {
          shell.openItem(fullPath)
        }
        break
      default:
        atom.workspace.open(fullPath, { searchAllPanes: true })
    }
    resolve()
  })
}

export const showSaveDialog = (title, defaultPath, buttonLabel, type = null) => {
  let filters = []
  if (type) {
    filters.push({name: toUpper(type), extensions: [type]})
  }
  return remote.dialog.showSaveDialog({ title, defaultPath, buttonLabel, filters })
}

export const getHeaderFilePath = (customPath, projectRootPath) => getCustomConfigFilePath(customPath, projectRootPath)

export const getFooterFilePath = (customPath, projectRootPath) => getCustomConfigFilePath(customPath, projectRootPath)

export const getCssFilePaths = (customPath, projectRootPath, highlightJsStylePath = null, type) => {
  const files = [
    resolve(__dirname, './css/document.css')
    // resolve(__dirname, '../node_modules/bootstrap/dist/css/bootstrap.min.css'),
  ]
  if (type === 'pdf') {
    files.push(resolve(__dirname, './css/pdf.css'))
  }
  if (type === 'jpeg' || type === 'png') {
    files.push(resolve(__dirname, './css/capture.css'))
  }
  const customCssFile = getCustomConfigFilePath(customPath, projectRootPath)
  if (customCssFile) {
    files.push(customCssFile)
  }
  if (highlightJsStylePath && existsSync(highlightJsStylePath)) {
    files.push(highlightJsStylePath)
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
  let n
  switch (type) {
    case 'error':
      n = atom.notifications.addError(PACKAGE_NAME, { ...options, detail, dismissable: true })
      break;
    case 'warning':
      n = atom.notifications.addWarning(PACKAGE_NAME, { ...options, detail })
      break;
    case 'success':
      n = atom.notifications.addSuccess(PACKAGE_NAME, { ...options, detail })
      break;
    default:
      n = atom.notifications.addInfo(PACKAGE_NAME, { ...options, detail })
  }
  return n
}

export const downloadChromiumNotification = () => {
  let n
  let clicked = 0
  const onDidClick = () => {
    clicked++
    const status = document.getElementById('dl-status')
    status.innerHTML = clicked
    // n.dismiss()
  }
  const description = `${PACKAGE_NAME} bundles Chromium to ensure that the latest features it uses are guaranteed to be available. <div id="dl-status"></div>`
  n = notification('', 'info', {
    description,
    buttons: [{ text: 'Download latest Chromium', onDidClick }],
    dismissable: true
  })
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

export const getConfig = (type, loadDefault = false) => {
  const setting = atom.config.get(`${PACKAGE_NAME}.${type}`)
  return (!loadDefault && typeof setting !== 'undefined') ? setting : get(config(), `${type}.default`)
}

export const getCoreConfig = type => atom.config.get(`core.${type}`)
