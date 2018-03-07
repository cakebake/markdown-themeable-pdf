'use babel'

import convert from '../lib/api/convert'
import { options, getMarkdownTestFilePath } from './_preset'
import { existsSync } from 'fs'
import { extname } from 'path'

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.
//
// Tests are written with https://jasmine.github.io/1.3/introduction.html

describe('Convert', () => {

  const markdownFilePath = getMarkdownTestFilePath('Demo.md')

  it(`converts to html`, () => {
    let convertedFilePath
    runs(async () => {
      try {
        convertedFilePath = await convert(markdownFilePath, 'html', options)
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return convertedFilePath
    }, 'Should convert markdown')
    runs(() => {
      expect(existsSync(convertedFilePath)).toBe(true)
      expect(extname(convertedFilePath)).toBe('.html')
    })
  })

  it(`converts to pdf`, () => {
    let convertedFilePath
    runs(async () => {
      try {
        convertedFilePath = await convert(markdownFilePath, 'pdf', options)
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return convertedFilePath
    }, 'Should convert markdown')
    runs(() => {
      expect(existsSync(convertedFilePath)).toBe(true)
      expect(extname(convertedFilePath)).toBe('.pdf')
    })
  })

  it(`converts to jpeg`, () => {
    let convertedFilePath
    runs(async () => {
      try {
        convertedFilePath = await convert(markdownFilePath, 'img', options)
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return convertedFilePath
    }, 'Should convert markdown')
    runs(() => {
      expect(existsSync(convertedFilePath)).toBe(true)
      expect(extname(convertedFilePath)).toBe('.jpeg')
    })
  })

  it(`converts to png`, () => {
    let convertedFilePath
    runs(async () => {
      try {
        convertedFilePath = await convert(markdownFilePath, 'img', { ...options, imageExportFileType: 'png' })
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return convertedFilePath
    }, 'Should convert markdown')
    runs(() => {
      expect(existsSync(convertedFilePath)).toBe(true)
      expect(extname(convertedFilePath)).toBe('.png')
    })
  })

})
