'use babel'

import { get, startsWith } from 'lodash'
import { sep } from 'path'
import { config, PACKAGE_NAME } from '../../config'

export const openInWorkspace = (fullPath) => atom.workspace.open(fullPath, { searchAllPanes: true })

export const isPackageLoaded = (name) => atom.packages.isPackageLoaded(name)

export const observeTextEditors = (callback) => atom.workspace.observeTextEditors(callback)

export const addCommand = (scope, commands) => atom.commands.add(scope, commands)

export const getActiveTextEditor = () => atom.workspace.getActiveTextEditor()

export const getUserAtomPath = () => atom.getConfigDirPath()

export const isSpec = () => typeof jasmine !== 'undefined'

export const getProjectRootPathByFilePath = (filePath) => {
  if (isSpec()) {
    return atom.packages.resolvePackagePath(PACKAGE_NAME)
  }
  const projectPaths = atom.project.getPaths()
  let path
  for (var i = 0; i < projectPaths.length; i++) {
    if (startsWith(filePath, projectPaths[i] + sep)) {
      path = projectPaths[i]
    }
  }
  if (!path) {
    path = projectPaths[0]
  }
  return path
}

export const getConfig = (key, loadDefault = false) => {
  const definition = config()
  const configGroup = getConfigGroup(key, definition)
  if (!configGroup) {
    return undefined
  }
  if (!loadDefault) {
    const setting = atom.config.get(`${PACKAGE_NAME}.${configGroup}.${key}`)
    if (typeof setting !== 'undefined') {
      return setting
    }
  }
  return get(definition, `${configGroup}.properties.${key}.default`)
}

export const setConfig = (key, value) => {
  const configGroup = getConfigGroup(key)
  if (configGroup) {
    atom.config.set(`${PACKAGE_NAME}.${configGroup}.${key}`, value)
  }
}

const getConfigGroup = (key, definition) => {
  for (const configGroup in definition) {
    for (const configOption in definition[configGroup].properties) {
      if (configOption === key) {
        return configGroup
      }
    }
  }
  return null
}
