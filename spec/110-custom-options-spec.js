'use babel'

import { addOptionsToContent, getMatterDelimiters } from '../lib/api/atom/customOptions'
import { escapeRegExp } from 'lodash'

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
})
