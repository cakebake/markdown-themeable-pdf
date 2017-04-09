'use babel'

import { readdirSync } from 'fs'
import { resolve, extname } from 'path'
import { ncp } from 'ncp'

export const copyCustomTemplateFiles = (cb) => {
  const dest = resolve(atom.config.configDirPath, 'markdown-themeable-pdf')
  const src = resolve(__dirname, '../../markdown-themeable-pdf')
  ncp(src, dest, { clobber: false }, (e) => {
    if (e) {
      const msg = `Custom template coul not created at ${dest}. Please copy the files manualy from ${src}`
      cb(msg)
      console.error(msg, e)
    }
  })
}

export const getHighlightJsStyles = () => {
  var files = readdirSync(resolve(__dirname, '../../node_modules/highlight.js/styles'))
  for (var i = 0; i < files.length; i++) {
    if (extname(files[i]) != '.css') {
      files.splice(i, 1)
    }
  }
  return files
}
