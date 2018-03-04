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

  it('checks disabled fixed image src scheme', () => {
    let html = ''
    runs(async () => {
      const md = await getMarkdown('image.md')
      html = await getHtml(md, { html: true }, true)
    })
    waitsFor(() => {
      return html
    }, 'Should get html')
    runs(() => {
      expect(html).toMatch(escapeRegExp('./img/example.png" alt="example">'))
      expect(html).toMatch(escapeRegExp('./img/example.png" alt="html image" />'))
    })
  })

  it('checks enabled fixed image src scheme', () => {
    let html = ''
    runs(async () => {
      const md = await getMarkdown('image.md')
      html = await getHtml(md, { html: true }, false)
    })
    waitsFor(() => {
      return html
    }, 'Should get html')
    runs(() => {
      expect(html).toMatch(escapeRegExp('markdown-themeable-pdf/spec/markdown/img/example.png" alt="example">'))
      expect(html).toMatch(escapeRegExp('markdown-themeable-pdf/spec/markdown/img/example.png" alt="html image">'))
    })
  })

  it('checks disabled img size markup', () => {
    let html = ''
    runs(async () => {
      const md = await getMarkdown('image.md')
      html = await getHtml(md, { enableImSizeMarkup: false })
    })
    waitsFor(() => {
      return html
    }, 'Should get html')
    runs(() => {
      expect(html).toMatch(escapeRegExp('<p><img src="./img/example.png" alt="example"></p>'))
      expect(html).not.toMatch(escapeRegExp('<p><img src="./img/example-2.jpg" alt="example-2" width="100" height="200"></p>'))
    })
  })

  it('checks enabled img size markup', () => {
    let html = ''
    runs(async () => {
      const md = await getMarkdown('image.md')
      html = await getHtml(md, { enableImSizeMarkup: true })
    })
    waitsFor(() => {
      return html
    }, 'Should get html')
    runs(() => {
      expect(html).toMatch(escapeRegExp('<p><img src="./img/example.png" alt="example"></p>'))
      expect(html).toMatch(escapeRegExp('<p><img src="./img/example-2.jpg" alt="example-2" width="100" height="200"></p>'))
    })
  })

})
