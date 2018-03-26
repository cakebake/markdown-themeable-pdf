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

describe('HTML', () => {
  it('markdown has html', () => {
    let md = ''
    runs(async () => {
      try {
        md = await getMarkdown('html.md')
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return md
    }, 'Should get markdown')
    runs(() => {
      expect(md).toMatch(escapeRegExp('<div class="page-break"></div>'))
    })
  })

  it('with value true', () => {
    let html = ''
    runs(async () => {
      try {
        const md = await getMarkdown('html.md')
        html = await getHtml(md, { html: true })
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return html
    }, 'Should get html')
    runs(() => {
      expect(html).toMatch(escapeRegExp('<div class="page-break"></div>'))
    })
  })

  it('with value false', () => {
    let html = ''
    runs(async () => {
      try {
        const md = await getMarkdown('html.md')
        html = await getHtml(md, { html: false })
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return html
    }, 'Should get html')
    runs(() => {
      expect(html).not.toMatch(escapeRegExp('<div class="page-break"></div>'))
      expect(html).toMatch(escapeRegExp('&lt;div class=&quot;page-break&quot;&gt;&lt;/div&gt;'))
    })
  })
})
