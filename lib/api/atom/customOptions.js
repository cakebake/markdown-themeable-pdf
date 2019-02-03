'use babel'

import { existsSync } from 'fs'
import { join } from 'path'
import { getUserAtomPath, getProjectRootPathByFilePath } from './index'
import { readFile, writeFile } from '../filesystem'
import { CHARSET } from '../../config'
import { isEmpty, merge } from 'lodash'

const matter = require('gray-matter')

export const getMatterDelimiters = () => ['---', '---']

export const mergeOptionsWithFileOptions = (filePath, options) => {
  return new Promise(async (resolve) => {
    try {
      options = merge(options, await getOptionsFromFile(filePath))
    } catch (_e) {}
    resolve(options)
  })
}

export const getOptionsFromFile = (filePath) => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(getOptionsFromContent(await readFile(filePath, CHARSET)))
    } catch (e) {
      reject(e)
    }
  })
}

export const getOptionsFromContent = (content) => {
  return new Promise((resolve, reject) => {
    try {
      const data = matter(content, {
        delimiters: getMatterDelimiters()
      })
      if (isEmpty(data.data)) {
        reject(Error('Front matter is empty'))
      } else {
        resolve(data.data)
      }
    } catch (e) {
      reject(e)
    }
  })
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

export const removeOptionsFromContent = (content) => {
  return new Promise((resolve, reject) => {
    try {
      const data = matter(content, {
        delimiters: getMatterDelimiters()
      })
      content = data.content
    } catch (_e) {}
    resolve(content)
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
