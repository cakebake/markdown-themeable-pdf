'use babel'

import { escapeRegExp } from 'lodash'
import template from '../lib/api/convert/template'
import { CHARSET } from '../lib/api/convert'

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.
//
// Tests are written with https://jasmine.github.io/1.3/introduction.html

let title = 'Lorem Title'

let content = `
<h1>Heading 1</h1>
<p>Lorem ipsum dolor sit amet</p>
`

describe('Template', () => {

  it('Create html template from content', () => {
    let html = ''
    runs(async () => {
      html = await template(content, title, true)
    })
    waitsFor(() => {
      return html
    }, 'Should get template')
    runs(() => {
      expect(html).toMatch(escapeRegExp('<!DOCTYPE html>\n<html>'))
      expect(html).toMatch(escapeRegExp(`<meta charset="${CHARSET}">`))
      expect(html).toMatch(escapeRegExp(`<title>${title}</title>`))
      expect(html).toMatch(escapeRegExp('<header id="pageHeader" class="meta">'))
      expect(html).toMatch(escapeRegExp('<main id="pageContent">'))
      expect(html).toMatch(escapeRegExp('<footer id="pageFooter" class="meta">'))
    })
  })

})
