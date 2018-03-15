'use babel'

import { join } from 'path'
import { join as implode, replace, startCase } from 'lodash'
import { SUPPORTED_FORMATS, SUPPORTED_UNITS } from './api/convert/headlessChrome'

export const PACKAGE_NAME = 'markdown-themeable-pdf'

export const CHARSET = 'UTF-8'

export const config = (highlightJsStyles = []) => {
  const highlightJsStylesEnum = []
  highlightJsStyles.forEach((value, index) => {
    highlightJsStylesEnum.push({ value, description: startCase(replace(value, '.css', '')) })
  })
  return {
    imageExportFileType: {
      type: 'string',
      default: 'jpeg',
      enum: ['jpeg', 'png'],
      order: 10
    },
    format: {
      title: 'Page Format',
      type: 'string',
      default: 'A4',
      enum: SUPPORTED_FORMATS,
      description: 'Available only for export as PDF!',
      order: 20
    },
    width: {
      title: 'Page Width',
      type: 'string',
      default: '',
      description: `Overrides Page Format for PDF if set. Supported units: ${implode(SUPPORTED_UNITS, ', ')} (E.g. 8.27in)`,
      order: 25
    },
    height: {
      title: 'Page Height',
      type: 'string',
      default: '',
      description: `Overrides Page Format for PDF if set. Supported units: ${implode(SUPPORTED_UNITS, ', ')} (E.g. 11.7in)`,
      order: 26
    },
    pageBorderTopSize: {
      type: 'string',
      default: '1cm',
      description: `Available only for PDF. Supported units: ${implode(SUPPORTED_UNITS, ', ')}`,
      order: 30
    },
    pageBorderRightSize: {
      type: 'string',
      default: '0.5cm',
      description: `Available only for PDF. Supported units: ${implode(SUPPORTED_UNITS, ', ')}`,
      order: 32
    },
    pageBorderBottomSize: {
      type: 'string',
      default: '1cm',
      description: `Available only for PDF. Supported units: ${implode(SUPPORTED_UNITS, ', ')}`,
      order: 34
    },
    pageBorderLeftSize: {
      type: 'string',
      default: '0.5cm',
      description: `Available only for PDF. Supported units: ${implode(SUPPORTED_UNITS, ', ')}`,
      order: 36
    },
    orientation: {
      title: 'Page Orientation',
      type: 'string',
      default: 'portrait',
      enum: [
        { value: 'portrait', description: 'Portrait' },
        { value: 'landscape', description: 'Landscape' }
      ],
      description: 'Available only for export as PDF',
      order: 40
    },
    imageQuality: {
      title: 'Image quality',
      type: 'integer',
      default: 90,
      description: 'The quality of the image, between <code>0 - 100</code>. Not applicable to png images',
      order: 50
    },
    enableSmartArrows: {
      type: 'boolean',
      default: true,
      description: 'Beautification for arrows like <code>--></code> or <code>==></code>. Note that using this plugin will interfere with using HTML comments in your Markdown.',
      order: 60
    },
    enableCheckboxes: {
      title: 'Enable task lists',
      type: 'boolean',
      default: true,
      description: 'Replacement for <code>[ ]</code> and <code>[x]</code> in markdown source.',
      order: 70
    },
    enableFootnotes: {
      title: 'Footnotes support',
      type: 'boolean',
      default: true,
      description: 'Enables footnotes markup like <code>!&#91;^1&#93;</code> or <code>!&#91;^longnote&#93;</code>.',
      order: 71
    },
    enableImSizeMarkup: {
      title: 'Enable size-specified image markups',
      type: 'boolean',
      default: true,
      description: 'Enables markup like <code>!&#91;test&#93;&#40;image.png =100x200&#41;</code> and will fill the width and height fields automatically if the specified image path is valid.',
      order: 72
    },
    enableEmoji: {
      title: 'Emoji support',
      type: 'integer',
      enum: [
        { value: 0, description: 'Disabled' },
        { value: 1, description: 'Full' },
        { value: 2, description: 'Light' }
      ],
      default: 1,
      description: '<code>Full</code>, with <a href="https://www.webpagefx.com/tools/emoji-cheat-sheet/">all github supported</a> emojis. <code>Light</code>, with only <a href="https://github.com/markdown-it/markdown-it-emoji/blob/master/lib/data/light.json">well-supported unicode</a> emojis.',
      order: 73
    },
    enableTOC: {
      title: 'Enable TOC (Table Of Content)',
      type: 'boolean',
      default: true,
      description: 'Config to render TOC <code>@!&#91;toc&#93;</code>.',
      order: 74
    },
    enableAnchor: {
      title: 'Set Heading Anchors',
      type: 'boolean',
      default: false,
      description: 'Config to set anchor links in headings.',
      order: 75
    },
    tocFirstLevel: {
      title: 'TOC first heading level',
      type: 'integer',
      enum: [1, 2, 3, 4, 5, 6],
      default: 2,
      description: 'Allows you to skip some heading level. Example: use <code>2</code> if you want to skip <code>&lt;h1&gt;</code> from the TOC.',
      order: 76
    },
    tocLastLevel: {
      title: 'TOC last heading level',
      type: 'integer',
      enum: [1, 2, 3, 4, 5, 6],
      default: 6,
      description: 'Allows you to skip some heading level. Example: use <code>5</code> if you want to skip <code>&lt;h6&gt;</code> from the TOC.',
      order: 78
    },
    anchorLinkSymbol: {
      title: 'Heading anchor link symbol',
      type: 'string',
      default: '#',
      description: 'Allows you to customize the anchor link symbol.',
      order: 79
    },
    enableHtmlInMarkdown: {
      title: 'Enable HTML tags in markdown source',
      type: 'boolean',
      default: true,
      description: 'Required for <code>&lt;div class=&quot;page-break&quot;&gt;&lt;/div&gt;</code>!',
      order: 80
    },
    enableLinkify: {
      title: 'Autoconvert URL-like text to links',
      type: 'boolean',
      default: false,
      order: 90
    },
    enableTypographer: {
      title: 'Enable Typographer',
      type: 'boolean',
      default: true,
      description: 'Some language-neutral replacement + quotes beautification.',
      order: 100
    },
    smartQuotes: {
      title: 'Quotes beautification replacement',
      type: 'string',
      default: '""\'\'',
      description: 'Double + single quotes replacement pairs, when typographer enabled.',
      order: 110
    },
    enableXHTML: {
      title: 'Use \'/\' to close single tags',
      type: 'boolean',
      default: false,
      description: 'Eg. <code>&lt;br /&gt;</code> or <code>&lt;img /&gt;</code>.',
      order: 120
    },
    enableBreaks: {
      title: 'Convert new lines',
      type: 'boolean',
      default: false,
      description: 'Convert new lines (<code>\\n</code>) in paragraphs into <code>&lt;br&gt;</code>.',
      order: 130
    },
    preWrap: {
      title: 'Break long code lines',
      type: 'boolean',
      default: true,
      description: 'Text inside code blocks will wrap when necessary, and on line breaks.',
      order: 135
    },
    enableCodeHighlighting: {
      title: 'Highlight code blocks with highlight.js',
      type: 'boolean',
      default: true,
      order: 140
    },
    codeHighlightingAuto: {
      title: 'Highlight code blocks automatically (detect language if not specified)',
      type: 'boolean',
      default: false,
      order: 142
    },
    codeHighlightingTheme: {
      type: 'string',
      default: 'github-gist.css',
      enum: highlightJsStylesEnum,
      description: 'Theme preview: https://highlightjs.org/static/demo/',
      order: 144
    },
    customStylesPath: {
      type: 'string',
      default: join(PACKAGE_NAME, 'styles.css'),
      description: 'You can use this stylesheet file to customize everything. The path is relative to Atom config directory <code>' + atom.config.configDirPath + '</code>. This relative path can also be used inside each project directory.',
      order: 150
    },
    enablePdfHeaderAndFooter: {
      type: 'boolean',
      default: true,
      order: 160
    },
    customHeaderPath: {
      type: 'string',
      default: join(PACKAGE_NAME, 'header.js'),
      description: 'You can use this javascript file to customize the document header. The path is relative to Atom config directory <code>' + atom.config.configDirPath + '</code>. This relative path can also be used inside each project.',
      order: 170
    },
    customFooterPath: {
      type: 'string',
      default: join(PACKAGE_NAME, 'footer.js'),
      description: 'You can use this javascript file to customize the document footer. The path is relative to Atom config directory <code>' + atom.config.configDirPath + '</code>. This relative path can also be used inside each project.',
      order: 190
    },
    openFile: {
      type: 'boolean',
      default: true,
      description: 'Open file after creation',
      order: 200
    }
  }
}

export default config
