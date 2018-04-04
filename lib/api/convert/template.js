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
    addBootstrapClasses($)
    resolve(`<!DOCTYPE html>\n${$.html()}`)
  })
}

export const header = (content, css, padding, basePath) => {
  return new Promise(async (resolve) => {
    if (content) {
      const $ = load(`<header id="pageHeader" class="markdown-body">\n${content}\n</header>`)
      $('#pageHeader')
        .before(`<style>\n${css}\n</style>`)
        .append('<div style="clear: both;"></div>')
        .css({
          'padding-left': get(padding, 'left'),
          'padding-right': get(padding, 'right'),
          'margin-left': '-5px',
          'margin-right': '-5px'
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
      resolve($('body').html())
    } else {
      resolve(content)
    }
  })
}

export const footer = (content, css, padding, basePath) => {
  return new Promise(async (resolve) => {
    if (content) {
      const $ = load(`<footer id="pageFooter" class="markdown-body">\n${content}\n</footer>`)
      $('#pageFooter')
        .before(`<style>\n${css}\n</style>`)
        .append('<div style="clear: both;"></div>')
        .css({
          'padding-left': get(padding, 'left'),
          'padding-right': get(padding, 'right'),
          'margin-left': '-5px',
          'margin-right': '-5px'
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

const addBootstrapClasses = ($) => {
  $('pre > code')
    .addClass('jumbotron rounded-0 border-bottom border-primary')
  $('blockquote')
    .addClass('blockquote')
  $('h1, h2')
    .addClass('border-bottom pb-1 mb-4')
  $('.toc')
    .addClass('pt-4 pr-4 pb-4 text-muted border')
    .find('> li')
    .addClass('pb-1 pt-1')
    .find('> a')
    .addClass('font-weight-bold')
  $('table')
    .addClass('table table-striped')
  const checkbox = $('.checkbox')
  checkbox
    .closest('ul').addClass('list-unstyled')
  checkbox
    .addClass('custom-control custom-checkbox')
  checkbox
    .find('input').addClass('custom-control-input').attr('disabled', 'disabled')
  checkbox
    .find('label').addClass('custom-control-label')
  checkbox
    .find('input:checked').removeAttr('disabled')
}
