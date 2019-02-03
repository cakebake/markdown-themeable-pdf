'use babel'

import { join, dirname } from 'path'
import { readdirSync } from 'fs'
import { getFileExt } from '../api/filesystem'
import { startCase, replace } from 'lodash'

let _styles = []

export const getHighlightJsStyles = () => {
  if (!_styles.length) {
    const dirFiles = readdirSync(getHighlightJsStylesPath())
    for (let i = 0; i < dirFiles.length; i++) {
      if (getFileExt(dirFiles[i]) === '.css') {
        _styles.push(dirFiles[i])
      }
    }
  }
  return _styles
}

export const formatHighlightJsName = (cssFileName) => startCase(replace(cssFileName, '.css', ''))

export const getHighlightJsStylePathByName = (fileName) => join(getHighlightJsStylesPath(), fileName)

const getHighlightJsStylesPath = () => join(dirname(require.resolve('highlight.js')), '..', 'styles')
