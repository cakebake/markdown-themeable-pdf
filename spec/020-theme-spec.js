'use babel'

import { getTheme, getCodeHighlightingTheme } from './_preset'
import { getHighlightJsStylePathByName, getHighlightJsStyles } from '../lib/theme/highlightJs'
import { getBootswatchThemes, getBootswatchThemePathByName } from '../lib/theme/bootswatch'
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

  it(`could get bootswatch theme directories and directories contain default theme`, () => {
    const dirs = getBootswatchThemes()
    expect(dirs.length).not.toBe(0)
    expect(dirs).toContain(getTheme())
  })

  it('could get bootswatch theme path by theme name', () => {
    const path = getBootswatchThemePathByName(getTheme())
    expect(existsSync(path)).toBe(true)
  })
})
