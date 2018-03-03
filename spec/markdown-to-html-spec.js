'use babel'

import markdownToHTML from '../src/api/convert/markdownToHTML'
import { readFile } from '../src/api/filesystem'
import config from '../src/config'
import { get, set, escapeRegExp, merge } from 'lodash'
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
    enableCodeHighlighting: get(config, 'enableCodeHighlighting.default'),
    codeHighlightingAuto: get(config, 'codeHighlightingAuto.default'),
    enableImSizeMarkup: get(config, 'enableImSizeMarkup.default'),
    enableCheckboxes: get(config, 'enableCheckboxes.default'),
    enableSmartArrows: get(config, 'enableSmartArrows.default')
  }
}

const getMarkdown = (testFile) => {
  return readFile(join(__dirname, 'markdown', testFile))
}

const getHtml = (markdown, _options = {}, isFinalFormat = true) => {
  return markdownToHTML(markdown, isFinalFormat, merge(options(), _options))
}

describe('Markdown to HTML', () => {

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

  it('checks disabled higlight.js', () => {
    let html = ''
    runs(async () => {
      const md = await getMarkdown('highlight.md')
      html = await getHtml(md, { enableCodeHighlighting: false })
    })
    waitsFor(() => {
      return html
    }, 'Should get html')
    runs(() => {
      expect(html).toMatch(escapeRegExp('<pre><code>&lt;?php'))
      expect(html).toMatch(escapeRegExp('<pre><code>hello'))
      expect(html).toMatch(escapeRegExp('<pre><code>not fanced'))
      expect(html).toMatch(escapeRegExp('<pre><code class="language-javascript">(function () {'))
    })
  })

  it('checks enabled higlight.js with disabled auto lang detection', () => {
    let html = ''
    runs(async () => {
      const md = await getMarkdown('highlight.md')
      html = await getHtml(md, { enableCodeHighlighting: true, codeHighlightingAuto: false })
    })
    waitsFor(() => {
      return html
    }, 'Should get html')
    runs(() => {
      expect(html).toMatch(escapeRegExp('<pre><code class="hljs">&lt;?php'))
      expect(html).toMatch(escapeRegExp('<pre><code class="hljs">hello'))
      expect(html).toMatch(escapeRegExp('<pre><code>not fanced'))
      expect(html).toMatch(escapeRegExp('<pre><code class="hljs language-javascript">(<span class="hljs-function"><span class="hljs-keyword">function</span> (<span class="hljs-params"></span>) </span>{'))
    })
  })

  it('checks enabled higlight.js with enabled auto lang detection', () => {
    let html = ''
    runs(async () => {
      const md = await getMarkdown('highlight.md')
      html = await getHtml(md, { enableCodeHighlighting: true, codeHighlightingAuto: true })
    })
    waitsFor(() => {
      return html
    }, 'Should get html')
    runs(() => {
      expect(html).toMatch(escapeRegExp('<pre><code class="hljs"><span class="php"><span class="hljs-meta">&lt;?php</span>'))
      expect(html).toMatch(escapeRegExp('<pre><code class="hljs"><span class="hljs-attribute">hello'))
      expect(html).toMatch(escapeRegExp('<pre><code>not fanced'))
      expect(html).toMatch(escapeRegExp('<pre><code class="hljs language-javascript">(<span class="hljs-function"><span class="hljs-keyword">function</span> (<span class="hljs-params"></span>) </span>{'))
    })
  })

  describe('render with option "html"', () => {

    it('markdown has html', () => {
      let md = ''
      runs(async () => {
        md = await getMarkdown('html.md')
      })
      waitsFor(() => {
        return md
      }, 'Should get markdown')
      runs(() => {
        expect(md).toMatch(escapeRegExp('<div class="page-break"></div>'))
      })
    })

    it('with value true', () => {
      let html = ''
      runs(async () => {
        const md = await getMarkdown('html.md')
        html = await getHtml(md, { html: true })
      })
      waitsFor(() => {
        return html
      }, 'Should get html')
      runs(() => {
        expect(html).toMatch(escapeRegExp('<div class="page-break"></div>'))
      })
    })

    it('with value false', () => {
      let html = ''
      runs(async () => {
        const md = await getMarkdown('html.md')
        html = await getHtml(md, { html: false })
      })
      waitsFor(() => {
        return html
      }, 'Should get html')
      runs(() => {
        expect(html).not.toMatch(escapeRegExp('<div class="page-break"></div>'))
        expect(html).toMatch(escapeRegExp('&lt;div class=&quot;page-break&quot;&gt;&lt;/div&gt;'))
      })
    })

  })

})
