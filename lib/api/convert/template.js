'use babel'

import { load } from 'cheerio'
import { CHARSET } from '../convert'
import { getCustomConfigFilePath } from '../filesystem'
import { getConfig } from '../atom'

const template = (content, title, htmlIsFinalFormat, filePath) => {
  return new Promise((resolve, reject) => {
    const html = build(content, title, htmlIsFinalFormat, filePath)
    resolve(html)
  })
}

const build = (content, title, htmlIsFinalFormat, filePath) => {
  const $ = load(`<main id="pageContent">${content}</main>`)
  $('head')
    .append(`<meta charset="${CHARSET}">`)
    .append(`<title>${title}</title>`)
    .append(getStyle(filePath))
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

const getStyle = (filePath) => {
  let style = 'html, body { color: green }'
  // const files = [
  //   '../../css/document.css',
  //   getCustomStylesheetPath(filePath)
  // ]
  // console.log(files);
  return `<style>${style}</style>`
}

const getCustomStylesheetPath = (filePath) => getCustomConfigFilePath(getConfig('customStylesPath'), filePath)

export default template
