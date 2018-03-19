'use babel'

import { load } from 'cheerio'
import { get } from 'lodash'

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

export const header = (content, css, margin) => {
  if (!content) {
    return content
  }
  return `
    <style>
      ${css}
    </style>
    <div id="pageHeader" style="margin-left: ${get(margin, 'left')}; margin-right: ${get(margin, 'right')};">
      ${content}
      <div style="clear: both;"></div>
    </div>
  `
}

export const footer = (content, css, margin) => {
  if (!content) {
    return content
  }
  return `
    <style>
      ${css}
    </style>
    <div id="pageFooter" style="margin-left: ${get(margin, 'left')}; margin-right: ${get(margin, 'right')};">
      ${content}
      <div style="clear: both;"></div>
    </div>
  `
}
