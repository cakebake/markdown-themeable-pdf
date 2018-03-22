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
      n = atom.notifications.addError(PACKAGE_NAME, { ...options, detail, dismissable: true, icon: 'markdown' })
      break;
    case 'warning':
      n = atom.notifications.addWarning(PACKAGE_NAME, { ...options, detail, icon: 'markdown' })
      break;
    case 'success':
      n = atom.notifications.addSuccess(PACKAGE_NAME, { ...options, detail, icon: 'markdown' })
      break;
    default:
      n = atom.notifications.addInfo(PACKAGE_NAME, { ...options, detail, icon: 'markdown' })
  }
  return n
}

export const downloadChromiumNotification = () => {
  let n
  let progress = 0
  const maxProgress = 100
  const progressId = `${PACKAGE_NAME}-dl-progress`
  const progressBarId = `${PACKAGE_NAME}-dl-progress-bar`
  const progressValueId = `${PACKAGE_NAME}-dl-progress-value`
  const dl = ({ target }) => {
    target.setAttribute('disabled', 'disabled')
    target.blur()
    target.classList.remove('icon-cloud-download')
    target.classList.add('icon-sync')
    if (progress === 0) {
        // const progressElement = document.getElementById(progressId)
        const progressBarElement = document.getElementById(progressBarId)
        const progressValueElement = document.getElementById(progressValueId)
        progressBarElement.setAttribute('max', maxProgress)
        // progressElement.style.display = 'block'
        setInterval(() => {
            if (progress < maxProgress) {
                progress = progress + 5
                progressBarElement.setAttribute('value', progress)
                progressValueElement.innerHTML = progress
            }
        }, 1000)
    }
    // status.innerHTML = clicked
    // n.dismiss()
  }
  const faq = ({ target }) => {
      target.blur()
      shell.openExternal('https://github.com/GoogleChrome/puppeteer#faq')
  }
  const detail = `Chromium is required to create image captures and PDF documents from your Markdown files. ${PACKAGE_NAME} bundles Chromium to ensure that the latest features it uses are guaranteed to be available.`
  const description = `<div id="${progressId}"><progress id="${progressBarId}" class="block" style="width: 100%;"></progress><span class="inline-block highlight-info"><span id="${progressValueId}">${progress}</span>%</span></div>`
  n = notification(detail, 'info', {
    description,
    buttons: [
        { text: 'Start Download', onDidClick: dl, className: `btn btn-success icon icon-cloud-download` },
        { text: 'FAQ', onDidClick: faq, className: `btn btn-info icon icon-info` }
    ],
    dismissable: true,
    icon: 'markdown'
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
