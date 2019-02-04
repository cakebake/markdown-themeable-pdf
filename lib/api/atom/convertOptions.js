'use babel'

import { getConfig } from './index'

export const options = (loadDefaults = false) => {
  return {
    theme: {
      enableDefaultStyles: getConfig('enableDefaultStyles', loadDefaults),
      codeHighlightingTheme: getConfig('codeHighlightingTheme', loadDefaults),
      customStylesPath: getConfig('customStylesPath', loadDefaults),
      customHeaderPath: getConfig('customHeaderPath', loadDefaults),
      customFooterPath: getConfig('customFooterPath', loadDefaults)
    },
    html: {
      html: getConfig('enableHtmlInMarkdown', loadDefaults),
      linkify: getConfig('enableLinkify', loadDefaults),
      typographer: getConfig('enableTypographer', loadDefaults),
      xhtmlOut: getConfig('enableXHTML', loadDefaults),
      breaks: getConfig('enableBreaks', loadDefaults),
      quotes: getConfig('smartQuotes', loadDefaults),
      enableCodeHighlighting: getConfig('enableCodeHighlighting', loadDefaults),
      codeHighlightingAuto: getConfig('codeHighlightingAuto', loadDefaults),
      enableImSizeMarkup: getConfig('enableImSizeMarkup', loadDefaults),
      enableCheckboxes: getConfig('enableCheckboxes', loadDefaults),
      enableSmartArrows: getConfig('enableSmartArrows', loadDefaults),
      enableTOC: getConfig('enableTOC', loadDefaults),
      enableAnchor: getConfig('enableAnchor', loadDefaults),
      tocFirstLevel: getConfig('tocFirstLevel', loadDefaults),
      tocLastLevel: getConfig('tocLastLevel', loadDefaults),
      anchorLinkSymbol: getConfig('anchorLinkSymbol', loadDefaults),
      enableEmoji: getConfig('enableEmoji', loadDefaults),
      enableFootnotes: getConfig('enableFootnotes', loadDefaults)
    },
    pdf: {
      format: getConfig('format', loadDefaults),
      width: getConfig('width', loadDefaults),
      height: getConfig('height', loadDefaults),
      landscape: getConfig('orientation', loadDefaults) === 'landscape',
      displayHeaderFooter: getConfig('enablePdfHeaderAndFooter', loadDefaults),
      margin: {
        top: getConfig('pageBorderTopSize', loadDefaults),
        right: getConfig('pageBorderRightSize', loadDefaults),
        bottom: getConfig('pageBorderBottomSize', loadDefaults),
        left: getConfig('pageBorderLeftSize', loadDefaults)
      }
    },
    jpeg: {
      quality: getConfig('imageQuality', loadDefaults),
      width: getConfig('width', loadDefaults),
      height: getConfig('height', loadDefaults)
    },
    png: {
      width: getConfig('width', loadDefaults),
      height: getConfig('height', loadDefaults)
    },
    imageExportFileType: getConfig('imageExportFileType', loadDefaults),
    timeout: getConfig('timeout', loadDefaults)
  }
}

export default options
