'use babel'

import { CHARSET } from '../lib/config'
import convert from '../lib/api/convert'
import { getCssFilePaths, getProjectRootPathByFilePath } from '../lib/atom'
import { getHighlightJsStylePathByName, readFile } from '../lib/api/filesystem'
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
import { get, escapeRegExp } from 'lodash'

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
    let content
    runs(async () => {
      try {
        convertedFilePath = await convert(markdownFilePath, 'html', options, cssFilePaths)
        content = await readFile(convertedFilePath, CHARSET)
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return content
    }, 'Should convert markdown')
    runs(() => {
      expect(existsSync(convertedFilePath)).toBe(true)
      expect(extname(convertedFilePath)).toBe('.html')
      expect(content).toMatch(escapeRegExp('<!DOCTYPE html>'))
    })
  })

  it(`converts to pdf`, () => {
    let convertedFilePath
    let content
    runs(async () => {
      try {
        convertedFilePath = await convert(markdownFilePath, 'pdf', options, cssFilePaths)
        content = await readFile(convertedFilePath, CHARSET)
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return content
    }, 'Should convert markdown')
    runs(() => {
      expect(existsSync(convertedFilePath)).toBe(true)
      expect(extname(convertedFilePath)).toBe('.pdf')
      expect(content).toMatch(escapeRegExp('═䑆ⴱ'))
    })
  })

  it(`converts to jpeg`, () => {
    let convertedFilePath
    let content
    runs(async () => {
      try {
        convertedFilePath = await convert(markdownFilePath, 'img', options, cssFilePaths)
        content = await readFile(convertedFilePath, CHARSET)
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return content
    }, 'Should convert markdown')
    runs(() => {
      expect(existsSync(convertedFilePath)).toBe(true)
      expect(extname(convertedFilePath)).toBe('.jpeg')
      expect(content).toMatch(escapeRegExp('￘￠'))
    })
  })

  it(`converts to png`, () => {
    let convertedFilePath
    let content
    runs(async () => {
      try {
        convertedFilePath = await convert(markdownFilePath, 'img', { ...options, imageExportFileType: 'png' }, cssFilePaths)
        content = await readFile(convertedFilePath, CHARSET)
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return content
    }, 'Should convert markdown')
    runs(() => {
      expect(existsSync(convertedFilePath)).toBe(true)
      expect(extname(convertedFilePath)).toBe('.png')
      expect(content).toMatch(escapeRegExp('‰PNG'))
    })
  })

})
