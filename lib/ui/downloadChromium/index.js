'use babel'

import { notification, isPackageLoaded } from '../../atom'
import { openExternal } from '../../electron'
import { shouldDownload } from '../../api/convert/headlessChrome'
import { PACKAGE_NAME, PACKAGE_VERSION } from '../../config'
import download from './download'

let active = false

const prompt = () => {
  return new Promise(async (resolve, reject) => {
    if (await shouldDownload()) {
      if (!active) {
        if (isPackageLoaded('notifications')) {
          active = true
          let shouldCallDownload = false
          const model = notification(
            `Please download dependencies`,
            'info',
            {
              description: `<div>
                <strong>Newest Chromium is required to create Image or PDF documents with Puppeteer!</strong>
                <br />
                ${PACKAGE_NAME} v${PACKAGE_VERSION} bundles Chromium to ensure that the latest features it uses are guaranteed to be available.
              </div>`,
              buttons: [
                {
                  text: 'Start Download',
                  onDidClick: () => {
                    shouldCallDownload = true
                    model.dismiss()
                  },
                  className: `btn btn-success icon icon-cloud-download`
                },
                {
                  text: 'FAQ',
                  onDidClick: ({ target }) => {
                    target.blur()
                    openExternal('https://github.com/GoogleChrome/puppeteer#faq')
                  }
                }
              ],
              dismissable: true,
              icon: 'markdown'
            }
          )
          model.onDidDismiss(async () => {
            if (shouldCallDownload) {
              try {
                const { revision } = await download()
                notification(`The download is complete! You can now use ${PACKAGE_NAME} v${PACKAGE_VERSION} with Chromium r${revision}`, 'success')
                resolve(true)
              } catch (e) {
                reject(e)
              }
            } else {
              resolve(false)
            }
            active = false
          })
        } else {
          const confirm = window.confirm(`Install dependencies for ${PACKAGE_NAME} v${PACKAGE_VERSION} in background. Please do not close the editor!`)
          if (confirm) {
            try {
              const { revision } = await download()
              window.alert(`Successfully downloaded chromium r${revision}`)
              resolve(true)
            } catch (e) {
              reject(e)
            }
          } else {
            resolve(false)
          }
          active = false
        }
      } else {
        resolve(false)
      }
    } else {
      resolve(true)
    }
  })
}

export default prompt
