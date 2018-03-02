'use babel'

import { detectFileEncoding, readFileContent } from '../src/api/filesystem'
import { join } from 'path'

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.
//
// Tests are written with https://jasmine.github.io/1.3/introduction.html

const detect = (testFile) => {
  return detectFileEncoding(join(__dirname, 'markdown', testFile), 'nonsense')
}

describe('Filesystem', () => {

  it('could detect UTF-8 encoding', async () => {
    const encoding = await detect('UTF-8.md')
    expect(encoding).toBe('UTF-8')
  })

  it('could detect ISO-8859-1 encoding', async () => {
    const encoding = await detect('ISO-8859-1.md')
    expect(encoding).toBe('ISO-8859-1')
  })

  it('could detect Windows-1252 encoding as ISO-8859-1', async () => {
    const encoding = await detect('Windows-1252.md')
    expect(encoding).toBe('ISO-8859-1')
  })

})
