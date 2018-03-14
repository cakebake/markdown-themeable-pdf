'use babel'

import { get, escapeRegExp } from 'lodash'
import { PACKAGE_NAME } from '../lib/config'

import {
  htmlOptions,
  getMarkdown,
  getHtml
} from './_preset'

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.
//
// Tests are written with https://jasmine.github.io/1.3/introduction.html

describe('TOC and Anchor', () => {

  it('checks that TOC is enabled and Anchor links are disabled by default', () =>{
    const opt = htmlOptions()
    expect(get(opt, 'enableTOC')).toBe(true)
    expect(get(opt, 'enableAnchor')).toBe(false)
  })

  it('checks disabled TOC and disabled Anchor generation', () => {
    let html = ''
    runs(async () => {
      try {
        const md = await getMarkdown('tocAndAnchor.md')
        html = await getHtml(md, { enableTOC: false, enableAnchor: false })
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return html
    }, 'Should get html')
    runs(() => {
      expect(html).toMatch(escapeRegExp('<p></p>'))
      expect(html).toMatch(escapeRegExp('\n<h2 id="h2-headline">h2 headline</h2>\n'))
    })
  })

  it('checks disabled TOC and enabled Anchor generation', () => {
    let html = ''
    runs(async () => {
      try {
        const md = await getMarkdown('tocAndAnchor.md')
        html = await getHtml(md, { enableTOC: false, enableAnchor: true })
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return html
    }, 'Should get html')
    runs(() => {
      expect(html).toMatch(escapeRegExp('<p><strong>TOC</strong></p>\n<p></p>'))
      expect(html).toMatch(escapeRegExp(`<h2 id="h2-headline"><a class="${PACKAGE_NAME}-anchor" href="#h2-headline">`))
    })
  })

  it('checks enabled TOC and disabled Anchor generation', () => {
    let html = ''
    runs(async () => {
      try {
        const md = await getMarkdown('tocAndAnchor.md')
        html = await getHtml(md, { enableTOC: true, enableAnchor: false })
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return html
    }, 'Should get html')
    runs(() => {
      expect(html).toMatch(escapeRegExp(`<ul class="${PACKAGE_NAME}-toc">\n<li><a href="#`))
      expect(html).toMatch(escapeRegExp('\n<h2 id="h2-headline">h2 headline</h2>\n'))
    })
  })

  it('checks enabled TOC and enabled Anchor generation', () => {
    let html = ''
    runs(async () => {
      try {
        const md = await getMarkdown('tocAndAnchor.md')
        html = await getHtml(md, { enableTOC: true, enableAnchor: true })
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return html
    }, 'Should get html')
    runs(() => {
      expect(html).toMatch(escapeRegExp(`<ul class="${PACKAGE_NAME}-toc">\n<li><a href="#`))
      expect(html).toMatch(escapeRegExp(`<h2 id="h2-headline"><a class="${PACKAGE_NAME}-anchor" href="#h2-headline">`))
    })
  })

  it('checks TOC with heading range 2 - 4', () => {
    let html = ''
    runs(async () => {
      try {
        const md = await getMarkdown('tocAndAnchor.md')
        html = await getHtml(md, { enableTOC: true, tocFirstLevel: 2, tocLastLevel: 4 })
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return html
    }, 'Should get html')
    runs(() => {
      expect(html).toMatch(escapeRegExp(`<ul class="${PACKAGE_NAME}-toc">\n<li><a href="#h2-headline">h2 headline</a>`))
      expect(html).toMatch(escapeRegExp('<li><a href="#h4-headline">h4 headline</a></li>\n</ul>\n</li>\n</ul>\n</li>\n</ul>'))
    })
  })

  it('checks anchor link symbol', () => {
    let html = ''
    runs(async () => {
      try {
        const md = await getMarkdown('tocAndAnchor.md')
        html = await getHtml(md, { enableAnchor: true, anchorLinkSymbol: '$' })
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return html
    }, 'Should get html')
    runs(() => {
      expect(html).toMatch(escapeRegExp(`<span class="${PACKAGE_NAME}-anchor-symbol">$</span>`))
    })
  })

})
