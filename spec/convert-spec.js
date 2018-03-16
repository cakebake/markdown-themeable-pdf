'use babel'

import convert from '../lib/api/convert'
import { getCssFilePaths } from '../lib/atom'
import { getHighlightJsStylePathByName, getDefaultExportFilePath } from '../lib/api/filesystem'
import {
  getOptions,
  getMarkdownTestFilePath,
  getCustomStylesPath,
  getcodeHighlightingTheme,
  enableCodeHighlighting,
  getProjectRootPath
} from './_preset'
import { existsSync } from 'fs'
import { extname } from 'path'
import { set } from 'lodash'
import sizeOf from 'image-size'

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.
//
// Tests are written with https://jasmine.github.io/1.3/introduction.html

describe('Convert', () => {

  const markdownFilePath = getMarkdownTestFilePath('Demo.md')
  const markdownFilePathSmall = getMarkdownTestFilePath('small.md')

  it(`converts to html`, () => {
    let convertedFilePath
    runs(async () => {
      try {
        const options = getOptions()
        const cssFilePaths = getCssFilePaths(
          getCustomStylesPath(),
          getProjectRootPath(),
          enableCodeHighlighting() ? getHighlightJsStylePathByName(getcodeHighlightingTheme()) : null,
          'html'
        )
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
        const options = getOptions()
        const cssFilePaths = getCssFilePaths(
          getCustomStylesPath(),
          getProjectRootPath(),
          enableCodeHighlighting() ? getHighlightJsStylePathByName(getcodeHighlightingTheme()) : null,
          'pdf'
        )
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
        const options = getOptions()
        set(options, 'html.enableTOC', false)
        set(options, 'html.enableAnchor', false)
        const cssFilePaths = getCssFilePaths(
          getCustomStylesPath(),
          getProjectRootPath(),
          enableCodeHighlighting() ? getHighlightJsStylePathByName(getcodeHighlightingTheme()) : null,
          'jpeg'
        )
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
        const options = getOptions()
        set(options, 'html.enableTOC', false)
        set(options, 'html.enableAnchor', false)
        const cssFilePaths = getCssFilePaths(
          getCustomStylesPath(),
          getProjectRootPath(),
          enableCodeHighlighting() ? getHighlightJsStylePathByName(getcodeHighlightingTheme()) : null,
          'png'
        )
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
  it(`converts to image width different sizes and units`, () => {
    let fin = false
    const type = 'jpeg'
    const converted = []
    const sizes = [
      { width: '', height: '', pxWidth: 800, pxHeight: 600 },
      { width: 250, height: 190, pxWidth: 250, pxHeight: 190 },
      { width: '250px', height: '190px', pxWidth: 250, pxHeight: 190 },
      { width: '5cm', height: '5cm', pxWidth: 189, pxHeight: 189 },
      { width: '2.3in', height: '1.3in', pxWidth: 221, pxHeight: 125 },
      { width: '200mm', height: '200mm', pxWidth: 756, pxHeight: 756 }
    ]
    const options = (width, height, type) => {
      let o = getOptions()
      set(o, 'html.enableTOC', false)
      set(o, 'html.enableAnchor', false)
      set(o, `${type}.width`, width)
      set(o, `${type}.height`, height)
      return o
    }
    runs(async () => {
      try {
        const cssFilePaths = getCssFilePaths(
          getCustomStylesPath(),
          getProjectRootPath(),
          enableCodeHighlighting() ? getHighlightJsStylePathByName(getcodeHighlightingTheme()) : null,
          type
        )
        const destinationPath = getDefaultExportFilePath(markdownFilePathSmall, type)
        for (let i = 0; i < sizes.length; i++) {
          const o = options(sizes[i].width, sizes[i].height, type)
          converted.push(await convert(markdownFilePathSmall, type, o, cssFilePaths, `${destinationPath}.${i}.${type}`))
        }
        fin = true
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return fin
    }, 'Should convert markdown to different sizes')
    runs(async () => {
      expect(fin).toBe(true)
      expect(converted.length).toBe(sizes.length)
      for (var i = 0; i < converted.length; i++) {
        const info = sizeOf(converted[i])
        expect(existsSync(converted[i])).toBe(true)
        expect(extname(converted[i])).toBe(`.${type}`)
        expect(sizes[i].pxWidth).toBe(info.width)
        expect(sizes[i].pxHeight).toBe(info.height)
      }
    })
  })

})
