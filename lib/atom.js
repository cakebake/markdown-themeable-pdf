'use babel'

import { remote, shell } from 'electron'
import { get, startsWith, toUpper } from 'lodash'
import { getFileDirectory } from './api/filesystem'
import { existsSync } from 'fs'
import { join, resolve, sep } from 'path'
import { config, PACKAGE_NAME } from './config'

export const options = (loadDefaults = false) => {
  const o = {
    imageExportFileType: getConfig('imageExportFileType', loadDefaults),
    customStylesPath: getConfig('customStylesPath', loadDefaults),
    codeHighlightingTheme: getConfig('codeHighlightingTheme', loadDefaults),
    markdownIt: {
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
      enableTOC: getConfig('enableTocAndAnchor', loadDefaults),
      enableAnchor: getConfig('enableTocAndAnchor', loadDefaults),
      tocFirstLevel: getConfig('tocFirstLevel', loadDefaults),
      tocLastLevel: getConfig('tocLastLevel', loadDefaults),
      anchorLinkSymbol: getConfig('anchorLinkSymbol', loadDefaults),
      enableEmoji: getConfig('enableEmoji', loadDefaults),
      enableFootnotes: getConfig('enableFootnotes', loadDefaults)
    },
    // phantomJS: {
    //   format: getConfig('format', loadDefaults),
    //   width: getConfig('width', loadDefaults),
    //   height: getConfig('height', loadDefaults),
    //   orientation: getConfig('orientation', loadDefaults),
    //   border: getConfig('pageBorder', loadDefaults),
    //   quality: getConfig('imageQuality', loadDefaults),
    //   timeout: 10000
    // },
    puppeteer: {
      pdf: {
        format: 'A4',
        displayHeaderFooter: true,
        printBackground: true,
        margin: {
          top: 100,
          right: 100,
          bottom: 100,
          left: 100
        }
      },
      jpeg: {
        quality: 90,
        fullPage: true,
        width: 600,
        height: 600
      },
      png: {
        fullPage: true,
        width: 600,
        height: 600
      }
    }
  }
  // make boolean
  o.markdownIt.enableTOC = o.markdownIt.enableTOC === 'TOC enabled' || o.markdownIt.enableTOC === 'TOC and Anchors enabled'
  o.markdownIt.enableAnchor = o.markdownIt.enableAnchor === 'Anchors enabled' || o.markdownIt.enableAnchor === 'TOC and Anchors enabled'
  // switch format
  // if (o.phantomJS.width && o.phantomJS.height) {
  //   o.phantomJS.format = undefined
  //   o.phantomJS.orientation = undefined
  // } else {
  //   o.phantomJS.width = undefined
  //   o.phantomJS.height = undefined
  // }
  return o
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

export const getCssFilePaths = (customStylesPath, projectRootPath, highlightJsStylePath = null, type) => {
  const files = [
    resolve(__dirname, './css/document.css'),
    // resolve(__dirname, '../node_modules/bootstrap/dist/css/bootstrap.min.css'),
    resolve(__dirname, './css/template.css')
  ]
  if (type === 'pdf') {
    files.push(resolve(__dirname, './css/print.css'))
  }
  if (type === 'jpeg' || type === 'png') {
    files.push(resolve(__dirname, './css/capture.css'))
  }
  const customCssFile = getCustomConfigFilePath(customStylesPath, projectRootPath)
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

export const getUserAtomPath = () => getFileDirectory(atom.config.getUserConfigPath())

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

export const notification = (message = '', type = 'info') => {
  message = `${PACKAGE_NAME}: ${message}`
  switch (type) {
    case 'error':
      atom.notifications.addError(message)
      break;
    case 'warning':
      atom.notifications.addWarning(message)
      break;
    case 'success':
      atom.notifications.addSuccess(message)
      break;
    default:
      atom.notifications.addInfo(message)
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

export const getConfig = (type, loadDefault = false) => {
  const setting = atom.config.get(`${PACKAGE_NAME}.${type}`)
  return (!loadDefault && typeof setting !== 'undefined') ? setting : get(config(), `${type}.default`)
}

export const getCoreConfig = type => atom.config.get(`core.${type}`)
