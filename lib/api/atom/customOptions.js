'use babel'

import { existsSync } from 'fs'
import { join } from 'path'
import { getUserAtomPath, getProjectRootPathByFilePath } from './index'
import { readFile, writeFile } from '../filesystem'
import * as matter from 'gray-matter'
import { CHARSET, PACKAGE_NAME } from '../../config'

export const getMatterDelimiters = () => {
  return [
    `<!-- [${PACKAGE_NAME}] options:`,
    `--- [${PACKAGE_NAME}] options; -->`
  ]
}

export const insertOptionsToFile = (filePath, options) => {
  return new Promise(async (resolve, reject) => {
    try {
      const content = await addOptionsToContent(
        await readFile(filePath, CHARSET),
        options
      )
      await writeFile(content, filePath, CHARSET)
      resolve()
    } catch (e) {
      reject(e)
    }
  })
}

export const addOptionsToContent = (content, options) => {
  return new Promise(async (resolve, reject) => {
    try {
      content = matter.stringify(content, options, {
        delimiters: getMatterDelimiters()
      })
      resolve(content)
    } catch (e) {
      reject(e)
    }
  })
}

const getCustomConfigFilePath = (configFilePath, markdownPath) => {
  const projectRootPath = getProjectRootPathByFilePath(markdownPath)
  const projectConfigFile = join(projectRootPath, configFilePath)
  if (existsSync(projectConfigFile)) {
    return projectConfigFile
  }
  const userConfigFile = join(getUserAtomPath(), configFilePath)
  if (existsSync(userConfigFile)) {
    return userConfigFile
  }
  return null
}

export const getHeaderFilePath = (customPath, markdownPath) => getCustomConfigFilePath(customPath, markdownPath)

export const getFooterFilePath = (customPath, markdownPath) => getCustomConfigFilePath(customPath, markdownPath)

export const getCustomCssFilePath = (customPath, markdownPath) => getCustomConfigFilePath(customPath, markdownPath)
