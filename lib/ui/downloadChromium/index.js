'use babel'

import { notification } from '../../atom'
import { openExternal } from '../../electron'
import { shouldDownload } from '../../api/convert/headlessChrome'
import { PACKAGE_NAME, PACKAGE_VERSION } from '../../config'
import download from './download'

let active = false

const prompt = () => {
  return new Promise(async (resolve, reject) => {
    if (await shouldDownload()) {
      if (!active) {
        active = true
        let shouldCallDownload = false
        const model = notification(
          'Newest Chromium is required to create Image or PDF documents with Puppeteer!',
          'info',
          {
            description: `Puppeteer bundles Chromium to ensure that the latest features it uses are guaranteed to be available.`,
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
              const revision = await download()
              notification(`The download is complete! You can now use ${PACKAGE_NAME} v${PACKAGE_VERSION} with Chromium r${revision}`, 'success')
              active = false
              resolve(true)
            } catch (e) {
              reject(e)
            }
          } else {
            active = false
            resolve(false)
          }
        })
      } else {
        resolve(false)
      }
    } else {
      resolve(true)
    }
  })
}

export default prompt
