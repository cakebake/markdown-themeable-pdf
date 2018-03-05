'use babel'

import { load } from 'cheerio'
import { getCustomConfigFilePath } from './filesystem'

const template = (content, title, htmlIsFinalFormat, charset, css) => {
  return new Promise((resolve, reject) => {
    const $ = load(`<main id="pageContent">${content}</main>`)

    $('head')
      .append(`<meta charset="${charset}">`)
      .append(`<title>${title}</title>`)
      .append(`<style>${css}</style>`)

    $('body')
      .prepend(`<header id="pageHeader" class="meta">${getHeader()}</header>`)
      .append(`<footer id="pageFooter" class="meta">${getFooter()}</footer>`)

    const html = `<!DOCTYPE html>\n${$.html()}`
    resolve(html)
  })
}

const getHeader = () => {
  return '<p>header</p>'
}

const getFooter = () => {
  return '<p>footer</p>'
}

export default template
