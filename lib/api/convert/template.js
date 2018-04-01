'use babel'

import { load } from 'cheerio'
import { get } from 'lodash'
import { base64Src } from './manipulation'

export const body = (content, charset, css) => {
  return new Promise((resolve) => {
    const $ = load(`<main id="pageContent">\n${content}\n</main>`)
    const getTitle = ($) => {
      const header = $(':header').first().clone()
      header.find('.anchor').remove()
      return header.text().trim() || 'Document'
    }
    $('head')
      .append(`<meta charset="${charset}">`)
      .append(`<title>${getTitle($)}</title>`)
      .append(`<style>\n${css}\n</style>`)
    resolve(`<!DOCTYPE html>\n${$.html()}`)
  })
}

export const header = (content, css, margin, basePath) => {
  return new Promise((resolve) => {
    if (content) {
      let $ = load(`<header id="pageHeader">\n${content}\n</header>`)
      $('#pageHeader')
        .before(`<style>\n${css}\n</style>`)
        .append('<div style="clear: both;"></div>')
        .css({ 'margin-left': get(margin, 'left'), 'margin-right': get(margin, 'right') })
        .find('img').each((i, elem) => {
          const img = $(elem)
          img.attr('src', base64Src(img.attr('src'), basePath))
        })
      $('script').each((i, elem) => {
        try {
          const code = $(elem).html()
          if (code) {
            // eslint-disable-next-line no-new-func
            Function('$', code).call({}, $)
          }
          $(elem).remove()
        } catch (e) {
          console.error(e)
        }
      })
      resolve($('body').html())
    } else {
      resolve(content)
    }
  })
}

export const footer = (content, css, margin, basePath) => {
  return new Promise((resolve) => {
    if (content) {
      const $ = load(`<footer id="pageFooter">\n${content}\n</footer>`)
      $('#pageFooter')
        .before(`<style>\n${css}\n</style>`)
        .append('<div style="clear: both;"></div>')
        .css({ 'margin-left': get(margin, 'left'), 'margin-right': get(margin, 'right') })
        .find('img').each((i, elem) => {
          const img = $(elem)
          img.attr('src', base64Src(img.attr('src'), basePath))
        })
      $('script').each((i, elem) => {
        try {
          const code = $(elem).html()
          if (code) {
            // eslint-disable-next-line no-new-func
            Function('$', code).call({}, $)
          }
          $(elem).remove()
        } catch (e) {
          console.error(e)
        }
      })
      resolve($('body').html())
    } else {
      resolve(content)
    }
  })
}
