'use babel'

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.
//
// Tests are written with https://jasmine.github.io/1.3/introduction.html

describe('Grammar', () => {
  it('parses the grammar', () => {
    let grammar = null
    runs(async () => {
      try {
        await atom.packages.activatePackage('markdown-themeable-pdf')
        grammar = await atom.grammars.grammarForScopeName('source.gfm.markdown-themeable-pdf')
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return grammar
    }, 'Should set grammar')
    runs(() => {
      expect(grammar).toBeTruthy()
      expect(grammar.scopeName).toBe('source.gfm.markdown-themeable-pdf')
    })
  })

  it('tokenizes toc', () => {
    let grammar = null
    runs(async () => {
      try {
        await atom.packages.activatePackage('markdown-themeable-pdf')
        grammar = await atom.grammars.grammarForScopeName('source.gfm.markdown-themeable-pdf')
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return grammar
    }, 'Should set grammar')
    runs(() => {
      const content = 'content\n@[toc]\n`code`'
      const [firstLineTokens, secondLineTokens, thirdLineTokens] = grammar.tokenizeLines(content)
      expect(firstLineTokens[0]).toEqual({
        value: 'content',
        scopes: ['source.gfm.markdown-themeable-pdf']
      })
      expect(secondLineTokens[0]).toEqual({
        value: '@[toc]',
        scopes: ['source.gfm.markdown-themeable-pdf', 'markup.heading.heading-1.gfm.markdown-themeable-pdf.toc']
      })
      expect(thirdLineTokens[0]).toEqual({
        value: '`code`',
        scopes: ['source.gfm.markdown-themeable-pdf']
      })
    })
  })

  it('tokenizes page-break', () => {
    let grammar = null
    runs(async () => {
      try {
        await atom.packages.activatePackage('markdown-themeable-pdf')
        grammar = await atom.grammars.grammarForScopeName('source.gfm.markdown-themeable-pdf')
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return grammar
    }, 'Should set grammar')
    runs(() => {
      const content = 'content\n<div class="page-break"></div>\n`code`'
      const [firstLineTokens, secondLineTokens, thirdLineTokens] = grammar.tokenizeLines(content)
      expect(firstLineTokens[0]).toEqual({
        value: 'content',
        scopes: ['source.gfm.markdown-themeable-pdf']
      })
      expect(secondLineTokens[0]).toEqual({
        value: '<div class="page-break"></div>',
        scopes: ['source.gfm.markdown-themeable-pdf', 'comment.line.gfm.markdown-themeable-pdf.page-break']
      })
      expect(thirdLineTokens[0]).toEqual({
        value: '`code`',
        scopes: ['source.gfm.markdown-themeable-pdf']
      })
    })
  })

  it('tokenizes YAML front matter', () => {
    let grammar = null
    runs(async () => {
      try {
        await atom.packages.activatePackage('markdown-themeable-pdf')
        grammar = await atom.grammars.grammarForScopeName('source.gfm.markdown-themeable-pdf')
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return grammar
    }, 'Should set grammar')
    runs(() => {
      const content = '<!-- [markdown-themeable-pdf] options:\nfront: matter\n--- [markdown-themeable-pdf] options; -->'
      const [firstLineTokens, secondLineTokens, thirdLineTokens] = grammar.tokenizeLines(content)
      expect(firstLineTokens[0]).toEqual({
        value: '<!-- [markdown-themeable-pdf] options:',
        scopes: ['source.gfm.markdown-themeable-pdf', 'front-matter.yaml.gfm.markdown-themeable-pdf', 'comment.hr.gfm']
      })
      expect(secondLineTokens[0]).toEqual({
        value: 'front: matter',
        scopes: ['source.gfm.markdown-themeable-pdf', 'front-matter.yaml.gfm.markdown-themeable-pdf']
      })
      expect(thirdLineTokens[0]).toEqual({
        value: '--- [markdown-themeable-pdf] options; -->',
        scopes: ['source.gfm.markdown-themeable-pdf', 'front-matter.yaml.gfm.markdown-themeable-pdf', 'comment.hr.gfm']
      })
    })
  })

  it('checks extended source.gfm is equal standard source.gfm', () => {
    const grammar = {}
    let fin = false
    runs(async () => {
      try {
        await atom.packages.activatePackage('language-gfm')
        grammar.default = await atom.grammars.grammarForScopeName('source.gfm')
        await atom.packages.activatePackage('markdown-themeable-pdf')
        grammar.extended = await atom.grammars.grammarForScopeName('source.gfm.markdown-themeable-pdf')
        fin = true
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return fin
    }, 'Should set grammar')
    runs(() => {
      const content = '# headline\n<!-- some -->\n`code`'
      const [
        firstLineTokensDefault,
        secondLineTokensDefault,
        thirdLineTokensDefault
      ] = grammar.default.tokenizeLines(content)
      const [
        firstLineTokensExtended,
        secondLineTokensExtended,
        thirdLineTokensExtended
      ] = grammar.extended.tokenizeLines(content)
      expect(grammar.default).toBeTruthy()
      expect(grammar.default.scopeName).toBe('source.gfm')
      expect(grammar.extended).toBeTruthy()
      expect(grammar.extended.scopeName).toBe('source.gfm.markdown-themeable-pdf')
      expect(firstLineTokensExtended[0].value).toEqual(firstLineTokensDefault[0].value)
      expect(firstLineTokensExtended[0].scopes[0]).not.toEqual(firstLineTokensDefault[0].scopes[0])
      expect(firstLineTokensExtended[0].scopes[1]).toEqual(firstLineTokensDefault[0].scopes[1])
      expect(secondLineTokensExtended[0].value).toEqual(secondLineTokensDefault[0].value)
      expect(secondLineTokensExtended[0].scopes[0]).not.toEqual(secondLineTokensDefault[0].scopes[0])
      expect(secondLineTokensExtended[0].scopes[1]).toEqual(secondLineTokensDefault[0].scopes[1])
      expect(thirdLineTokensExtended[0].value).toEqual(thirdLineTokensDefault[0].value)
      expect(thirdLineTokensExtended[0].scopes[0]).not.toEqual(thirdLineTokensDefault[0].scopes[0])
      expect(thirdLineTokensExtended[0].scopes[1]).toEqual(thirdLineTokensDefault[0].scopes[1])
    })
  })
})
