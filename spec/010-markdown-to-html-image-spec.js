'use babel'

import { escapeRegExp } from 'lodash'

import {
  getMarkdown,
  getHtml
} from './_preset'

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.
//
// Tests are written with https://jasmine.github.io/1.3/introduction.html

describe('Image', () => {
  it('checks disabled img size markup', () => {
    let html = ''
    runs(async () => {
      try {
        const md = await getMarkdown('image.md')
        html = await getHtml(md, { enableImSizeMarkup: false })
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return html
    }, 'Should get html')
    runs(() => {
      expect(html).toMatch(escapeRegExp('alt="example"></p>'))
      expect(html).toMatch(escapeRegExp('![example 100x100](./img/example.png =100x100)'))
    })
  })

  it('checks enabled img size markup', () => {
    let html = ''
    runs(async () => {
      try {
        const md = await getMarkdown('image.md')
        html = await getHtml(md, { enableImSizeMarkup: true })
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return html
    }, 'Should get html')
    runs(() => {
      expect(html).toMatch(escapeRegExp('alt="example"></p>'))
      expect(html).toMatch(escapeRegExp('alt="example 100x100" width="100" height="100"></p>'))
    })
  })
})
