'use babel'

import { load } from 'cheerio'
import { get } from 'lodash'
import { base64Src } from './manipulation'

export const body = (content, charset, css, basePath) => {
  return new Promise(async (resolve) => {
    const $ = load(`<main id="pageContent" class="markdown-body">\n${content}\n</main>`)
    const getTitle = ($) => {
      const header = $(':header').first().clone()
      header.find('.anchor').remove()
      return header.text().trim() || 'Document'
    }
    $('head')
      .append(`<meta charset="${charset}">`)
      .append(`<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">`)
      .append(`<title>${getTitle($)}</title>`)
      .append(`<style>\n${css}\n</style>`)
    await base64Images($, basePath)
    addClasses($)
    resolve(`<!DOCTYPE html>\n${$.html()}`)
  })
}

export const header = (content, css, margin, basePath) => {
  return new Promise(async (resolve) => {
    if (content) {
      const $ = load(`<header id="pageHeader" class="markdown-body">\n${content}\n</header>`)
      $('#pageHeader')
        .before(`<style>\n${css}\n</style>`)
        .append('<div style="clear: both;"></div>')
        .css({
          'margin-left': get(margin, 'left', 0),
          'margin-right': get(margin, 'right', 0)
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
      await base64Images($, basePath)
      addClasses($)
      resolve($('body').html())
    } else {
      resolve(content)
    }
  })
}

export const footer = (content, css, margin, basePath) => {
  return new Promise(async (resolve) => {
    if (content) {
      const $ = load(`<footer id="pageFooter" class="markdown-body">\n${content}\n</footer>`)
      $('#pageFooter')
        .before(`<style>\n${css}\n</style>`)
        .append('<div style="clear: both;"></div>')
        .css({
          'margin-left': get(margin, 'left', 0),
          'margin-right': get(margin, 'right', 0)
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
      await base64Images($, basePath)
      addClasses($)
      resolve($('body').html())
    } else {
      resolve(content)
    }
  })
}

const base64Images = async ($, basePath) => {
  return new Promise(async (resolve) => {
    const images = $('img')
    for (let i = 0; i < images.length; i++) {
      const img = $(images[i])
      img.attr('src', await base64Src(img.attr('src'), basePath))
    }
    resolve()
  })
}

const addClasses = ($) => {
  const checkbox = $('.checkbox')
  checkbox
    .closest('ul').addClass('contains-task-list')
  checkbox
    .closest('li').addClass('task-list-item')
  checkbox
    .find('input').addClass('task-list-item-checkbox')
}
