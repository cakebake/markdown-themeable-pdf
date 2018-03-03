'use babel'

import markdownIt from 'markdown-it'
import markdownItImSize from 'markdown-it-imsize'
import markdownItCheckbox from 'markdown-it-checkbox'
import markdownItSmartArrows from 'markdown-it-smartarrows'
import markdownItHljs from 'markdown-it-highlightjs'
// import markdownItAnchor from 'markdown-it-anchor'
import { get } from 'lodash'

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
  const md = markdownIt(options)
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
  // header anchors
  // md.use(markdownItAnchor)
  //highlight.js
  if (get(options, 'enableCodeHighlighting', true)) {
    md.use(markdownItHljs, {
      auto: get(options, 'codeHighlightingAuto', false),
      code: false
    })
  }

  return md.render(markdown)
}

export default markdownToHTML
