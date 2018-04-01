'use babel'

import convert from '../lib/convert'
import { getDefaultExportFilePath } from '../lib/api/filesystem'
import { existsSync, removeSync } from 'fs-extra'
import { extname } from 'path'
import { getOptions, getMarkdownTestFilePath } from './_preset'

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.
//
// Tests are written with https://jasmine.github.io/1.3/introduction.html

describe('Convert images', () => {
  const timeout = 15000
  const markdownFilePath = getMarkdownTestFilePath('image.md')

  it(`converts to pdf`, () => {
    let convertedFilePath
    runs(async () => {
      const options = getOptions()
      const destinationPath = getDefaultExportFilePath(markdownFilePath, 'pdf')
      removeSync(destinationPath)
      expect(existsSync(destinationPath)).toBe(false)
      convertedFilePath = await convert(markdownFilePath, destinationPath, 'pdf', options)
    })
    waitsFor(() => {
      return convertedFilePath
    }, 'Should convert markdown', timeout)
    runs(() => {
      expect(existsSync(convertedFilePath)).toBe(true)
      expect(extname(convertedFilePath)).toBe('.pdf')
    })
  })
})
