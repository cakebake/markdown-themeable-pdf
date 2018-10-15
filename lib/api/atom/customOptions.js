'use babel'

import { existsSync } from 'fs'
import { join } from 'path'
import { getUserAtomPath, getProjectRootPathByFilePath } from './index'

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
