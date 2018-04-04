'use babel'

import { launch, createBrowserFetcher } from 'puppeteer'
import { convert } from 'units-css'
import { get, round, isFinite } from 'lodash'
import { dirname, join } from 'path'

let browser

export const SUPPORTED_UNITS = [ 'mm', 'cm', 'in', 'px' ]

export const SUPPORTED_FORMATS = [
  { value: 'Letter', description: 'Letter (8.5in x 11in)' },
  { value: 'Legal', description: 'Legal (8.5in x 14in)' },
  { value: 'Tabloid', description: 'Tabloid (11in x 17in)' },
  { value: 'Ledger', description: 'Ledger (17in x 11in)' },
  { value: 'A0', description: 'A0 (33.1in x 46.8in)' },
  { value: 'A1', description: 'A1 (23.4in x 33.1in)' },
  { value: 'A2', description: 'A2 (16.5in x 23.4in)' },
  { value: 'A3', description: 'A3 (11.7in x 16.5in)' },
  { value: 'A4', description: 'A4 (8.27in x 11.7in)' },
  { value: 'A5', description: 'A5 (5.83in x 8.27in)' },
  { value: 'A6', description: 'A6 (4.13in x 5.83in)' }
]

export const pdf = (htmlDocument, options) => {
  return new Promise(async (resolve, reject) => {
    try {
      const page = await openPage(htmlDocument)
      let format = get(options, 'format')
      let width = get(options, 'width')
      let height = get(options, 'height')
      if (!width && height) {
        width = height
      }
      if (!height && width) {
        height = width
      }
      if (width && height) {
        format = undefined
      } else {
        width = undefined
        height = undefined
      }
      const buffer = await page.pdf({
        ...options,
        displayHeaderFooter: !get(options, 'headerTemplate') && !get(options, 'footerTemplate') ? false : get(options, 'displayHeaderFooter', true),
        format,
        width,
        height,
        printBackground: true
      })
      await closePage()
      resolve(buffer)
    } catch (e) {
      reject(e)
    }
  })
}

export const capture = (htmlDocument, options) => {
  return new Promise(async (resolve, reject) => {
    try {
      const page = await openPage(htmlDocument)
      let width = await toPx(get(options, 'width'))
      let height = await toPx(get(options, 'height'))
      if (!width && height) {
        width = height
      }
      if (!height && width) {
        height = width
      }
      if (width && height) {
        await page.setViewport({ width, height })
      }
      const buffer = await page.screenshot({
        ...options,
        fullPage: true
      })
      await closePage()
      resolve(buffer)
    } catch (e) {
      reject(e)
    }
  })
}

const openPage = (htmlDocument) => {
  return new Promise(async (resolve, reject) => {
    try {
      browser = await launch({
        ignoreHTTPSErrors: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--hide-scrollbars'
        ]
      })
      const page = await browser.newPage()
      await page.setCacheEnabled(false)
      await page.emulateMedia('screen')
      await page.goto(`data:text/html,${htmlDocument}`)
      resolve(page)
    } catch (e) {
      reject(e)
    }
  })
}

const closePage = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await browser.close()
      resolve()
    } catch (e) {
      reject(e)
    }
  })
}

export const shouldDownload = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = true
      const browserFetcher = createBrowserFetcher()
      const localRevisions = await browserFetcher.localRevisions()
      if (localRevisions.length) {
        const revision = getWantedRevisionNumber()
        for (var i = 0; i < localRevisions.length; i++) {
          if (localRevisions[i] === revision) {
            result = false
            break
          }
        }
      }
      resolve(result)
    } catch (e) {
      reject(e)
    }
  })
}

export const downloadChromium = (progressCallback) => {
  return new Promise(async (resolve, reject) => {
    try {
      const browserFetcher = createBrowserFetcher()
      const revision = await browserFetcher.download(getWantedRevisionNumber(), progressCallback)
      resolve(revision)
    } catch (e) {
      reject(e)
    }
  })
}

const getWantedRevisionNumber = (fallback = '123') => {
  try {
    const path = join(dirname(require.resolve('puppeteer')), 'package.json')
    const info = require(path)
    return get(info, 'puppeteer.chromium_revision', fallback)
  } catch (e) {
    console.error(e)
  }
  return fallback
}

const toPx = (val) => {
  return new Promise((resolve, reject) => {
    if (val && !isFinite(val)) {
      try {
        const px = round(convert('px', val))
        resolve(px)
      } catch (e) {
        reject(e)
      }
    } else {
      resolve(val)
    }
  })
}
