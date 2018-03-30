'use babel'

import { notification } from '../../atom'
import { downloadChromium } from '../../api/convert/headlessChrome'

const downloadNotification = () => {
  return new Promise(async (resolve, reject) => {
    let view
    let viewContent
    let viewTitle
    let revision
    const download = notification('Downloading Chromium', 'info', {
      dismissable: true
    })
    download.onDidDismiss(() => {
      if (!revision) {
        notification('Please do not close the editor! The download will continue in the background.', 'warning')
      }
    })
    try {
      try {
        view = atom.views.getView(download).element
        viewContent = view.querySelector('.detail-content')
        viewTitle = viewContent.querySelector('.line')
        view.querySelector('.close').style.display = 'none'
        document.querySelectorAll('.close-all').forEach((element) => {
          element.style.display = 'none'
        })
      } catch (_) {}
      const progress = document.createElement('progress')
      const bytes = document.createElement('span')
      if (viewContent) {
        progress.style.width = '100%'
        viewContent.appendChild(progress)
      }
      if (viewTitle) {
        bytes.style.float = 'right'
        viewTitle.appendChild(bytes)
      }
      revision = await downloadChromium((downloadedBytes, totalBytes) => {
        bytes.innerHTML = ` ${formatBytes(downloadedBytes)} / ${formatBytes(totalBytes)}`
        progress.setAttribute('max', totalBytes)
        progress.setAttribute('value', downloadedBytes)
      })
      download.dismiss()
      resolve(revision)
    } catch (e) {
      reject(e)
    }
  })
}

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

export default downloadNotification
