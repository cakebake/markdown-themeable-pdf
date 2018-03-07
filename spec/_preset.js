'use babel'

import { get, merge } from 'lodash'
import { join, resolve as pathResolve } from 'path'
import { readFile, getFileDirectory } from '../lib/api/filesystem'
import { options as _options } from '../lib/atom'
import markdownToHTML from '../lib/api/convert/markdownToHTML'

let _currentMdFilePath = ''

export const options = _options(true)

// fake for spec suit, because atom project path points to /tmp -.-
export const getProjectRootPath = () => pathResolve(__dirname, '..')

export const getCustomStylesPath = () => get(options, 'customStylesPath')

export const enableCodeHighlighting = () => get(options, 'markdownIt.enableCodeHighlighting')

export const getcodeHighlightingTheme = () => get(options, 'codeHighlightingTheme')

export const markdownItOptions = () => get(options, 'markdownIt')

export const setCurrentMdFilePath = (path) => _currentMdFilePath = path

export const getCurrentMdFilePath = () => _currentMdFilePath

export const getMarkdown = (testFile) => {
  setCurrentMdFilePath(getMarkdownTestFilePath(testFile))
  return readFile(getCurrentMdFilePath())
}

export const getHtml = (markdown, _options = {}, isFinalFormat = true) => {
  return markdownToHTML(markdown, isFinalFormat, merge(markdownItOptions(), _options), getFileDirectory(getCurrentMdFilePath()))
}

export const getMarkdownTestFilePath = (testFile) => join(__dirname, 'markdown', testFile)
