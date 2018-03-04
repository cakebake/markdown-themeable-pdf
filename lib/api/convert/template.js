'use babel'

import { load } from 'cheerio'
import { CHARSET } from '../convert'

const template = (content, title, htmlIsFinalFormat) => {
  return new Promise((resolve, reject) => {
    const html = build(content, title, htmlIsFinalFormat)
    resolve(html)
  })
}

const build = (content, title, htmlIsFinalFormat) => {
  const $ = load(`<main id="pageContent">${content}</main>`)
  $('head')
    .append(`<meta charset="${CHARSET}">`)
    .append(`<title>${title}</title>`)
    .append(getStyle())
  $('body')
    .prepend(`<header id="pageHeader" class="meta">${getHeader()}</header>`)
    .append(`<footer id="pageFooter" class="meta">${getFooter()}</footer>`)
  return `<!DOCTYPE html>\n${$.html()}`
}

const getHeader = () => {
  return '<p>header</p>'
}

const getFooter = () => {
  return '<p>footer</p>'
}

const getStyle = () => {
  return '<style>html, body { color: red }</style>'
}

export default template
