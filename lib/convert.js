'use babel'

import _convert from './api/convert'
import { writeFile } from './api/filesystem'
import { getHeader, getBody, getFooter } from './style'
import { CHARSET } from './config'

const convert = async (markdownPath, savePath, type, options) => {
  return new Promise(async (resolve, reject) => {
    try {
      await validate(type)
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

const validate = (type) => {
  return new Promise((resolve, reject) => {
    if (type === 'html' || type === 'pdf' || type === 'png' || type === 'jpeg') {
      resolve(`Valid convert type ${type}`)
    } else {
      reject(Error(`Invalid convert type ${type}`))
    }
  })
}

export default convert
