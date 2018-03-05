'use babel'

import { escapeRegExp } from 'lodash'
import template from '../lib/api/template'
import { CHARSET } from '../lib/api/convert'
import { readFilesCombine } from '../lib/api/filesystem'
import { getCssFilePaths } from '../lib/api/atom'

import {
  getMarkdown,
  getHtml,
  getCurrentMdFilePath,
  getCustomStylesPath,
  getProjectRootPath
} from './_preset'

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.
//
// Tests are written with https://jasmine.github.io/1.3/introduction.html

let title = 'Lorem Title'

describe('Template', () => {

  it('creates html template from content', () => {
    let html = ''
    let css = ''
    runs(async () => {
      const md = await getMarkdown('simple.md')
      const content = await getHtml(md, {})
      const cssFiles = getCssFilePaths(getCustomStylesPath(), getProjectRootPath())
      css = await readFilesCombine(cssFiles, CHARSET)
      html = await template(content, title, true, CHARSET, css)
    })
    waitsFor(() => {
      return html
    }, 'Should get template')
    runs(() => {
      expect(html).toMatch(escapeRegExp('<!DOCTYPE html>\n<html>'))
      expect(html).toMatch(escapeRegExp(`<meta charset="${CHARSET}">`))
      expect(html).toMatch(escapeRegExp(`<title>${title}</title>`))
      expect(html).toMatch(escapeRegExp(`<style>${css}</style>`))
      expect(html).toMatch(escapeRegExp('<header id="pageHeader" class="meta">'))
      expect(html).toMatch(escapeRegExp('<main id="pageContent">'))
      expect(html).toMatch(escapeRegExp('<footer id="pageFooter" class="meta">'))
    })
  })

})
