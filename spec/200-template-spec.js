'use babel'

import { escapeRegExp } from 'lodash'
import { tmpdir } from 'os'
import { join } from 'path'
import { copySync } from 'fs-extra'
import { body, header, footer } from '../lib/api/convert/template'
import { PACKAGE_NAME, CHARSET } from '../lib/config'
import { getFileDirectory, readFile } from '../lib/api/filesystem'
import { getBodyCss } from '../lib/style'
import {
  getMarkdown,
  getHtml,
  getCurrentMdFilePath,
  getOptions,
  getFilesTestFilePath
} from './_preset'

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.
//
// Tests are written with https://jasmine.github.io/1.3/introduction.html

describe('Template', () => {
  const options = getOptions()
  it('creates html body from content', () => {
    let html = ''
    runs(async () => {
      try {
        const md = await getMarkdown('simple.md')
        const content = await getHtml(md, {})
        const css = await getBodyCss(getCurrentMdFilePath(), 'html', options)
        html = await body(content, CHARSET, css, getFileDirectory(getCurrentMdFilePath()))
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return html
    }, 'Should get body')
    runs(() => {
      expect(html).toMatch(escapeRegExp('<!DOCTYPE html>\n<html>'))
      expect(html).toMatch(escapeRegExp(`<meta charset="${CHARSET}">`))
      expect(html).toMatch(escapeRegExp('<title>Heading 1</title>'))
      expect(html).toMatch(escapeRegExp('html, body'))
      expect(html).not.toMatch(escapeRegExp('.page-break'))
      expect(html).not.toMatch(escapeRegExp('a[href^=http]:after'))
      expect(html).toMatch(escapeRegExp(`Your ${PACKAGE_NAME} custom styles`))
      expect(html).toMatch(escapeRegExp('.hljs'))
      expect(html).toMatch(escapeRegExp('id="pageContent"'))
    })
  })

  it('manipulates img src with data uri (base64) in body, header and footer', () => {
    let bodyHtml = ''
    let headerHtml = ''
    let footerHtml = ''
    let fin = false
    const timeout = 300000
    const copyImageAbsolute = (name) => {
      const dest = join(tmpdir(), name)
      const src = join(__dirname, 'markdown', 'img', name)
      copySync(src, dest)
      return dest
    }
    runs(async () => {
      try {
        const absolutePath = copyImageAbsolute('example.png')
        let md = await getMarkdown('image.md')
        md += `\n## absolute src\n![absolute src](${absolutePath})\n`
        const content = await getHtml(md, {})
        const basePath = getFileDirectory(getCurrentMdFilePath())
        bodyHtml = await body(content, CHARSET, '', basePath)
        headerHtml = await header(content, '', {}, basePath)
        footerHtml = await footer(content, '', {}, basePath)
        fin = true
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return fin
    }, 'Should get document', timeout)
    runs(() => {
      expect(bodyHtml).toMatch(escapeRegExp('id="pageContent"'))
      expect(headerHtml).toMatch(escapeRegExp('id="pageHeader"'))
      expect(footerHtml).toMatch(escapeRegExp('id="pageFooter"'))
      const test = [
        '3LjEwNXoiLz48L3N2Zz4="> <code>:blush:</code>',
        'AAAABJRU5ErkJggg==" alt="example"',
        'AAAABJRU5ErkJggg==" alt="html image"',
        'AAAAAElFTkSuQmCC" alt="external image"',
        'AAAAAElFTkSuQmCC" alt="external html image"',
        'AAAABJRU5ErkJggg==" alt="absolute src"'
      ]
      test.forEach((t) => {
        expect(bodyHtml).toMatch(escapeRegExp(t))
        expect(headerHtml).toMatch(escapeRegExp(t))
        expect(footerHtml).toMatch(escapeRegExp(t))
      })
    })
  })

  it('manipulates css urls and converts them to data uri (base64)', () => {
    let css
    runs(async () => {
      try {
        const cssPath = getFilesTestFilePath('urls.css')
        css = await readFile(cssPath, CHARSET)
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return css
    }, 'Should get css and resolve paths')
    runs(() => {
      expect(css).toMatch(escapeRegExp('/* demo css with some url parts to resolve that paths correctly */'))
      expect(css).toMatch(escapeRegExp('url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAARCAIAAAE76BvMAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAACk0lEQVQ4y51SXUvrQBCd2WxStRo0KkRJSzUqoiL4Ul/97UYL2hctVERSbRP8ACX0oSYN+zH3YaXWe70f3HlIltnZM3PmHCSiXq8HAK7rsl6v9/LyUq1WXdflYRgCwPv7O+cc4zgGAABgtm1nWVYUBRdCeJ4HABDHcZqmRNRqtYgoTdOyLBkALCwsAECtViOiIAgAAPv9vpQSpoOIzs/PzcPLy0utNQOASqVydnamtZZSDodDMPdENBwOy7IkIhwMBkKIL1gPDw/0txiNRlwpBQBJkqRpats253w8HgdBUKvVLi4u1tfXgyCwbZsZVETknDebzaOjI8uyEBERy7JM05QxBgDQ7/f/pS/mef709AR/jDAM4fb2Vmv9Z7x2u80454gYRdHz87PW+vX1NYoiAFBKnZ6eTvbLzUlKeXd3V61Wb25utNbmzqziQ17z01ofHh5eX1/v7e0REQAYpkmSfKljjLmuu7u763keIgLA7OysZVlLS0um4KNvo9FAxJWVFSJqNBoA4Ps+ERl/AAAXQhDRxsbGZOGT89ra2iSJRVE8Pj7+dX+Y53m3252fn3ccxzD4j2CMZVm2vLz84f8wDI0oWmtjiQk0IkopiYgx9mEJAKXUdAYRhRBXV1d8ukOSJHEcO44DAAcHB4uLi6PRqNPpKKWEEFtbW/V63WC12+08z7e3t+v1umlsvvzXyY0tOp2OZVlKKcdxzIDTNcbF37D+dhfNZnNnZ6csy83NzePjY0SccH97e4uiSAgxMzNzf3/farXG4/HnKNMoWmshhJRSKeX7vu/7xpVSSiGEsaTneScnJ3EcDwaD/f1945TPqaelmFD4SeLfJaflMlJgURTdbndubq5Sqfy3URAxy7LV1dUfddvyJiBn46kAAAAASUVORK5CYII=)'))
    })
  })
})
