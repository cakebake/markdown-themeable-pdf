'use babel'

import { load } from 'cheerio'
import { get } from 'lodash'
import { base64Src } from './manipulation'

export const body = (content, charset, css, basePath) => {
  return new Promise(async (resolve) => {
    const $ = load(`<main id="pageContent">\n${content}\n</main>`)
    const getTitle = ($) => {
      const header = $(':header').first().clone()
      header.find('.anchor').remove()
      return header.text().trim() || 'Document'
    }
    const images = $('img')
    for (let i = 0; i < images.length; i++) {
      const img = $(images[i])
      img.attr('src', await base64Src(img.attr('src'), basePath))
    }
    $('head')
      .append(`<meta charset="${charset}">`)
      .append(`<title>${getTitle($)}</title>`)
      .append(`<style>\n${css}\n</style>`)
    resolve(`<!DOCTYPE html>\n${$.html()}`)
  })
}

export const header = (content, css, margin, basePath) => {
  return new Promise(async (resolve) => {
    if (content) {
      const $ = load(`<header id="pageHeader">\n${content}\n</header>`)
      const images = $('img')
      for (let i = 0; i < images.length; i++) {
        const img = $(images[i])
        img.attr('src', await base64Src(img.attr('src'), basePath))
      }
      $('#pageHeader')
        .before(`<style>\n${css}\n</style>`)
        .append('<div style="clear: both;"></div>')
        .css({ 'margin-left': get(margin, 'left'), 'margin-right': get(margin, 'right') })
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
  return new Promise(async (resolve) => {
    if (content) {
      const $ = load(`<footer id="pageFooter">\n${content}\n</footer>`)
      const images = $('img')
      for (let i = 0; i < images.length; i++) {
        const img = $(images[i])
        img.attr('src', await base64Src(img.attr('src'), basePath))
      }
      $('#pageFooter')
        .before(`<style>\n${css}\n</style>`)
        .append('<div style="clear: both;"></div>')
        .css({ 'margin-left': get(margin, 'left'), 'margin-right': get(margin, 'right') })
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
