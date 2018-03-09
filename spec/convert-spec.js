'use babel'

import convert from '../lib/api/convert'
import { getCssFilePaths } from '../lib/atom'
import { getHighlightJsStylePathByName, getDefaultExportFilePath } from '../lib/api/filesystem'
import {
  options,
  getMarkdownTestFilePath,
  getCustomStylesPath,
  getcodeHighlightingTheme,
  enableCodeHighlighting,
  getProjectRootPath
} from './_preset'
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

  const cssFilePaths = getCssFilePaths(
    getCustomStylesPath(),
    getProjectRootPath(),
    enableCodeHighlighting() ? getHighlightJsStylePathByName(getcodeHighlightingTheme()) : null
  )

  it(`converts to html`, () => {
    let convertedFilePath
    runs(async () => {
      try {
        const destinationPath = getDefaultExportFilePath(markdownFilePath, 'html')
        convertedFilePath = await convert(markdownFilePath, 'html', options, cssFilePaths, destinationPath)
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
        const destinationPath = getDefaultExportFilePath(markdownFilePath, 'pdf')
        convertedFilePath = await convert(markdownFilePath, 'pdf', options, cssFilePaths, destinationPath)
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
        const destinationPath = getDefaultExportFilePath(markdownFilePath, 'jpeg')
        convertedFilePath = await convert(markdownFilePath, 'jpeg', options, cssFilePaths, destinationPath)
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
        const destinationPath = getDefaultExportFilePath(markdownFilePath, 'png')
        convertedFilePath = await convert(markdownFilePath, 'png', options, cssFilePaths, destinationPath)
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
