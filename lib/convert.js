'use babel'

import _convert from './api/convert'
import { writeFile } from './api/filesystem'
import { getProjectRootPathByFilePath } from './api/atom'
import { getHeader, getBody, getFooter } from './theme'
import { CHARSET } from './config'

const convert = async (markdownPath, savePath, type, options) => {
  return new Promise(async (resolve, reject) => {
    try {
      const projectRootPath = getProjectRootPathByFilePath(markdownPath)
      const header = (type === 'pdf') ? await getHeader(projectRootPath) : {}
      const body = await getBody(markdownPath, projectRootPath, type)
      const footer = (type === 'pdf') ? await getFooter(projectRootPath) : {}
      const data = await _convert(type, savePath, body, header, footer, options, CHARSET)
      const convertedFilePath = await writeFile(data, savePath, CHARSET)
      resolve(convertedFilePath)
    } catch (e) {
      reject(e)
    }
  })
}

export default convert
