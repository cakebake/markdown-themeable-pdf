'use babel'

import hljs from 'highlight.js'
import markdownIt from 'markdown-it'
import markdownItImSize from 'markdown-it-imsize'
import markdownItCheckbox from 'markdown-it-checkbox'
import markdownItSmartArrows from 'markdown-it-smartarrows'
// import markdownItAnchor from 'markdown-it-anchor'
import { escape } from 'lodash'
import { getConfig } from '../atom'

const markdownToHTML = (markdown, isFinalFormat = false) => {
  return new Promise((resolve, reject) => {
    const html = render(markdown)
    console.log(html);
    resolve(html)
  })
}

const render = (markdown) => {
  const md = markdownIt({
    html: getConfig('enableHtmlInMarkdown'),
    linkify: getConfig('enableLinkify'),
    typographer: getConfig('enableTypographer'),
    xhtmlOut: getConfig('enableXHTML'),
    breaks: getConfig('enableBreaks'),
    quotes: getConfig('smartQuotes'),
    langPrefix: `hljs `,
    highlight: (str, lang) => {
      const auto = getConfig('codeHighlightingAuto')
      if (lang && hljs.getLanguage(lang)) {
        try {
          if (auto) {
            return `<pre class="hljs"><code>${hljs.highlight(lang, str, true).value}</code></pre>`
          } else {
            return hljs.highlight(lang, str).value
          }
        } catch (__) {}
      }
      if (auto) {
        return `<pre class="hljs"><code>${escape(str)}</code></pre>`
      }
      return ''
    }
  })
  // size-specified image markups
  if (getConfig('enableImSizeMarkup')) {
    md.use(markdownItImSize, {
      autofill: false
    })
  }
  // checkboxes
  if (getConfig('enableCheckboxes')) {
    md.use(markdownItCheckbox, {
      divWrap: false,
      divClass: 'checkbox',
      idPrefix: 'checkbox-'
    })
  }
  // smart arrows
  if (getConfig('enableSmartArrows')) {
    md.use(markdownItSmartArrows)
  }
  // header anchors
  // md.use(markdownItAnchor)

  return md.render(markdown)
}

export default markdownToHTML
