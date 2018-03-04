'use babel'

import { isEmpty, get } from 'lodash'
import markdownToHTML from './convert/markdownToHTML'
import template from './convert/template'
import { readFile, getFileDirectory, getFileName } from './filesystem'
import { getConfig } from './atom'

export const CHARSET = 'UTF-8'

const options = () => {
  return {
    markdownIt: {
      html: getConfig('enableHtmlInMarkdown'),
      linkify: getConfig('enableLinkify'),
      typographer: getConfig('enableTypographer'),
      xhtmlOut: getConfig('enableXHTML'),
      breaks: getConfig('enableBreaks'),
      quotes: getConfig('smartQuotes'),
      enableCodeHighlighting: getConfig('enableCodeHighlighting'),
      codeHighlightingAuto: getConfig('codeHighlightingAuto'),
      enableImSizeMarkup: getConfig('enableImSizeMarkup'),
      enableCheckboxes: getConfig('enableCheckboxes'),
      enableSmartArrows: getConfig('enableSmartArrows'),
      enableTOC: getConfig('enableTocAndAnchor') === 'TOC enabled' || getConfig('enableTocAndAnchor') === 'TOC and Anchors enabled',
      enableAnchor: getConfig('enableTocAndAnchor') === 'Anchors enabled' || getConfig('enableTocAndAnchor') === 'TOC and Anchors enabled',
      tocFirstLevel: getConfig('tocFirstLevel'),
      tocLastLevel: getConfig('tocLastLevel'),
      anchorLinkSymbol: getConfig('anchorLinkSymbol'),
      enableEmoji: getConfig('enableEmoji'),
      enableFootnotes: getConfig('enableFootnotes')
    }
  }
}

const convert = (filePath, exportFileType, opt = null) => {
  return new Promise(async (resolve, reject) => {
    if (!isEmpty(filePath)) {
      opt = opt || options()
      if (exportFileType === 'img') {
        exportFileType = getConfig('imageExportFileType')
      }
      try {
        const htmlIsFinalFormat = (exportFileType === 'html')
        const markdown = await readFile(filePath, CHARSET)
        const html = await markdownToHTML(markdown, htmlIsFinalFormat, get(opt, 'markdownIt'), getFileDirectory(filePath))
        const htmlTemplate = await template(html, getFileName(filePath), htmlIsFinalFormat)
        console.log(htmlTemplate)
        if (htmlIsFinalFormat) {
          resolve(filePath)
        } else {
          resolve(filePath)
        }
      } catch (e) {
        reject(e)
      }
    } else {
      reject('File path to markdown file is unknown')
    }
  })
}

export default convert
