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
import { load } from 'cheerio'
import { join, dirname } from 'path'
import { base64Src } from '../filesystem'
import { PACKAGE_NAME } from '../../config'

const markdownToHTML = (markdown, isFinalFormat, options, fileDirectory) => {
  return new Promise((resolve, reject) => {
    try {
      const html = render(markdown, options, isFinalFormat, fileDirectory)
      resolve(html)
    } catch (e) {
      reject(e)
    }
  })
}

const render = (markdown, options, isFinalFormat, fileDirectory) => {
  let md = markdownIt(options)
  if (!isFinalFormat) {
    md = imageSrcManipulation(md, fileDirectory)
    md = innerWrapTableCell(md)
  }
  md = loadPlugins(md, options)

  return md.render(markdown)
}

const innerWrapTableCell = (md) => {
  md.renderer.rules.th_open = () => '<th><div>'
  md.renderer.rules.th_close = () => '</div></th>'
  md.renderer.rules.td_open = () => '<td><div>'
  md.renderer.rules.td_close = () => '</div></td>'
  return md
}

const imageSrcManipulation = (md, fileDirectory) => {
  const defaultRenderer = {
    image: md.renderer.rules.image,
    html_block: md.renderer.rules.html_block
  }

  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const index = tokens[idx].attrIndex('src')
    tokens[idx].attrs[index][1] = base64Src(tokens[idx].attrs[index][1], fileDirectory)
    return defaultRenderer.image(tokens, idx, options, env, self)
  }

  md.renderer.rules.html_block = (tokens, idx, options, env, self) => {
    const $ = load(tokens[idx].content)
    $('img').each((i, elem) => {
      const img = $(elem)
      img.attr('src', base64Src(img.attr('src'), fileDirectory))
    })
    tokens[idx].content = $('body').html()
    return defaultRenderer.html_block(tokens, idx, options, env, self)
  }

  return md
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
    tocClassName: `${PACKAGE_NAME}-toc`,
    tocFirstLevel: get(options, 'tocFirstLevel', 1),
    tocLastLevel: get(options, 'tocLastLevel', 6),
    anchorLink: get(options, 'enableAnchor', true),
    anchorLinkBefore: true,
    anchorLinkSpace: true,
    anchorLinkSymbol: get(options, 'anchorLinkSymbol', '#'),
    anchorClassName: `${PACKAGE_NAME}-anchor`,
    anchorLinkSymbolClassName: `${PACKAGE_NAME}-anchor-symbol`
  })
  // emoji
  if (get(options, 'enableEmoji', 1) === 1) {
    md.use(markdownItEmoji)
    md.renderer.rules.emoji = (token, idx) => {
      return parseEmoji(token[idx].content, (icon, options, variant) => {
        try {
          return base64Src(`${icon}.svg`, join(dirname(require.resolve('twemoji')), 'svg'))
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
