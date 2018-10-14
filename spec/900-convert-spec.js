'use babel'

import convert from '../lib/convert'
import { getDefaultExportFilePath } from '../lib/api/filesystem'
import { existsSync, removeSync, readFileSync } from 'fs-extra'
import { extname } from 'path'
import { set } from 'lodash'
import { getOptions, getMarkdownTestFilePath } from './_preset'

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.
//
// Tests are written with https://jasmine.github.io/1.3/introduction.html

describe('Convert demo', () => {
  const timeout = 300000
  const markdownFilePath = getMarkdownTestFilePath('Demo.md')

  it(`converts to html`, () => {
    let convertedFilePath
    runs(async () => {
      const type = 'html'
      const options = getOptions()
      const destinationPath = getDefaultExportFilePath(markdownFilePath, type)
      removeSync(destinationPath)
      expect(existsSync(destinationPath)).toBe(false)
      convertedFilePath = await convert(markdownFilePath, destinationPath, type, options)
    })
    waitsFor(() => {
      return convertedFilePath
    }, 'Should convert markdown', timeout)
    runs(() => {
      expect(existsSync(convertedFilePath)).toBe(true)
      expect(extname(convertedFilePath)).toBe('.html')
    })
  })

  fit(`converts to pdf`, () => {
    let convertedFilePath
    const getSizeOfPdf = (filePath) => {
      const content = readFileSync(filePath, 'latin1')
      const pages = content.match(/\/Type[\s]*\/Page[^s]/g).length
      return {
        pages
      }
    }
    runs(async () => {
      const type = 'pdf'
      const options = getOptions()
      const destinationPath = getDefaultExportFilePath(markdownFilePath, type)
      removeSync(destinationPath)
      expect(existsSync(destinationPath)).toBe(false)
      convertedFilePath = await convert(markdownFilePath, destinationPath, type, options)
    })
    waitsFor(() => {
      return convertedFilePath
    }, 'Should convert markdown', timeout)
    runs(() => {
      expect(existsSync(convertedFilePath)).toBe(true)
      expect(extname(convertedFilePath)).toBe('.pdf')
      expect(getSizeOfPdf(convertedFilePath).pages).toBeGreaterThan(2)
    })
  })

  it(`converts to jpeg`, () => {
    let convertedFilePath
    runs(async () => {
      const type = 'jpeg'
      const options = getOptions()
      set(options, 'html.enableTOC', false)
      set(options, 'html.enableAnchor', false)
      const destinationPath = getDefaultExportFilePath(markdownFilePath, type)
      removeSync(destinationPath)
      expect(existsSync(destinationPath)).toBe(false)
      convertedFilePath = await convert(markdownFilePath, destinationPath, type, options)
    })
    waitsFor(() => {
      return convertedFilePath
    }, 'Should convert markdown', timeout)
    runs(() => {
      expect(existsSync(convertedFilePath)).toBe(true)
      expect(extname(convertedFilePath)).toBe('.jpeg')
    })
  })

  it(`converts to png`, () => {
    let convertedFilePath
    runs(async () => {
      const type = 'png'
      const options = getOptions()
      set(options, 'html.enableTOC', false)
      set(options, 'html.enableAnchor', false)
      const destinationPath = getDefaultExportFilePath(markdownFilePath, type)
      removeSync(destinationPath)
      expect(existsSync(destinationPath)).toBe(false)
      convertedFilePath = await convert(markdownFilePath, destinationPath, type, options)
    })
    waitsFor(() => {
      return convertedFilePath
    }, 'Should convert markdown', timeout)
    runs(() => {
      expect(existsSync(convertedFilePath)).toBe(true)
      expect(extname(convertedFilePath)).toBe('.png')
    })
  })
})
