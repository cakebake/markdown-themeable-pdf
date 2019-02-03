'use babel'

import _convert from './api/convert'
import { writeFile } from './api/filesystem'
import { getHeader, getBody, getFooter } from './style'
import { CHARSET } from './config'

const convert = async (markdownPath, savePath, type, options) => {
  return new Promise(async (resolve, reject) => {
    try {
      const header = (type === 'pdf') ? await getHeader(markdownPath, options) : {}
      const body = await getBody(markdownPath, markdownPath, type, options)
      const footer = (type === 'pdf') ? await getFooter(markdownPath, options) : {}
      const data = await _convert(type, body, header, footer, options, CHARSET)
      const convertedFilePath = await writeFile(data, savePath, CHARSET)
      resolve(convertedFilePath)
    } catch (e) {
      reject(e)
    }
  })
}

export default convert
