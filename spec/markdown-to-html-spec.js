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
    enableSmartArrows: get(config, 'enableSmartArrows.default'),
    enableTOC: get(config, 'enableTocAndAnchor.default') === 'TOC enabled' || get(config, 'enableTocAndAnchor.default') === 'TOC and Anchors enabled',
    enableAnchor: get(config, 'enableTocAndAnchor.default') === 'Anchors enabled' || get(config, 'enableTocAndAnchor.default') === 'TOC and Anchors enabled',
    tocFirstLevel: get(config, 'tocFirstLevel.default'),
    tocLastLevel: get(config, 'tocLastLevel.default')
  }
}

const getMarkdown = (testFile) => {
  return readFile(join(__dirname, 'markdown', testFile))
}

const getHtml = (markdown, _options = {}, isFinalFormat = true) => {
  return markdownToHTML(markdown, isFinalFormat, merge(options(), _options))
}

describe('Markdown to HTML', () => {

  it('checks that TOC and Anchor links are disabled by default', () =>{
    const opt = options()
    expect(get(opt, 'enableTOC')).toBe(false)
    expect(get(opt, 'enableAnchor')).toBe(false)
  })

  it('checks disabled TOC and disabled Anchor generation', () => {
    let html = ''
    runs(async () => {
      const md = await getMarkdown('tocAndAnchor.md')
      html = await getHtml(md, { enableTOC: false, enableAnchor: false })
    })
    waitsFor(() => {
      return html
    }, 'Should get html')
    runs(() => {
      expect(html).toMatch(escapeRegExp('<p>@[toc]</p>'))
      expect(html).toMatch(escapeRegExp('<h2>h2 headline</h2>'))
    })
  })

  it('checks disabled TOC and enabled Anchor generation', () => {
    let html = ''
    runs(async () => {
      const md = await getMarkdown('tocAndAnchor.md')
      html = await getHtml(md, { enableTOC: false, enableAnchor: true })
    })
    waitsFor(() => {
      return html
    }, 'Should get html')
    runs(() => {
      expect(html).toMatch(escapeRegExp('<p><strong>TOC</strong></p>\n<p></p>'))
      expect(html).toMatch(escapeRegExp('<h2 id="h2-headline"><a class="markdown-themeable-pdf-anchor" href="#h2-headline">'))
    })
  })

  it('checks enabled TOC and disabled Anchor generation', () => {
    let html = ''
    runs(async () => {
      const md = await getMarkdown('tocAndAnchor.md')
      html = await getHtml(md, { enableTOC: true, enableAnchor: false })
    })
    waitsFor(() => {
      return html
    }, 'Should get html')
    runs(() => {
      expect(html).toMatch(escapeRegExp('<ul class="markdown-themeable-pdf-toc">\n<li><a href="#'))
      expect(html).toMatch(escapeRegExp('<h2 id="h2-headline">h2 headline</h2>'))
    })
  })

  it('checks enabled TOC and enabled Anchor generation', () => {
    let html = ''
    runs(async () => {
      const md = await getMarkdown('tocAndAnchor.md')
      html = await getHtml(md, { enableTOC: true, enableAnchor: true })
    })
    waitsFor(() => {
      return html
    }, 'Should get html')
    runs(() => {
      expect(html).toMatch(escapeRegExp('<ul class="markdown-themeable-pdf-toc">\n<li><a href="#'))
      expect(html).toMatch(escapeRegExp('<h2 id="h2-headline"><a class="markdown-themeable-pdf-anchor" href="#h2-headline">'))
    })
  })

  it('checks TOC with heading range 2 - 4', () => {
    let html = ''
    runs(async () => {
      const md = await getMarkdown('tocAndAnchor.md')
      html = await getHtml(md, { enableTOC: true, tocFirstLevel: 2, tocLastLevel: 4 })
    })
    waitsFor(() => {
      return html
    }, 'Should get html')
    runs(() => {
      expect(html).toMatch(escapeRegExp('<ul class="markdown-themeable-pdf-toc">\n<li><a href="#h2-headline">h2 headline</a>'))
      expect(html).toMatch(escapeRegExp('<li><a href="#h4-headline">h4 headline</a></li>\n</ul>\n</li>\n</ul>\n</li>\n</ul>'))
    })
  })

  it('checks anchor link symbol', () => {
    let html = ''
    runs(async () => {
      const md = await getMarkdown('tocAndAnchor.md')
      html = await getHtml(md, { enableAnchor: true, anchorLinkSymbol: '$' })
    })
    waitsFor(() => {
      return html
    }, 'Should get html')
    runs(() => {
      expect(html).toMatch(escapeRegExp('<span class="markdown-themeable-pdf-anchor-symbol">$</span>'))
    })
  })

  it('checks disabled smart arrows', () => {
    let html = ''
    runs(async () => {
      const md = await getMarkdown('smartArrows.md')
      html = await getHtml(md, { enableSmartArrows: false })
    })
    waitsFor(() => {
      return html
    }, 'Should get html')
    runs(() => {
      expect(html).toMatch(escapeRegExp('<p>–&gt; &lt;-- &lt;–&gt; ==&gt; &lt;== &lt;==&gt;</p>'))
    })
  })

  it('checks enabled smart arrows', () => {
    let html = ''
    runs(async () => {
      const md = await getMarkdown('smartArrows.md')
      html = await getHtml(md, { enableSmartArrows: true })
    })
    waitsFor(() => {
      return html
    }, 'Should get html')
    runs(() => {
      expect(html).toMatch(escapeRegExp('<p>→ ← ↔ ⇒ ⇐ ⇔</p>'))
    })
  })

  it('checks disabled checkbox rendering', () => {
    let html = ''
    runs(async () => {
      const md = await getMarkdown('checkbox.md')
      html = await getHtml(md, { enableCheckboxes: false })
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
      const md = await getMarkdown('checkbox.md')
      html = await getHtml(md, { enableCheckboxes: true })
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
