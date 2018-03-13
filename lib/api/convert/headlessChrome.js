'use babel'

import { launch } from 'puppeteer'

let browser

export const pdf = (htmlDocument, options) => {
  return new Promise(async (resolve, reject) => {
    try {
      const page = await open(htmlDocument)
      const buffer = await page.pdf(options)
      await close()
      resolve(buffer)
    } catch (e) {
      reject(e)
    }
  })
}

const open = (htmlDocument) => {
  return new Promise(async (resolve, reject) => {
    try {
      browser = await launch({
        ignoreHTTPSErrors: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      })
      const page = await browser.newPage()
      await page.goto(`data:text/html,${htmlDocument}`, {
        waitUntil: [ 'load', 'networkidle0' ]
      })
      page.emulateMedia('screen')
      resolve(page)
    } catch (e) {
      reject(e)
    }
  })
}

const close = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await browser.close()
      resolve()
    } catch (e) {
      reject(e)
    }
  })
}
