'use babel'

import { PACKAGE_NAME, CHARSET } from '../lib/config'
import { join, parse } from 'path'
import { escapeRegExp } from 'lodash'
import { existsSync, readFileSync } from 'fs'
import rimraf from 'rimraf'
import { getMarkdownTestFilePath, getcodeHighlightingTheme, getMarkdownTestFileDir } from './_preset'

import {
  readFile,
  readFilesCombine,
  writeFile,
  getHighlightJsStyles,
  copyCustomTemplateFiles,
  getFileDirectory,
  getFileName,
  getFileExt,
  getHighlightJsStylePathByName,
  pathExists
} from '../lib/api/filesystem'

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.
//
// Tests are written with https://jasmine.github.io/1.3/introduction.html

describe('Filesystem', () => {

  it('should check if a file or directory exists', async () => {
    const filePath = getMarkdownTestFilePath('Demo.md')
    const dirPath = getMarkdownTestFileDir()
    expect(await pathExists(filePath)).toBe(true)
    expect(await pathExists(dirPath)).toBe(true)
    expect(await pathExists('/hello/world')).toBe(false)
    expect(await pathExists(null)).toBe(false)
  })

  it('could parse filePath info', () => {
    const filePath = getMarkdownTestFilePath('Demo.md')
    const fileInfo = parse(filePath)
    expect(getFileDirectory(filePath)).toBe(fileInfo.dir)
    expect(getFileName(filePath)).toBe(fileInfo.name)
    expect(getFileName(filePath, true)).toBe(`${fileInfo.name}${fileInfo.ext}`)
    expect(getFileExt(filePath)).toBe(fileInfo.ext)
  })

  it(`could write file`, () => {
    let destination = ''
    const content = 'Hällööö Wööörld...'
    runs(async () => {
      try {
        destination = await writeFile(content, join(__dirname, 'tmp', 'couldWriteFile.html'), CHARSET)
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return destination
    }, 'Should write file')
    runs(() => {
      expect(existsSync(destination)).toBe(true)
      expect(readFileSync(destination, CHARSET)).toMatch(escapeRegExp(content))
      rimraf.sync(destination)
      expect(existsSync(destination)).toBe(false)
    })
  })

  it(`could copy theme files`, () => {
    let customTemplateFilesDest
    runs(async () => {
      try {
        customTemplateFilesDest = await copyCustomTemplateFiles(join(__dirname, 'tmp', PACKAGE_NAME))
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return customTemplateFilesDest
    }, 'Should copy files')
    runs(() => {
      expect(existsSync(join(customTemplateFilesDest, 'pdfFooter.html'))).toBe(true)
      expect(existsSync(join(customTemplateFilesDest, 'pdfHeader.html'))).toBe(true)
      expect(existsSync(join(customTemplateFilesDest, 'styles.css'))).toBe(true)
      rimraf.sync(customTemplateFilesDest)
      expect(existsSync(customTemplateFilesDest)).toBe(false)
    })
  })

  it(`could get highlight.js css files and files contain default highlight theme`, () => {
    expect(getHighlightJsStyles()).toContain(getcodeHighlightingTheme())
  })

  it('could get highlight.js style path by file name', () => {
    const path = getHighlightJsStylePathByName(getcodeHighlightingTheme())
    expect(existsSync(path)).toBe(true)
  })

  const testFiles = ['UTF-8.md', 'ISO-8859-1.md', 'Windows-1252.md']

  testFiles.forEach((testFile) => {
    it(`could read ${testFile} file and convert charset to ${CHARSET}`, () => {
      let content
      runs(async () => {
        try {
          content = await readFile(join(__dirname, 'markdown', testFile), CHARSET)
        } catch (e) {
          throw e
        }
      })
      waitsFor(() => {
        return content
      }, 'Should get content')
      runs(() => {
        expect(content).toMatch(escapeRegExp('Hällö Wörld'))
      })
    })
  })

  it(`could read files and combine them`, () => {
    let content
    runs(async () => {
      try {
        const filePaths = [
          getMarkdownTestFilePath('Windows-1252.md'),
          getMarkdownTestFilePath('simple.md')
        ]
        content = await readFilesCombine(filePaths, CHARSET)
      } catch (e) {
        throw e
      }
    })
    waitsFor(() => {
      return content
    }, 'Should get content of files')
    runs(() => {
      expect(content).toMatch(escapeRegExp('Hällö Wörld'))
      expect(content).toMatch(escapeRegExp('Heading 1'))
    })
  })

})
