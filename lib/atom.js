'use babel'

import { get, startsWith } from 'lodash'
import { existsSync } from 'fs'
import { join, resolve, sep } from 'path'
import { config, PACKAGE_NAME } from './config'
import { openExternal } from './electron'
import { downloadChromium, shouldDownload, deleteOldChromiumRevisions } from './api/convert/headlessChrome'

export const openInWorkspace = (fullPath) => atom.workspace.open(fullPath, { searchAllPanes: true })

export const isPackageLoaded = (name) => atom.packages.isPackageLoaded(name)

export const observeTextEditors = (callback) => atom.workspace.observeTextEditors(callback)

export const addCommand = (scope, commands) => atom.commands.add(scope, commands)

export const getActiveTextEditor = () => atom.workspace.getActiveTextEditor()

export const getHeaderFilePath = (customPath, projectRootPath) => getCustomConfigFilePath(customPath, projectRootPath)

export const getFooterFilePath = (customPath, projectRootPath) => getCustomConfigFilePath(customPath, projectRootPath)

export const getCssFilePaths = (customPath, projectRootPath, highlightJsStylePath = null, type) => {
  const files = []
  if (highlightJsStylePath && existsSync(highlightJsStylePath)) {
    files.push(highlightJsStylePath)
  }
  files.push(resolve(__dirname, './css/document.css'))
  // files.push(resolve(__dirname, '../node_modules/bootstrap/dist/css/bootstrap.min.css'))
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
      break
    case 'warning':
      n = atom.notifications.addWarning(PACKAGE_NAME, { ...options, detail, icon: 'markdown' })
      break
    case 'success':
      n = atom.notifications.addSuccess(PACKAGE_NAME, { ...options, detail, icon: 'markdown' })
      break
    default:
      n = atom.notifications.addInfo(PACKAGE_NAME, { ...options, detail, icon: 'markdown' })
  }
  return n
}

export const downloadChromiumNotification = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const revisionStatus = await shouldDownload()
      if (revisionStatus !== 0) {
        let ui
        let success = false
        let detail = ''
        let description = ''
        let started = 0

        const progressId = `${PACKAGE_NAME}-dl-progress`
        const progressBarId = `${PACKAGE_NAME}-dl-progress-bar`
        const progressValueId = `${PACKAGE_NAME}-dl-progress-value`

        const formatBytes = (bytes, decimals) => {
          if (bytes === 0) {
            return '0 Bytes'
          }
          const k = 1024
          const dm = decimals || 2
          const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
          const i = Math.floor(Math.log(bytes) / Math.log(k))
          return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
        }

        const download = ({ target, path }) => {
          target.blur()
          if (started === 0) {
            const progressElement = document.getElementById(progressId)
            const progressBarElement = document.getElementById(progressBarId)
            const progressValueElement = document.getElementById(progressValueId)
            const progressCallback = (downloadedBytes, totalBytes) => {
              progressValueElement.innerHTML = `${formatBytes(downloadedBytes, 1)} / ${formatBytes(totalBytes, 1)}`
              progressBarElement.setAttribute('value', downloadedBytes)
              progressBarElement.setAttribute('max', totalBytes)
              progressElement.style.display = 'block'
            }
            started = 1
            target.setAttribute('disabled', 'disabled')
            target.classList.remove('icon-cloud-download')
            target.classList.add('icon-sync')
            path.forEach((elem) => {
              if (typeof elem.classList !== 'undefined' && elem.classList.contains('has-close')) {
                const close = elem.getElementsByClassName('close')
                const closeAll = elem.getElementsByClassName('close-all')
                if (close.length) {
                  close[0].style.display = 'none'
                }
                if (closeAll.length) {
                  closeAll[0].style.display = 'none'
                }
              }
            })
            downloadChromium(progressCallback)
              .then(async ({ revision }) => {
                success = true
                ui.dismiss()
                notification(`The download is complete! You can now use ${PACKAGE_NAME} with Chromium ${revision}`, 'success')
                const old = await deleteOldChromiumRevisions()
                if (old.length) {
                  old.forEach((oldRevision) => {
                    notification(`The old Chromium revision ${oldRevision} has been removed`)
                  })
                }
              })
              .catch((e) => {
                success = false
                ui.dismiss()
                notification(e, 'error')
              })
          }
        }

        const faq = ({ target }) => {
          target.blur()
          openExternal('https://github.com/GoogleChrome/puppeteer#faq')
        }

        if (revisionStatus !== 1) {
          detail += `A new Chromium version is available for download. Please start the update to revision ${revisionStatus}.\n`
        } else {
          detail += 'Chromium is required to create image captures and PDF documents from your Markdown files.\n'
        }
        detail += `${PACKAGE_NAME} bundles Chromium to ensure that the latest features it uses are guaranteed to be available.`
        description += `<div id="${progressId}" style="display: none;">`
        description += `<progress id="${progressBarId}" class="block" style="width: 100%;"></progress>`
        description += `<span id="${progressValueId}" class="inline-block highlight-info">0 bytes / 0 bytes</span>`
        description += `</div>`

        ui = notification(detail, 'info', {
          description,
          buttons: [
            { text: 'Start Download', onDidClick: download, className: `btn btn-success icon icon-cloud-download` },
            { text: 'FAQ', onDidClick: faq, className: `btn btn-info icon icon-info` }
          ],
          dismissable: true,
          icon: 'markdown'
        })

        ui.onDidDismiss(() => {
          resolve(success)
          if (!success) {
            notification(`The download notification will reappear the next time you use ${PACKAGE_NAME}`)
          }
        })
      } else {
        resolve(true)
      }
    } catch (e) {
      reject(e)
    }
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
