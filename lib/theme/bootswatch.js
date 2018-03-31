'use babel'

import { join } from 'path'
import { readdirSync } from 'fs'

let _themes = []

export const getBootswatchThemes = () => {
  if (!_themes.length) {
    _themes = readdirSync(getBootswatchThemesBasePath())
  }
  return _themes
}

export const getBootswatchThemePathByName = (dirName) => join(getBootswatchThemesBasePath(), dirName, 'bootstrap.css')

const getBootswatchThemesBasePath = () => join(__dirname, '..', '..', 'node_modules', 'bootswatch', 'dist')
