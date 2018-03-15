'use babel'

import { launch } from 'puppeteer'
// import { convert, parse } from 'units-css'
import { get } from 'lodash'

let browser

export const SUPPORTED_UNITS = [ 'mm', 'cm', 'in', 'pc', 'pt', 'px' ]

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
      const page = await open(htmlDocument)
      const buffer = await page.pdf({
        ...options,
        printBackground: true
      })
      await close()
      resolve(buffer)
    } catch (e) {
      reject(e)
    }
  })
}

export const capture = (htmlDocument, options) => {
  return new Promise(async (resolve, reject) => {
    try {
      const page = await open(htmlDocument)
      const width = get(options, 'width')
      const height = get(options, 'height')
      if (width) {
        await page.setViewport({ width, height })
      }
      const buffer = await page.screenshot({
        ...options,
        fullPage: true
      })
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
      const version = await browser.version()
      const page = await browser.newPage()
      await page.setCacheEnabled(false)
      await page.emulateMedia('screen')
      await page.goto(`data:text/html,${htmlDocument}`)
      console.log(`Convert with ${version}`)
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
//
// const toPx = (val) => {
//   const check = parse(val)
//   // throw or reject?
//   console.log(check)
//   val = convert('px', val)
//   console.log('val', val);
//   return val
// }
