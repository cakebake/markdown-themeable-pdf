'use babel'

import { readFile, getHighlightJsStyles, copyCustomTemplateFiles } from '../src/api/filesystem'
import { join } from 'path'
import { escapeRegExp } from 'lodash'
import { existsSync } from 'fs'
import rimraf from 'rimraf'

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.
//
// Tests are written with https://jasmine.github.io/1.3/introduction.html

describe('Filesystem', () => {

  it(`could copy theme files`, () => {
    const dest = join(__dirname, 'tmp', 'markdown-themeable-pdf')
    let fin = false

    rimraf.sync(dest)
    expect(existsSync(dest)).toBe(false)

    runs(() => {
      copyCustomTemplateFiles((e) => {
        if (e) {
          console.error(e)
        }
        fin = true
      }, dest)
    })
    waitsFor(() => {
      return fin
    }, 'Should copy files')
    runs(() => {
      expect(fin).toBe(true)
      expect(existsSync(join(dest, 'footer.js'))).toBe(true)
      expect(existsSync(join(dest, 'header.js'))).toBe(true)
      expect(existsSync(join(dest, 'styles.css'))).toBe(true)
    })
  })

  it(`could get highlight.js css files`, () => {
    expect(getHighlightJsStyles()).toContain('github-gist.css')
  })

  const testFiles = ['UTF-8.md', 'ISO-8859-1.md', 'Windows-1252.md']

  testFiles.forEach((testFile) => {
    it(`could handle ${testFile} file`, () => {
      let content
      runs(async () => {
        content = await readFile(join(__dirname, 'markdown', testFile))
      })
      waitsFor(() => {
        return content
      }, 'Should get content')
      runs(() => {
        expect(content).toMatch(escapeRegExp('Hällö Wörld'))
      })
    })
  })

})
