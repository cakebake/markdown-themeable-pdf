'use babel'

import { load } from 'cheerio'
import { get } from 'lodash'
import { base64Src } from '../filesystem'

export const document = (content, title, charset, css) => {
  return new Promise((resolve) => {
    const $ = load(`<main id="pageContent">\n${content}\n</main>`)
    $('head')
      .append(`<meta charset="${charset}">`)
      .append(`<title>${title}</title>`)
      .append(`<style>\n${css}\n</style>`)
    resolve(`<!DOCTYPE html>\n${$.html()}`)
  })
}

export const header = (content, css, margin, fileDirectory) => {
  return new Promise((resolve) => {
    if (content) {
      const $ = load(`<header id="pageHeader">\n${content}\n</header>`)
      $('#pageHeader')
        .before(`<style>\n${css}\n</style>`)
        .append('<div style="clear: both;"></div>')
        .css({ 'margin-left': get(margin, 'left'), 'margin-right': get(margin, 'right') })
        .find('img').each((i, elem) => {
          const img = $(elem)
          img.attr('src', base64Src(img.attr('src'), fileDirectory))
        })
      resolve($('body').html())
    } else {
      resolve(content)
    }
  })
}

export const footer = (content, css, margin, fileDirectory) => {
  return new Promise((resolve) => {
    if (content) {
      const $ = load(`<footer id="pageFooter">\n${content}\n</footer>`)
      $('#pageFooter')
        .before(`<style>\n${css}\n</style>`)
        .append('<div style="clear: both;"></div>')
        .css({ 'margin-left': get(margin, 'left'), 'margin-right': get(margin, 'right') })
        .find('img').each((i, elem) => {
          const img = $(elem)
          img.attr('src', base64Src(img.attr('src'), fileDirectory))
        })
      resolve($('body').html())
    } else {
      resolve(content)
    }
  })
}
