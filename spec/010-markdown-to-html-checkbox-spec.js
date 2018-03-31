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

describe('Checkbox', () => {
  it('checks disabled checkbox rendering', () => {
    let html = ''
    runs(async () => {
      try {
        const md = await getMarkdown('checkbox.md')
        html = await getHtml(md, { enableCheckboxes: false })
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return html
    }, 'Should get html')
    runs(() => {
      expect(html).toMatch(escapeRegExp('<p>[ ] checkbox</p>'))
      expect(html).toMatch(escapeRegExp('<li>[ ] one</li>'))
      expect(html).toMatch(escapeRegExp('five [x]'))
      expect(html).toMatch(escapeRegExp('- [x] seven'))
    })
  })

  it('checks enabled checkbox rendering', () => {
    let html = ''
    runs(async () => {
      try {
        const md = await getMarkdown('checkbox.md')
        html = await getHtml(md, { enableCheckboxes: true })
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return html
    }, 'Should get html')
    runs(() => {
      expect(html).toMatch(escapeRegExp('<p><input type="checkbox" id="checkbox-0"><label for="checkbox-0">checkbox</label></p>'))
      expect(html).toMatch(escapeRegExp('<li><input type="checkbox" id="checkbox-1"><label for="checkbox-1">one</label></li>'))
      expect(html).toMatch(escapeRegExp('five [x]'))
      expect(html).toMatch(escapeRegExp('- [x] seven'))
    })
  })
})
