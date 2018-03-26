'use babel'

import { get, merge } from 'lodash'
import { join, resolve as pathResolve } from 'path'
import { readFile, getFileDirectory } from '../lib/api/filesystem'
import { getConfig } from '../lib/atom'
import _options from '../lib/options'
import markdownToHTML from '../lib/api/convert/markdownToHTML'

let _currentMdFilePath = ''

export const getOptions = () => _options(true)

const options = getOptions()

// fake for spec suit, because atom project path points to /tmp -.-
export const getProjectRootPath = () => pathResolve(__dirname, '..')

export const getCustomStylesPath = () => getConfig('customStylesPath', true)

export const getCustomHeaderPath = () => getConfig('customHeaderPath', true)

export const getCustomFooterPath = () => getConfig('customFooterPath', true)

export const enableCodeHighlighting = () => get(htmlOptions(), 'enableCodeHighlighting')

export const getcodeHighlightingTheme = () => getConfig('codeHighlightingTheme', true)

export const htmlOptions = () => get(options, 'html')

export const setCurrentMdFilePath = (path) => _currentMdFilePath = path

export const getCurrentMdFilePath = () => _currentMdFilePath

export const getMarkdown = (testFile) => {
  setCurrentMdFilePath(getMarkdownTestFilePath(testFile))
  return readFile(getCurrentMdFilePath())
}

export const getHtml = (markdown, _options = {}, isFinalFormat = true) => {
  return markdownToHTML(markdown, isFinalFormat, merge(htmlOptions(), _options), getFileDirectory(getCurrentMdFilePath()))
}

export const getMarkdownTestFileDir = () => join(__dirname, 'markdown')

export const getMarkdownTestFilePath = (testFile) => join(getMarkdownTestFileDir(), testFile)
