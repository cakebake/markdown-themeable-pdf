'use babel'

import { isEmpty, get } from 'lodash'
import markdownToHTML from './convert/markdownToHTML'
import { detectFileEncoding, readFileContent } from './filesystem'
import { getConfig } from './atom'

const options = () => {
  return {
    markdownIt: {
      html: getConfig('enableHtmlInMarkdown'),
      linkify: getConfig('enableLinkify'),
      typographer: getConfig('enableTypographer'),
      xhtmlOut: getConfig('enableXHTML'),
      breaks: getConfig('enableBreaks'),
      quotes: getConfig('smartQuotes'),
      langPrefix: 'hljs ',
      enableCodeHighlighting: getConfig('enableCodeHighlighting'),
      codeHighlightingAuto: getConfig('codeHighlightingAuto'),
      enableImSizeMarkup: getConfig('enableImSizeMarkup'),
      enableCheckboxes: getConfig('enableCheckboxes'),
      enableSmartArrows: getConfig('enableSmartArrows')
    }
  }
}

const convert = (filePath, exportFileType, encoding) => {
  return new Promise(async (resolve, reject) => {
    if (!isEmpty(filePath)) {
      encoding = await detectFileEncoding(filePath, encoding)
      try {
        const htmlIsFinalFormat = (exportFileType === 'html')
        const markdown = await readFileContent(filePath, encoding)
        const html = await markdownToHTML(markdown, htmlIsFinalFormat, get(options(), 'markdownIt'))
        console.log(html)
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
