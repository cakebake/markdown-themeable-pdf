'use babel'

import { existsSync } from 'fs'
import { join } from 'path'
import { getUserAtomPath } from './index'

const getCustomConfigFilePath = (configFilePath, projectRootPath) => {
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

export const getHeaderFilePath = (customPath, projectRootPath) => getCustomConfigFilePath(customPath, projectRootPath)

export const getFooterFilePath = (customPath, projectRootPath) => getCustomConfigFilePath(customPath, projectRootPath)

export const getCustomCssFilePath = (customPath, projectRootPath) => getCustomConfigFilePath(customPath, projectRootPath)
