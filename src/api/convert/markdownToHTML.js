'use babel'

import markdownIt from 'markdown-it'
import markdownItImSize from 'markdown-it-imsize'
import markdownItCheckbox from 'markdown-it-checkbox'
import markdownItSmartArrows from 'markdown-it-smartarrows'
import markdownItHljs from 'markdown-it-highlightjs'
import markdownItTocAndAnchor from 'markdown-it-toc-and-anchor'
import markdownItEmoji from 'markdown-it-emoji'
import markdownItEmojiLight from 'markdown-it-emoji/light'
import markdownItFootnote from 'markdown-it-footnote'
import { get, toLower } from 'lodash'

const markdownToHTML = (markdown, isFinalFormat = false, options) => {
  return new Promise((resolve, reject) => {
    try {
      resolve(render(markdown, options))
    } catch (e) {
      reject(e)
    }
  })
}

const render = (markdown, options) => {
  let md

  md = markdownIt(options)
  md = loadPlugins(md, options)

  return md.render(markdown)
}

const loadPlugins = (md, options) => {
  // size-specified image markups
  if (get(options, 'enableImSizeMarkup', true)) {
    md.use(markdownItImSize, {
      autofill: false
    })
  }
  // checkboxes
  if (get(options, 'enableCheckboxes', true)) {
    md.use(markdownItCheckbox, {
      divWrap: false,
      divClass: 'checkbox',
      idPrefix: 'checkbox-'
    })
  }
  // smart arrows
  if (get(options, 'enableSmartArrows', true)) {
    md.use(markdownItSmartArrows)
  }
  // highlight.js
  if (get(options, 'enableCodeHighlighting', true)) {
    md.use(markdownItHljs, {
      auto: get(options, 'codeHighlightingAuto', false),
      code: false
    })
  }
  // toc and anchor
  if (get(options, 'enableTOC', true) || get(options, 'enableAnchor', true)) {
    md.use(markdownItTocAndAnchor, {
      toc: get(options, 'enableTOC', true),
      tocClassName: 'markdown-themeable-pdf-toc',
      tocFirstLevel: get(options, 'tocFirstLevel', 1),
      tocLastLevel: get(options, 'tocLastLevel', 6),
      anchorLink: get(options, 'enableAnchor', true),
      anchorLinkBefore: true,
      anchorLinkSpace: true,
      anchorLinkSymbol: get(options, 'anchorLinkSymbol', '#'),
      anchorClassName: 'markdown-themeable-pdf-anchor',
      anchorLinkSymbolClassName: 'markdown-themeable-pdf-anchor-symbol'
    })
  }
  // emoji
  if (toLower(get(options, 'enableEmoji', 'Full')) === 'full') {
    md.use(markdownItEmoji)
  }
  if (toLower(get(options, 'enableEmoji', 'Full')) === 'light') {
    md.use(markdownItEmojiLight)
  }
  // footnotes
  if (get(options, 'enableFootnotes', true)) {
    md.use(markdownItFootnote)
  }

  return md
}

export default markdownToHTML
