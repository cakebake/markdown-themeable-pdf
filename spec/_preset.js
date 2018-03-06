'use babel'

import { merge } from 'lodash'
import { join, resolve as pathResolve } from 'path'
import { readFile, getFileDirectory } from '../lib/api/filesystem'
import { getConfig } from '../lib/api/atom'
import markdownToHTML from '../lib/api/convert/markdownToHTML'

let currentMdFilePath = ''

export const getCurrentMdFilePath = () => currentMdFilePath

// fake for spec suit, because atom project path points to /tmp -.-
export const getProjectRootPath = () => pathResolve(__dirname, '..')

export const getCustomStylesPath = () => getConfig('customStylesPath', true)

export const getcodeHighlightingTheme = () => getConfig('codeHighlightingTheme', true)

export const markdownItOptions = () => {
  return {
    html: getConfig('enableHtmlInMarkdown', true),
    linkify: getConfig('enableLinkify', true),
    typographer: getConfig('enableTypographer', true),
    xhtmlOut: getConfig('enableXHTML', true),
    breaks: getConfig('enableBreaks', true),
    quotes: getConfig('smartQuotes', true),
    enableCodeHighlighting: getConfig('enableCodeHighlighting', true),
    codeHighlightingAuto: getConfig('codeHighlightingAuto', true),
    enableImSizeMarkup: getConfig('enableImSizeMarkup', true),
    enableCheckboxes: getConfig('enableCheckboxes', true),
    enableSmartArrows: getConfig('enableSmartArrows', true),
    enableTOC: getConfig('enableTocAndAnchor', true) === 'TOC enabled' || getConfig('enableTocAndAnchor', true) === 'TOC and Anchors enabled',
    enableAnchor: getConfig('enableTocAndAnchor', true) === 'Anchors enabled' || getConfig('enableTocAndAnchor', true) === 'TOC and Anchors enabled',
    tocFirstLevel: getConfig('tocFirstLevel', true),
    tocLastLevel: getConfig('tocLastLevel', true),
    enableEmoji: getConfig('enableEmoji', true),
    enableFootnotes: getConfig('enableFootnotes', true)
  }
}

export const getMarkdownTestFilePath = (testFile) => join(__dirname, 'markdown', testFile)

export const getMarkdown = (testFile) => {
  currentMdFilePath = getMarkdownTestFilePath(testFile)
  return readFile(currentMdFilePath)
}

export const getHtml = (markdown, _options = {}, isFinalFormat = true) => {
  return markdownToHTML(markdown, isFinalFormat, merge(markdownItOptions(), _options), getFileDirectory(currentMdFilePath))
}
