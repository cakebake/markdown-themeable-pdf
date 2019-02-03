'use babel'

import {
  removeOptionsFromContent,
  addOptionsToContent,
  getMatterDelimiters,
  getOptionsFromContent,
  mergeOptionsWithFileOptions
} from '../lib/api/atom/customOptions'
import { escapeRegExp } from 'lodash'
import { getMarkdownTestFilePath } from './_preset'

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.
//
// Tests are written with https://jasmine.github.io/1.3/introduction.html

describe('Custom options', () => {
  it('should insert front matter to content', () => {
    let contentWithOptions = ''
    const [startDelimiter, endDelimiter] = getMatterDelimiters()
    const options = { lorem: 1, ipsum: 2 }
    const content = [
      '# markdown',
      'with some content'
    ].join('\n')
    runs(async () => {
      try {
        contentWithOptions = await addOptionsToContent(content, options)
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return contentWithOptions
    }, 'Should add front matter')
    runs(() => {
      expect(contentWithOptions).toMatch(escapeRegExp(startDelimiter))
      expect(contentWithOptions).toMatch(escapeRegExp(endDelimiter))
      expect(contentWithOptions).toMatch(escapeRegExp('lorem: 1'))
      expect(contentWithOptions).toMatch(escapeRegExp('ipsum: 2'))
    })
  })
  it('should remove front matter from content', () => {
    let contentNoOptions = ''
    const [startDelimiter, endDelimiter] = getMatterDelimiters()
    const content = [
      startDelimiter,
      'lorem: 1',
      'ipsum: 2',
      endDelimiter,
      '# markdown',
      'with some content'
    ].join('\n')
    runs(async () => {
      try {
        contentNoOptions = await removeOptionsFromContent(content)
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return contentNoOptions
    }, 'Should remove front matter')
    runs(() => {
      expect(contentNoOptions).not.toMatch(escapeRegExp(startDelimiter))
      expect(contentNoOptions).not.toMatch(escapeRegExp(endDelimiter))
      expect(contentNoOptions).not.toMatch(escapeRegExp('lorem: 1'))
      expect(contentNoOptions).not.toMatch(escapeRegExp('ipsum: 2'))
    })
  })
  it('should read front matter from content', () => {
    let options = null
    const [startDelimiter, endDelimiter] = getMatterDelimiters()
    const content = [
      startDelimiter,
      'lorem: 1',
      'ipsum: 2',
      endDelimiter,
      '# markdown',
      'with some content'
    ].join('\n')
    runs(async () => {
      try {
        options = await getOptionsFromContent(content)
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return options
    }, 'Should get front matter')
    runs(() => {
      expect(options).toEqual({ lorem: 1, ipsum: 2 })
    })
  })
  it('should merge front matter from file', () => {
    let options = null
    const preOpts = { lorem: 1, ipsum: 2, dolor: 3 }
    const filePath = getMarkdownTestFilePath('front-matter.md')
    runs(async () => {
      try {
        options = await mergeOptionsWithFileOptions(filePath, preOpts)
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return options
    }, 'Should merge options with front matter')
    runs(() => {
      expect(options).toEqual({ lorem: 1, ipsum: 10, dolor: 3 })
    })
  })
  // it(`should overwrite options with custom options on convert`, () => {
  //   let convertedFilePath
  //   const markdownFilePath = getMarkdownTestFilePath('front-matter.md')
  //   runs(async () => {
  //     const type = 'pdf'
  //     const options = getOptions()
  //     const destinationPath = getDefaultExportFilePath(markdownFilePath, type)
  //     removeSync(destinationPath)
  //     expect(existsSync(destinationPath)).toBe(false)
  //     convertedFilePath = await convert(markdownFilePath, destinationPath, type, options)
  //   })
  //   waitsFor(() => {
  //     return convertedFilePath
  //   }, 'Should convert markdown', timeout)
  //   runs(() => {
  //     expect(existsSync(convertedFilePath)).toBe(true)
  //     expect(extname(convertedFilePath)).toBe('.pdf')
  //     expect(getSizeOfPdf(convertedFilePath).pages).toBeGreaterThan(2)
  //   })
  // })
})
