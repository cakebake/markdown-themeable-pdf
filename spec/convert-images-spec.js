'use babel'

import convert from '../lib/api/convert'
import { getCssFilePaths, getHeaderFilePath, getFooterFilePath } from '../lib/api/atom'
import { getHighlightJsStylePathByName, getDefaultExportFilePath } from '../lib/api/filesystem'
import {
  getOptions,
  getMarkdownTestFilePath,
  getCustomStylesPath,
  getCustomHeaderPath,
  getCustomFooterPath,
  getcodeHighlightingTheme,
  enableCodeHighlighting,
  getProjectRootPath
} from './_preset'
import { existsSync, removeSync } from 'fs-extra'
import { extname } from 'path'

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
      try {
        const options = getOptions()
        const projectRootPath = getProjectRootPath()
        const cssFilePaths = getCssFilePaths(
          getCustomStylesPath(),
          projectRootPath,
          enableCodeHighlighting() ? getHighlightJsStylePathByName(getcodeHighlightingTheme()) : null,
          'pdf'
        )
        const headerFilePath = getHeaderFilePath(getCustomHeaderPath(), projectRootPath)
        const footerFilePath = getFooterFilePath(getCustomFooterPath(), projectRootPath)
        const destinationPath = getDefaultExportFilePath(markdownFilePath, 'pdf')
        removeSync(destinationPath)
        expect(existsSync(destinationPath)).toBe(false)
        convertedFilePath = await convert(markdownFilePath, 'pdf', options, cssFilePaths, headerFilePath, footerFilePath, destinationPath)
      } catch (e) {
        throw e
      }
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
