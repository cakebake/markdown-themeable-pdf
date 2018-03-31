'use babel'

import { escapeRegExp } from 'lodash'
import { document } from '../lib/api/convert/template'
import { PACKAGE_NAME, CHARSET } from '../lib/config'
import { readFilesCombine, getHighlightJsStylePathByName } from '../lib/api/filesystem'
import { getCssFilePaths } from '../lib/api/atom'

import {
  getMarkdown,
  getHtml,
  getCustomStylesPath,
  getProjectRootPath,
  getcodeHighlightingTheme
} from './_preset'

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.
//
// Tests are written with https://jasmine.github.io/1.3/introduction.html

let title = 'Lorem Title'

describe('Template', () => {
  it('creates html document from content', () => {
    let html = ''
    let css = ''
    runs(async () => {
      try {
        const md = await getMarkdown('simple.md')
        const content = await getHtml(md, {})
        const cssFiles = getCssFilePaths(
          getCustomStylesPath(),
          getProjectRootPath(),
          getHighlightJsStylePathByName(getcodeHighlightingTheme()),
          'html'
        )
        css = await readFilesCombine(cssFiles, CHARSET)
        html = await document(content, title, CHARSET, css)
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return html
    }, 'Should get document')
    runs(() => {
      expect(html).toMatch(escapeRegExp('<!DOCTYPE html>\n<html>'))
      expect(html).toMatch(escapeRegExp(`<meta charset="${CHARSET}">`))
      expect(html).toMatch(escapeRegExp(`<title>${title}</title>`))
      expect(html).toMatch(escapeRegExp('html, body'))
      expect(html).not.toMatch(escapeRegExp('.page-break'))
      expect(html).not.toMatch(escapeRegExp('a[href^=http]:after'))
      expect(html).toMatch(escapeRegExp(`Your ${PACKAGE_NAME} custom styles`))
      expect(html).toMatch(escapeRegExp('.hljs'))
      expect(html).toMatch(escapeRegExp('<main id="pageContent">'))
    })
  })
})
