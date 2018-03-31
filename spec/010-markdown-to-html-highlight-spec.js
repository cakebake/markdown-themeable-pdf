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

describe('Highlight', () => {
  it('checks disabled higlight.js', () => {
    let html = ''
    runs(async () => {
      try {
        const md = await getMarkdown('highlight.md')
        html = await getHtml(md, { enableCodeHighlighting: false })
      } catch (e) {
        throw e
      }
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
      try {
        const md = await getMarkdown('highlight.md')
        html = await getHtml(md, { enableCodeHighlighting: true, codeHighlightingAuto: false })
      } catch (e) {
        throw e
      }
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
      try {
        const md = await getMarkdown('highlight.md')
        html = await getHtml(md, { enableCodeHighlighting: true, codeHighlightingAuto: true })
      } catch (e) {
        throw e
      }
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
})
