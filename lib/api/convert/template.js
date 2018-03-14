'use babel'

import { load } from 'cheerio'

export const document = (content, title, charset, css) => {
  return new Promise((resolve, reject) => {
    const $ = load(`<main id="pageContent">\n${content}\n</main>`)

    $('head')
      .append(`<meta charset="${charset}">`)
      .append(`<title>${title}</title>`)
      .append(`<style>\n${css}\n</style>`)

    const html = `<!DOCTYPE html>\n${$.html()}`
    resolve(html)
  })
}

export const header = () => {
  return '<div style="font-size: 12px;">Header: <span class="date"></span> Page <span class="pageNumber"></span>/<span class="totalPages"></span></div>'
}

export const footer = () => {
  return '<div style="font-size: 12px;">Footer: <span class="date"></span> Page <span class="pageNumber"></span>/<span class="totalPages"></span></div>'
}
