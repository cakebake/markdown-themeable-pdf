'use babel'

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.
//
// Tests are written with https://jasmine.github.io/1.3/introduction.html

const loadGrammar = async () => {
  await atom.packages.activatePackage('markdown-themeable-pdf')
  await atom.packages.activatePackage('language-gfm')
  return atom.grammars.grammarForScopeName('source.gfm')
}

describe('Grammar', () => {
  it('loads gfm grammar', () => {
    let grammar = null
    runs(async () => {
      try {
        grammar = await loadGrammar()
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

  it('tokenizes toc', () => {
    let grammar = null
    runs(async () => {
      try {
        grammar = await loadGrammar()
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return grammar
    }, 'Should set grammar')
    runs(() => {
      const content = 'content\n@[toc]\ntext'
      const [firstLineTokens, secondLineTokens, thirdLineTokens] = grammar.tokenizeLines(content)
      expect(firstLineTokens[0]).toEqual({
        value: 'content',
        scopes: ['source.gfm']
      })
      expect(secondLineTokens[0]).toEqual({
        value: '@[toc]',
        scopes: ['source.gfm', 'markup.heading.heading-1.text.markdown-themeable-pdf.toc']
      })
      expect(thirdLineTokens[0]).toEqual({
        value: 'text',
        scopes: ['source.gfm']
      })
    })
  })

  it('tokenizes checkboxes', () => {
    let grammar = null
    runs(async () => {
      try {
        grammar = await loadGrammar()
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return grammar
    }, 'Should set grammar')
    runs(() => {
      const content = '[ ]\n[x]\ntext'
      const [firstLineTokens, secondLineTokens, thirdLineTokens] = grammar.tokenizeLines(content)
      expect(firstLineTokens[0]).toEqual({
        value: '[ ]',
        scopes: ['source.gfm', 'variable.unordered.list.text.markdown-themeable-pdf.checkbox']
      })
      expect(secondLineTokens[0]).toEqual({
        value: '[x]',
        scopes: ['source.gfm', 'variable.unordered.list.text.markdown-themeable-pdf.checkbox']
      })
      expect(thirdLineTokens[0]).toEqual({
        value: 'text',
        scopes: ['source.gfm']
      })
    })
  })

  it('tokenizes page-break', () => {
    let grammar = null
    runs(async () => {
      try {
        grammar = await loadGrammar()
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return grammar
    }, 'Should set grammar')
    runs(() => {
      const content = 'content\n<div class="page-break"></div>\ntext'
      const [firstLineTokens, secondLineTokens, thirdLineTokens] = grammar.tokenizeLines(content)
      expect(firstLineTokens[0]).toEqual({
        value: 'content',
        scopes: ['source.gfm']
      })
      expect(secondLineTokens[0]).toEqual({
        value: '<div class="page-break"></div>',
        scopes: ['source.gfm', 'comment.hr.text.markdown-themeable-pdf.page-break']
      })
      expect(thirdLineTokens[0]).toEqual({
        value: 'text',
        scopes: ['source.gfm']
      })
    })
  })

  it('tokenizes YAML front matter', () => {
    let grammar = null
    runs(async () => {
      try {
        grammar = await loadGrammar()
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return grammar
    }, 'Should set grammar')
    runs(() => {
      const content = '---\nfront: matter\n---'
      const [firstLineTokens, secondLineTokens, thirdLineTokens] = grammar.tokenizeLines(content)
      expect(firstLineTokens[0]).toEqual({
        value: '---',
        scopes: ['source.gfm', 'front-matter.yaml.gfm', 'comment.hr.gfm']
      })
      expect(secondLineTokens[0]).toEqual({
        value: 'front: matter',
        scopes: ['source.gfm', 'front-matter.yaml.gfm']
      })
      expect(thirdLineTokens[0]).toEqual({
        value: '---',
        scopes: ['source.gfm', 'front-matter.yaml.gfm', 'comment.hr.gfm']
      })
    })
  })
})
