'use babel'

import { load } from 'cheerio'
import { getCustomConfigFilePath } from './filesystem'

const template = (content, title, htmlIsFinalFormat, charset, css) => {
  return new Promise((resolve, reject) => {
    const $ = load(`<main id="pageContent">\n${content}\n</main>`)

    $('head')
      .append(`<meta charset="${charset}">`)
      .append(`<title>${title}</title>`)
      .append(`<style>\n${css}\n</style>`)

    $('body')
      .prepend(`<header id="pageHeader" class="meta">\n${getHeader()}\n</header>`)
      .append(`<footer id="pageFooter" class="meta">\n${getFooter()}\n</footer>`)

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
