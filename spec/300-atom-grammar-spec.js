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
        grammar = await atom.grammars.grammarForScopeName('source.gfm')
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return grammar
    }, 'Should set grammar')
    runs(() => {
      expect(grammar).toBeTruthy()
      expect(grammar.scopeName).toBe('source.gfm')
    })
  })
  it('tokenizes YAML front matter', () => {
    let grammar = null
    runs(async () => {
      try {
        await atom.packages.activatePackage('markdown-themeable-pdf')
        grammar = await atom.grammars.grammarForScopeName('source.gfm')
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
        scopes: ['source.gfm', 'markdown-themeable-pdf.front-matter.yaml.gfm', 'comment.hr.gfm']
      })
      expect(secondLineTokens[0]).toEqual({
        value: 'front: matter',
        scopes: ['source.gfm', 'markdown-themeable-pdf.front-matter.yaml.gfm']
      })
      expect(thirdLineTokens[0]).toEqual({
        value: '--- [markdown-themeable-pdf] options; -->',
        scopes: ['source.gfm', 'markdown-themeable-pdf.front-matter.yaml.gfm', 'comment.hr.gfm']
      })
    })
  })
})
