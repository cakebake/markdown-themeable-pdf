'use babel'

import markdownToHTML from '../src/api/convert/markdownToHTML'
import config from '../src/config'
import { get } from 'lodash'

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.
//
// Tests are written with https://jasmine.github.io/1.3/introduction.html

describe('Markdown to HTML', () => {

  let defaultOptions = () => {
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

  let markdown = '# headline \n\n Lorem **ipsum** dolor sit amet ...'

  let isFinalFormat = true

  it('renders to HTML with default options', async () => {
    const options = defaultOptions()
    const html = await markdownToHTML(markdown, isFinalFormat, options)

    expect(markdown).toMatch(/Lorem \*\*ipsum\*\* dolor/)
    expect(html).toMatch(/Lorem \<strong\>ipsum\<\/strong\> dolor/)
    console.log(html)
  })

})
