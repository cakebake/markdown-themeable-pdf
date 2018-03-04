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
import cheerio from 'cheerio'
import { resolveImgSrc } from '../filesystem'

let fileDirectory = ''

const markdownToHTML = (markdown, isFinalFormat, options, _fileDirectory) => {
  fileDirectory = _fileDirectory
  return new Promise((resolve, reject) => {
    try {
      resolve(render(markdown, options, isFinalFormat))
    } catch (e) {
      reject(e)
    }
  })
}

const render = (markdown, options, isFinalFormat) => {
  let md = markdownIt(options)
  if (!isFinalFormat) {
    md = fixSrcScheme(md)
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

const fixSrcScheme = (md) => {
  const defaultRenderer = {
    image: md.renderer.rules.image,
    html_block: md.renderer.rules.html_block
  }

  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const index = tokens[idx].attrIndex('src')
    tokens[idx].attrs[index][1] = resolveImgSrc(tokens[idx].attrs[index][1], fileDirectory)
    return defaultRenderer.image(tokens, idx, options, env, self)
  }

  md.renderer.rules.html_block = (tokens, idx, options, env, self) => {
    const $ = cheerio.load(tokens[idx].content)
    $('img').each((i, elem) => {
      const img = $(elem)
      img.attr('src', resolveImgSrc(img.attr('src'), fileDirectory))
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
