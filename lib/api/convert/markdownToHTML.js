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
import { parse as parseEmoji } from 'twemoji'
import { get } from 'lodash'
import { join, dirname } from 'path'
import { resolveSrc } from './manipulation'

const markdownToHTML = (markdown, options) => {
  return new Promise((resolve, reject) => {
    try {
      let md = markdownIt(options)
      md = loadPlugins(md, options)
      const html = md.render(markdown)
      resolve(html)
    } catch (e) {
      reject(e)
    }
  })
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
  md.use(markdownItTocAndAnchor, {
    toc: get(options, 'enableTOC', true),
    tocClassName: 'toc',
    tocFirstLevel: get(options, 'tocFirstLevel', 1),
    tocLastLevel: get(options, 'tocLastLevel', 6),
    anchorLink: get(options, 'enableAnchor', true),
    anchorLinkBefore: true,
    anchorLinkSpace: true,
    anchorLinkSymbol: get(options, 'anchorLinkSymbol', '#'),
    anchorClassName: 'anchor',
    anchorLinkSymbolClassName: 'anchor-symbol'
  })
  // emoji
  if (get(options, 'enableEmoji', 1) === 1) {
    md.use(markdownItEmoji)
    md.renderer.rules.emoji = (token, idx) => {
      return parseEmoji(token[idx].content, (icon, options, variant) => {
        try {
          const svgPath = join(dirname(require.resolve('twemoji')), 'svg')
          return resolveSrc(`${icon}.svg`, svgPath)
        } catch (e) {
          console.error(e)
          return false
        }
      })
    }
  }
  if (get(options, 'enableEmoji', 1) === 2) {
    md.use(markdownItEmojiLight)
  }
  // footnotes
  if (get(options, 'enableFootnotes', true)) {
    md.use(markdownItFootnote)
  }

  return md
}

export default markdownToHTML
