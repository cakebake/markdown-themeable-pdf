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

describe('Table', () => {

  it('checks correct table rendering', () => {
    let html = ''
    runs(async () => {
      const md = await getMarkdown('table.md')
      html = await getHtml(md, {}, true)
    })
    waitsFor(() => {
      return html
    }, 'Should get html')
    runs(() => {
      expect(html).toMatch(escapeRegExp('<th>cdID</th>\n<th>artID</th>'))
    })
  })

  it('checks disabled table cell innerWrap', () => {
    let html = ''
    runs(async () => {
      const md = await getMarkdown('table.md')
      html = await getHtml(md, {}, true)
    })
    waitsFor(() => {
      return html
    }, 'Should get html')
    runs(() => {
      expect(html).toMatch(escapeRegExp('<th>hello</th>'))
      expect(html).toMatch(escapeRegExp('<td>1</td>'))
    })
  })

  it('checks enabled table cell innerWrap', () => {
    let html = ''
    runs(async () => {
      const md = await getMarkdown('table.md')
      html = await getHtml(md, {}, false)
    })
    waitsFor(() => {
      return html
    }, 'Should get html')
    runs(() => {
      expect(html).toMatch(escapeRegExp('<th><div>hello</div></th>'))
      expect(html).toMatch(escapeRegExp('<td><div>1</div></td>'))
    })
  })

})
