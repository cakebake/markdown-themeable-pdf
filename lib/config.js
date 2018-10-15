'use babel'

import { join } from 'path'
import { join as implode, replace, startCase } from 'lodash'
import { SUPPORTED_FORMATS, SUPPORTED_UNITS } from './api/convert/headlessChrome'
import { getUserAtomPath } from './api/atom'
import { getHighlightJsStyles } from './style/highlightJs'
import { name, version } from '../package.json'

export const PACKAGE_NAME = name

export const PACKAGE_VERSION = version

export const CHARSET = 'UTF-8'

export const config = () => {
  return {
    configFormat: {
      title: 'Output format',
      type: 'object',
      collapsed: true,
      order: 10,
      properties: configFormat()
    },
    configHeaderFooter: {
      title: 'PDF Header & Footer',
      type: 'object',
      collapsed: true,
      order: 20,
      properties: configHeaderFooter()
    },
    configHeadings: {
      title: 'Table of content and Headings',
      type: 'object',
      collapsed: true,
      order: 30,
      properties: configHeadings()
    },
    configRender: {
      title: 'Markdown render options',
      type: 'object',
      collapsed: true,
      order: 40,
      properties: configRender()
    },
    configHighlighting: {
      title: 'Code highlighting',
      type: 'object',
      collapsed: true,
      order: 50,
      properties: configHighlighting()
    },
    configStyle: {
      title: 'Custom style',
      type: 'object',
      collapsed: true,
      order: 60,
      properties: configStyle()
    },
    configGeneral: {
      title: 'General settings',
      type: 'object',
      collapsed: true,
      order: 70,
      properties: configGeneral()
    }
  }
}

const configFormat = () => {
  return {
    format: {
      title: 'Page Format',
      type: 'string',
      default: 'A4',
      enum: SUPPORTED_FORMATS,
      description: 'Available only for export as PDF!',
      order: 10
    },
    width: {
      title: 'Page Width',
      type: 'string',
      default: '',
      description: `Overrides Page Format for PDF if set. Supported units: ${implode(SUPPORTED_UNITS, ', ')} (E.g. 8.27in)`,
      order: 20
    },
    height: {
      title: 'Page Height',
      type: 'string',
      default: '',
      description: `Overrides Page Format for PDF if set. Supported units: ${implode(SUPPORTED_UNITS, ', ')} (E.g. 11.7in)`,
      order: 30
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
    pageBorderTopSize: {
      title: 'Page Border-Top',
      type: 'string',
      default: '2.5cm',
      description: `Available only for PDF. Supported units: ${implode(SUPPORTED_UNITS, ', ')}`,
      order: 50
    },
    pageBorderRightSize: {
      title: 'Page Border-Right',
      type: 'string',
      default: '1cm',
      description: `Available only for PDF. Supported units: ${implode(SUPPORTED_UNITS, ', ')}`,
      order: 60
    },
    pageBorderBottomSize: {
      title: 'Page Border-Bottom',
      type: 'string',
      default: '2cm',
      description: `Available only for PDF. Supported units: ${implode(SUPPORTED_UNITS, ', ')}`,
      order: 70
    },
    pageBorderLeftSize: {
      title: 'Page Border-Left',
      type: 'string',
      default: '1cm',
      description: `Available only for PDF. Supported units: ${implode(SUPPORTED_UNITS, ', ')}`,
      order: 80
    }
  }
}

const configHeaderFooter = () => {
  return {
    enablePdfHeaderAndFooter: {
      title: 'Enable Header & Footer',
      type: 'boolean',
      default: true,
      order: 10
    },
    customHeaderPath: {
      title: 'Custom header',
      type: 'string',
      default: join(PACKAGE_NAME, 'pdfHeader.html'),
      description: `You can use this file to customize the PDF header. The path is relative to Atom config directory <code>${getUserAtomPath()}</code>. This relative path can also be used inside each project`,
      order: 20
    },
    customFooterPath: {
      title: 'Custom footer',
      type: 'string',
      default: join(PACKAGE_NAME, 'pdfFooter.html'),
      description: `You can use this file to customize the PDF footer. The path is relative to Atom config directory <code>${getUserAtomPath()}</code>. This relative path can also be used inside each project`,
      order: 30
    }
  }
}

const configHeadings = () => {
  return {
    enableTOC: {
      title: 'Enable TOC (Table Of Content)',
      type: 'boolean',
      default: true,
      description: 'Config to render TOC <code>@!&#91;toc&#93;</code>.',
      order: 10
    },
    tocFirstLevel: {
      title: 'TOC first heading level',
      type: 'integer',
      enum: [1, 2, 3, 4, 5, 6],
      default: 2,
      description: 'Allows you to skip some heading level. Example: use <code>2</code> if you want to skip <code>&lt;h1&gt;</code> from the TOC.',
      order: 20
    },
    tocLastLevel: {
      title: 'TOC last heading level',
      type: 'integer',
      enum: [1, 2, 3, 4, 5, 6],
      default: 6,
      description: 'Allows you to skip some heading level. Example: use <code>5</code> if you want to skip <code>&lt;h6&gt;</code> from the TOC.',
      order: 30
    },
    enableAnchor: {
      title: 'Set Heading Anchors',
      type: 'boolean',
      default: false,
      description: 'Config to set anchor links in headings.',
      order: 40
    },
    anchorLinkSymbol: {
      title: 'Heading anchor link symbol',
      type: 'string',
      default: '#',
      description: 'Allows you to customize the anchor link symbol.',
      order: 50
    }
  }
}

const configRender = () => {
  return {
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
      order: 10
    },
    enableBreaks: {
      title: 'Convert new lines',
      type: 'boolean',
      default: false,
      description: 'Convert new lines (<code>\\n</code>) in paragraphs into <code>&lt;br&gt;</code>.',
      order: 20
    },
    enableLinkify: {
      title: 'Autoconvert URL-like text to links',
      type: 'boolean',
      default: true,
      order: 30
    },
    enableHtmlInMarkdown: {
      title: 'Enable HTML tags in markdown source',
      type: 'boolean',
      default: true,
      description: 'Required for <code>&lt;div class=&quot;page-break&quot;&gt;&lt;/div&gt;</code> page breaks!',
      order: 40
    },
    enableSmartArrows: {
      title: 'Smart arrows',
      type: 'boolean',
      default: true,
      description: 'Beautification for arrows like <code>--></code> or <code>==></code>. Note that using this plugin will interfere with using HTML comments in your Markdown.',
      order: 50
    },
    enableTypographer: {
      title: 'Enable Typographer',
      type: 'boolean',
      default: true,
      description: 'Some language-neutral replacement + quotes beautification.',
      order: 60
    },
    smartQuotes: {
      title: 'Quotes beautification replacement',
      type: 'string',
      default: '""\'\'',
      description: 'Double + single quotes replacement pairs, when typographer enabled.',
      order: 70
    },
    enableCheckboxes: {
      title: 'Enable task lists',
      type: 'boolean',
      default: true,
      description: 'Replacement for <code>[ ]</code> and <code>[x]</code> in markdown source.',
      order: 80
    },
    enableFootnotes: {
      title: 'Footnotes support',
      type: 'boolean',
      default: true,
      description: 'Enables footnotes markup like <code>!&#91;^1&#93;</code> or <code>!&#91;^longnote&#93;</code>.',
      order: 90
    },
    enableImSizeMarkup: {
      title: 'Enable size-specified image markups',
      type: 'boolean',
      default: true,
      description: 'Enables markup like <code>!&#91;test&#93;&#40;image.png =100x200&#41;</code> and will fill the width and height fields automatically if the specified image path is valid.',
      order: 100
    },
    enableXHTML: {
      title: 'Enable XHTML',
      type: 'boolean',
      default: false,
      description: 'Eg. <code>&lt;br /&gt;</code> or <code>&lt;img /&gt;</code> instead of <code>&lt;br&gt;</code> or <code>&lt;img&gt;</code>.',
      order: 110
    }
  }
}

const configHighlighting = () => {
  const themes = []
  getHighlightJsStyles().forEach((value) => {
    themes.push({ value, description: startCase(replace(value, '.css', '')) })
  })
  return {
    enableCodeHighlighting: {
      title: 'Highlight code blocks with highlight.js',
      type: 'boolean',
      default: true,
      order: 10
    },
    codeHighlightingAuto: {
      title: 'Highlight code blocks automatically (detect language if not specified)',
      type: 'boolean',
      default: false,
      order: 20
    },
    codeHighlightingTheme: {
      title: 'Highlight Theme',
      type: 'string',
      default: 'github-gist.css',
      enum: themes,
      description: 'Theme preview: https://highlightjs.org/static/demo/',
      order: 30
    }
  }
}

const configStyle = () => {
  return {
    enableDefaultStyles: {
      title: 'Enable default stylesheet',
      type: 'boolean',
      default: true,
      description: 'Disable this to completely customize the look with custom CSS. The standard design is then only used for code highlighting (if enabled) and a few important CSS statements.',
      order: 10
    },
    customStylesPath: {
      title: 'Custom stylesheet',
      type: 'string',
      default: join(PACKAGE_NAME, 'styles.css'),
      description: `You can use this stylesheet file to customize everything. The path is relative to Atom config directory <code>${getUserAtomPath()}</code>. This relative path can also be used inside each project directory`,
      order: 20
    }
  }
}

const configGeneral = () => {
  return {
    openFile: {
      title: 'Open file after creation',
      type: 'integer',
      enum: [
        { value: 0, description: 'Disabled' },
        { value: 1, description: 'Desktop´s default manner' },
        { value: 2, description: 'In a file manager' }
      ],
      default: 1,
      order: 10
    },
    imageExportFileType: {
      title: 'Image file type',
      type: 'string',
      default: 'png',
      enum: [
        { value: 'jpeg', description: 'JPEG' },
        { value: 'png', description: 'PNG' }
      ],
      order: 20
    },
    imageQuality: {
      title: 'Image quality',
      type: 'integer',
      default: 90,
      description: 'The quality of the image, between <code>0 - 100</code>. Not applicable to png images',
      order: 30
    },
    downloadChromiumOnActivation: {
      title: 'Automatic dependency download ',
      type: 'boolean',
      default: true,
      description: 'Prompt for chromium download on atom startup or package update. Chromium is used to create the PDF files.',
      order: 40
    }
  }
}

export default config
