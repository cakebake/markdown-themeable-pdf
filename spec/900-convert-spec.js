'use babel'

import convert from '../lib/api/convert'
import { getCssFilePaths, getHeaderFilePath, getFooterFilePath } from '../lib/api/atom'
import { getDefaultExportFilePath } from '../lib/api/filesystem'
import { getHighlightJsStylePathByName } from '../lib/theme/highlightJs'
import {
  getOptions,
  getMarkdownTestFilePath,
  getCustomStylesPath,
  getCustomHeaderPath,
  getCustomFooterPath,
  getCodeHighlightingTheme,
  enableCodeHighlighting,
  getProjectRootPath
} from './_preset'
import { existsSync, removeSync } from 'fs-extra'
import { extname } from 'path'
import { set } from 'lodash'

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.
//
// Tests are written with https://jasmine.github.io/1.3/introduction.html

describe('Convert', () => {
  const timeout = 15000
  const markdownFilePath = getMarkdownTestFilePath('Demo.md')

  it(`converts to html`, () => {
    let convertedFilePath
    runs(async () => {
      const options = getOptions()
      const cssFilePaths = getCssFilePaths(
        getCustomStylesPath(),
        getProjectRootPath(),
        enableCodeHighlighting() ? getHighlightJsStylePathByName(getCodeHighlightingTheme()) : null,
        'html'
      )
      const destinationPath = getDefaultExportFilePath(markdownFilePath, 'html')
      removeSync(destinationPath)
      expect(existsSync(destinationPath)).toBe(false)
      convertedFilePath = await convert(markdownFilePath, 'html', options, cssFilePaths, null, null, destinationPath)
    })
    waitsFor(() => {
      return convertedFilePath
    }, 'Should convert markdown', timeout)
    runs(() => {
      expect(existsSync(convertedFilePath)).toBe(true)
      expect(extname(convertedFilePath)).toBe('.html')
    })
  })

  it(`converts to pdf`, () => {
    let convertedFilePath
    let headerFilePath
    let footerFilePath
    // const getSizeOfPdf = (filePath) => {
    //   const content = readFileSync(filePath, 'latin1')
    //   const pages = content.match(/\/Type[\s]*\/Page[^s]/g).length
    //   return {
    //     pages
    //   }
    // }
    runs(async () => {
      const options = getOptions()
      const projectRootPath = getProjectRootPath()
      const cssFilePaths = getCssFilePaths(
        getCustomStylesPath(),
        projectRootPath,
        enableCodeHighlighting() ? getHighlightJsStylePathByName(getCodeHighlightingTheme()) : null,
        'pdf'
      )
      headerFilePath = getHeaderFilePath(getCustomHeaderPath(), projectRootPath)
      footerFilePath = getFooterFilePath(getCustomFooterPath(), projectRootPath)
      const destinationPath = getDefaultExportFilePath(markdownFilePath, 'pdf')
      removeSync(destinationPath)
      expect(existsSync(destinationPath)).toBe(false)
      convertedFilePath = await convert(markdownFilePath, 'pdf', options, cssFilePaths, headerFilePath, footerFilePath, destinationPath)
    })
    waitsFor(() => {
      return convertedFilePath
    }, 'Should convert markdown', timeout)
    runs(() => {
      expect(existsSync(headerFilePath)).toBe(true)
      expect(existsSync(footerFilePath)).toBe(true)
      expect(existsSync(convertedFilePath)).toBe(true)
      expect(extname(convertedFilePath)).toBe('.pdf')
      // expect(getSizeOfPdf(convertedFilePath).pages).toBe(8)
    })
  })

  it(`converts to jpeg`, () => {
    let convertedFilePath
    runs(async () => {
      const options = getOptions()
      set(options, 'html.enableTOC', false)
      set(options, 'html.enableAnchor', false)
      const cssFilePaths = getCssFilePaths(
        getCustomStylesPath(),
        getProjectRootPath(),
        enableCodeHighlighting() ? getHighlightJsStylePathByName(getCodeHighlightingTheme()) : null,
        'jpeg'
      )
      const destinationPath = getDefaultExportFilePath(markdownFilePath, 'jpeg')
      removeSync(destinationPath)
      expect(existsSync(destinationPath)).toBe(false)
      convertedFilePath = await convert(markdownFilePath, 'jpeg', options, cssFilePaths, null, null, destinationPath)
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
      const options = getOptions()
      set(options, 'html.enableTOC', false)
      set(options, 'html.enableAnchor', false)
      const cssFilePaths = getCssFilePaths(
        getCustomStylesPath(),
        getProjectRootPath(),
        enableCodeHighlighting() ? getHighlightJsStylePathByName(getCodeHighlightingTheme()) : null,
        'png'
      )
      const destinationPath = getDefaultExportFilePath(markdownFilePath, 'png')
      removeSync(destinationPath)
      expect(existsSync(destinationPath)).toBe(false)
      convertedFilePath = await convert(markdownFilePath, 'png', options, cssFilePaths, null, null, destinationPath)
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
