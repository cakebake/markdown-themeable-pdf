'use babel'

import { readFile } from '../src/api/filesystem'
import { join } from 'path'
import { escapeRegExp } from 'lodash'

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.
//
// Tests are written with https://jasmine.github.io/1.3/introduction.html

describe('Filesystem', () => {

  ['UTF-8.md', 'ISO-8859-1.md', 'Windows-1252.md'].forEach((testFile) => {
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
