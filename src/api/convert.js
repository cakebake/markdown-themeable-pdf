'use babel'

import { parse } from 'path'
import { configCollection, notification } from './atom'

const convert = (filePath) => {
  if (!filePath) {
    notification('Could not get file path', 'error')
  } else {
    const options = {
      filePath,
      fileInfo: parse(filePath),
      ...configCollection([
        'exportFileType'
      ])
    }
    notification(`Start converting ${options.fileInfo.base} to ${options.exportFileType}`)
    console.log(options)
  }
}

export default convert
