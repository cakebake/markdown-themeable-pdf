'use babel'

import { isEmpty, get } from 'lodash'
import markdownToHTML from './convert/markdownToHTML'
import template from './template'
import {
  readFile,
  readFilesCombine,
  writeFile,
  getFileDirectory,
  getFileName,
  getHighlightJsStylePathByName
} from './filesystem'
import { getConfig, getCssFilePaths, getProjectRootPathByFilePath } from './atom'

export const CHARSET = 'UTF-8'

const options = () => {
  return {
    customStylesPath: getConfig('customStylesPath'),
    codeHighlightingTheme: getConfig('codeHighlightingTheme'),
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
        const directory = getFileDirectory(filePath)
        const fileName = getFileName(filePath)
        const markdown = await readFile(filePath, CHARSET)
        const html = await markdownToHTML(markdown, htmlIsFinalFormat, get(opt, 'markdownIt'), directory)
        const cssFiles = getCssFilePaths(
          get(opt, 'customStylesPath'),
          getProjectRootPathByFilePath(filePath),
          get(opt, 'markdownIt.enableCodeHighlighting') ? getHighlightJsStylePathByName(get(opt, 'codeHighlightingTheme')) : null
        )
        const css = await readFilesCombine(cssFiles, CHARSET)
        const htmlTemplate = await template(html, fileName, htmlIsFinalFormat, CHARSET, css)
        const exportFilePath = await writeFile(htmlTemplate, directory, fileName, exportFileType, CHARSET)
        console.log(htmlTemplate)
        resolve(exportFilePath)
      } catch (e) {
        reject(e)
      }
    } else {
      reject('File path to markdown file is unknown')
    }
  })
}

export default convert
