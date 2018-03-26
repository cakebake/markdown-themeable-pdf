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

describe('Footnotes', () => {
  it('checks disabled footnotes support', () => {
    let html = ''
    runs(async () => {
      try {
        const md = await getMarkdown('footnotes.md')
        html = await getHtml(md, { enableFootnotes: false })
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return html
    }, 'Should get html')
    runs(() => {
      expect(html).toMatch(escapeRegExp('[^1]'))
      expect(html).toMatch(escapeRegExp('[^longnote]'))
    })
  })

  it('checks enabled footnotes support', () => {
    let html = ''
    runs(async () => {
      try {
        const md = await getMarkdown('footnotes.md')
        html = await getHtml(md, { enableFootnotes: true })
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return html
    }, 'Should get html')
    runs(() => {
      expect(html).toMatch(escapeRegExp('<sup class="footnote-ref"><a href="#fn1" id="fnref1">[1]</a></sup>'))
      expect(html).toMatch(escapeRegExp('<li id="fn1" class="footnote-item"><p>Here is the footnote. <a href="#fnref1" class="footnote-backref">↩︎</a></p>\n</li>'))
      expect(html).toMatch(escapeRegExp('<sup class="footnote-ref"><a href="#fn2" id="fnref2">[2]</a></sup>'))
      expect(html).toMatch(escapeRegExp('<li id="fn2" class="footnote-item"><p>Here’s one with multiple blocks.</p>\n<p>Subsequent paragraphs are indented to show that they belong to the previous footnote. <a href="#fnref2" class="footnote-backref">↩︎</a></p>\n</li>'))
    })
  })
})
