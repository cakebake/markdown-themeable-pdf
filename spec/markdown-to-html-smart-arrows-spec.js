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

describe('Markdown to HTML', () => {

  it('checks disabled smart arrows', () => {
    let html = ''
    runs(async () => {
      try {
        const md = await getMarkdown('smartArrows.md')
        html = await getHtml(md, { enableSmartArrows: false })
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return html
    }, 'Should get html')
    runs(() => {
      expect(html).toMatch(escapeRegExp('<p>–&gt; &lt;-- &lt;–&gt; ==&gt; &lt;== &lt;==&gt;</p>'))
    })
  })

  it('checks enabled smart arrows', () => {
    let html = ''
    runs(async () => {
      try {
        const md = await getMarkdown('smartArrows.md')
        html = await getHtml(md, { enableSmartArrows: true })
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return html
    }, 'Should get html')
    runs(() => {
      expect(html).toMatch(escapeRegExp('<p>→ ← ↔ ⇒ ⇐ ⇔</p>'))
    })
  })

})
