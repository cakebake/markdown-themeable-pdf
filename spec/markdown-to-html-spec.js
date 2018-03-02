'use babel'

import markdownToHTML from '../src/api/convert/markdownToHTML'
import { readFile } from '../src/api/filesystem'
import config from '../src/config'
import { get, set, escapeRegExp } from 'lodash'
import { join } from 'path'

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.
//
// Tests are written with https://jasmine.github.io/1.3/introduction.html

let options = () => {
  return {
    html: get(config, 'enableHtmlInMarkdown.default'),
    linkify: get(config, 'enableLinkify.default'),
    typographer: get(config, 'enableTypographer.default'),
    xhtmlOut: get(config, 'enableXHTML.default'),
    breaks: get(config, 'enableBreaks.default'),
    quotes: get(config, 'smartQuotes.default'),
    langPrefix: 'hljs ',
    enableCodeHighlighting: get(config, 'enableCodeHighlighting.default'),
    codeHighlightingAuto: get(config, 'codeHighlightingAuto.default'),
    enableImSizeMarkup: get(config, 'enableImSizeMarkup.default'),
    enableCheckboxes: get(config, 'enableCheckboxes.default'),
    enableSmartArrows: get(config, 'enableSmartArrows.default')
  }
}

let testCount = 0

const getMarkdown = (testFile) => {
  return readFile(join(__dirname, 'markdown', testFile))
}

const getHtml = async (markdown, key, value, isFinalFormat = true) => {
  let opt = options()
  set(opt, key, value)
  return markdownToHTML(markdown, isFinalFormat, opt)
}

describe('Markdown to HTML', () => {

  describe('render with option "html"', () => {
    it('markdown has html', async () => {
      const md = await getMarkdown('html.md')
      expect(md).toMatch(escapeRegExp('<div class="page-break"></div>'))
    })
    it('with value true', async () => {
      const md = await getMarkdown('html.md')
      const html = await getHtml(md, 'html', true)
      expect(html).toMatch(escapeRegExp('<div class="page-break"></div>'))
    })
    it('with value false', async () => {
      const md = await getMarkdown('html.md')
      const html = await getHtml(md, 'html', false)
      expect(html).not.toMatch(escapeRegExp('<div class="page-break"></div>'))
      expect(html).toMatch(escapeRegExp('&lt;div class=&quot;page-break&quot;&gt;&lt;/div&gt;'))
    })
  })

})
