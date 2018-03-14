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

describe('Emoji', () => {

  it('checks disabled emoji support', () => {
    let html = ''
    runs(async () => {
      try {
        const md = await getMarkdown('emoji.md')
        html = await getHtml(md, { enableEmoji: 0 })
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return html
    }, 'Should get html')
    runs(() => {
      expect(html).toMatch(escapeRegExp(':grin: :sweat_smile: :innocent: :unamused: :angry:'))
      expect(html).toMatch(escapeRegExp(':) :-('))
    })
  })

  it('checks full emoji support', () => {
    let html = ''
    runs(async () => {
      try {
        const md = await getMarkdown('emoji.md')
        html = await getHtml(md, { enableEmoji: 1 })
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return html
    }, 'Should get html')
    runs(() => {
      expect(html).toMatch(escapeRegExp('😁 😅 😇 😒 😠'))
      expect(html).toMatch(escapeRegExp('😃 😦'))
      expect(html).toMatch(escapeRegExp('🙊'))
    })
  })

  it('checks light emoji support', () => {
    let html = ''
    runs(async () => {
      try {
        const md = await getMarkdown('emoji.md')
        html = await getHtml(md, { enableEmoji: 2 })
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return html
    }, 'Should get html')
    runs(() => {
      expect(html).toMatch(escapeRegExp('😁 😅 😇 😒 😠'))
      expect(html).toMatch(escapeRegExp('😃 😦'))
      expect(html).toMatch(escapeRegExp(':speak_no_evil:'))
    })
  })

})
