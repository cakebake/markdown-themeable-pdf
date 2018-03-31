'use babel'

import convert from '../lib/api/convert'
import { getCssFilePaths } from '../lib/theme'
import { getDefaultExportFilePath } from '../lib/api/filesystem'
import {
  getOptions,
  getMarkdownTestFilePath,
  getCustomStylesPath,
  getProjectRootPath
} from './_preset'
import { existsSync, removeSync } from 'fs-extra'
import { extname } from 'path'
import sizeOf from 'image-size'
import { set } from 'lodash'

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.
//
// Tests are written with https://jasmine.github.io/1.3/introduction.html

describe('Convert format', () => {
  const timeout = 15000
  const markdownFilePath = getMarkdownTestFilePath('small.md')

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
      { width: '200mm', height: '200mm', pxWidth: 756, pxHeight: 756 },
      { width: '200mm', height: '', pxWidth: 756, pxHeight: 756 },
      { width: '', height: '200mm', pxWidth: 756, pxHeight: 756 }
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
      const cssFilePaths = getCssFilePaths(
        getCustomStylesPath(),
        getProjectRootPath(),
        type
      )
      const destinationPath = getDefaultExportFilePath(markdownFilePath, type)
      for (let i = 0; i < sizes.length; i++) {
        const o = options(sizes[i].width, sizes[i].height, type)
        const dest = `${destinationPath}.${i}.${type}`
        removeSync(dest)
        expect(existsSync(dest)).toBe(false)
        converted.push(await convert(markdownFilePath, type, o, cssFilePaths, null, null, dest))
      }
      fin = true
    })
    waitsFor(() => {
      return fin
    }, 'Should convert markdown to different sizes', timeout)
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
