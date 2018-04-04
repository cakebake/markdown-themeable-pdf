'use babel'

import _convert from './api/convert'
import { get } from 'lodash'
import { writeFile } from './api/filesystem'
import { getProjectRootPathByFilePath } from './api/atom'
import { getBodyCss, getHeader, getBody, getFooter } from './theme'
import { CHARSET } from './config'

const convert = async (markdownPath, savePath, type, options) => {
  return new Promise(async (resolve, reject) => {
    try {
      const projectRootPath = getProjectRootPathByFilePath(markdownPath)
      const header = (type === 'pdf') ? await getHeader(projectRootPath) : {}
      const body = await getBody(markdownPath)
      const footer = (type === 'pdf') ? await getFooter(projectRootPath) : {}
      const css = await getBodyCss(projectRootPath, type)
      const data = await _convert(
        get(body, 'template', null),
        type,
        options,
        css,
        get(header, 'template', null),
        get(footer, 'template', null),
        savePath,
        get(body, 'basePath', null),
        get(header, 'basePath', null),
        get(footer, 'basePath', null),
        CHARSET
      )
      const convertedFilePath = await writeFile(data, savePath, CHARSET)
      resolve(convertedFilePath)
    } catch (e) {
      reject(e)
    }
  })
}

export default convert
