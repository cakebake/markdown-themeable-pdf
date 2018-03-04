'use babel'

import { get, merge } from 'lodash'
import { join } from 'path'
import config from '../lib/config'
import { readFile, getFileDirectory } from '../lib/api/filesystem'
import markdownToHTML from '../lib/api/convert/markdownToHTML'

let currentMdFilePath = ''

export const getCurrentMdFilePath = () => currentMdFilePath

export const markdownItOptions = () => {
  return {
    html: get(config, 'enableHtmlInMarkdown.default'),
    linkify: get(config, 'enableLinkify.default'),
    typographer: get(config, 'enableTypographer.default'),
    xhtmlOut: get(config, 'enableXHTML.default'),
    breaks: get(config, 'enableBreaks.default'),
    quotes: get(config, 'smartQuotes.default'),
    enableCodeHighlighting: get(config, 'enableCodeHighlighting.default'),
    codeHighlightingAuto: get(config, 'codeHighlightingAuto.default'),
    enableImSizeMarkup: get(config, 'enableImSizeMarkup.default'),
    enableCheckboxes: get(config, 'enableCheckboxes.default'),
    enableSmartArrows: get(config, 'enableSmartArrows.default'),
    enableTOC: get(config, 'enableTocAndAnchor.default') === 'TOC enabled' || get(config, 'enableTocAndAnchor.default') === 'TOC and Anchors enabled',
    enableAnchor: get(config, 'enableTocAndAnchor.default') === 'Anchors enabled' || get(config, 'enableTocAndAnchor.default') === 'TOC and Anchors enabled',
    tocFirstLevel: get(config, 'tocFirstLevel.default'),
    tocLastLevel: get(config, 'tocLastLevel.default'),
    enableEmoji: get(config, 'enableEmoji.default'),
    enableFootnotes: get(config, 'enableFootnotes.default')
  }
}

export const getMarkdown = (testFile) => {
  currentMdFilePath = join(__dirname, 'markdown', testFile)
  return readFile(currentMdFilePath)
}

export const getHtml = (markdown, _options = {}, isFinalFormat = true) => {
  return markdownToHTML(markdown, isFinalFormat, merge(markdownItOptions(), _options), getFileDirectory(currentMdFilePath))
}
