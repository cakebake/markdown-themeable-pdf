'use babel'

import {
  shouldDownload,
  downloadChromium,
  getWantedRevisionNumber
} from '../lib/api/convert/headlessChrome'

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.
//
// Tests are written with https://jasmine.github.io/1.3/introduction.html

describe('Chromium', () => {
  it('could get revision from puppeteer package.json', () => {
    expect(getWantedRevisionNumber).not.toThrow()
    const revision = getWantedRevisionNumber()
    expect(revision).toBeDefined()
  })
  it('checks chromium is downloaded', () => {
    let status = null
    const timeout = 54000 // 54000ms (15m)
    runs(async () => {
      try {
        let should = await shouldDownload()
        if (should) {
          await downloadChromium()
          should = await shouldDownload()
        }
        status = !should
      } catch (e) {
        status = false
        throw e
      }
    })
    waitsFor(() => {
      return status
    }, 'Should check if chromium is available or download chromium', timeout)
    runs(() => {
      expect(status).toBe(true)
    })
  })
})
