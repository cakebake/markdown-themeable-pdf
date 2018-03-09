'use babel'

import { remote, shell } from 'electron'
import { get, startsWith, toUpper } from 'lodash'
import { getFileDirectory } from './api/filesystem'
import { existsSync } from 'fs'
import { join, resolve, sep } from 'path'
import { config, PACKAGE_NAME } from './config'

export const options = (loadDefaults = false) => {
  return {
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
      enableTOC: getConfig('enableTocAndAnchor', loadDefaults) === 'TOC enabled' || getConfig('enableTocAndAnchor', loadDefaults) === 'TOC and Anchors enabled',
      enableAnchor: getConfig('enableTocAndAnchor', loadDefaults) === 'Anchors enabled' || getConfig('enableTocAndAnchor', loadDefaults) === 'TOC and Anchors enabled',
      tocFirstLevel: getConfig('tocFirstLevel', loadDefaults),
      tocLastLevel: getConfig('tocLastLevel', loadDefaults),
      anchorLinkSymbol: getConfig('anchorLinkSymbol', loadDefaults),
      enableEmoji: getConfig('enableEmoji', loadDefaults),
      enableFootnotes: getConfig('enableFootnotes', loadDefaults)
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

export const getCssFilePaths = (customStylesPath, projectRootPath, highlightJsStylePath = null) => {
  const files = [
    resolve(__dirname, './css/document.css')
  ]
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
  const regex = new RegExp('^<div class="page-break"></div>$', 'g')
  editor.onDidStopChanging(() => {
    editor.scan(regex, (res) => {
      const marker = editor.markBufferRange(res.range, { invalidate: 'touch' })
      editor.decorateMarker(marker, {
        type: 'line',
        class: `${PACKAGE_NAME}-page-break`
      })
    })
  })
}

export const getConfig = (type, loadDefault = false) => {
  const setting = atom.config.get(`${PACKAGE_NAME}.${type}`)
  return (!loadDefault && typeof setting !== 'undefined') ? setting : get(config(), `${type}.default`)
}

export const getCoreConfig = type => atom.config.get(`core.${type}`)
