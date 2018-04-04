'use babel'

import { getCodeHighlightingTheme } from './_preset'
import { getHighlightJsStylePathByName, getHighlightJsStyles } from '../lib/theme/highlightJs'
import { getGithubMarkdownCssPath } from '../lib/theme/githubMarkdownCss'
import { existsSync } from 'fs'

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.
//
// Tests are written with https://jasmine.github.io/1.3/introduction.html

describe('Theme', () => {
  it(`could get highlight.js css files and files contain default highlight theme`, () => {
    expect(getHighlightJsStyles()).toContain(getCodeHighlightingTheme())
  })

  it('could get highlight.js style path by file name', () => {
    const path = getHighlightJsStylePathByName(getCodeHighlightingTheme())
    expect(existsSync(path)).toBe(true)
  })

  it('could get github markdown css path', () => {
    const path = getGithubMarkdownCssPath()
    expect(existsSync(path)).toBe(true)
  })
})
