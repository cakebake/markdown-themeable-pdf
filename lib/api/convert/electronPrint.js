'use babel'

import { remote } from 'electron'
import { writeFile } from '../filesystem'
import { join } from 'path'

const print = (data, options) => {
  return new Promise(async (resolve, reject) => {
    try {
      const tempFilePath = await writeTempFile(data)
      const win = new remote.BrowserWindow({ show: false })
      win.loadURL('file://' + tempFilePath)
      win.webContents.on('did-finish-load', () => {
        win.webContents.printToPDF({
          marginsType: 0, // Integer - Specifies the type of margins to use. Uses 0 for default margin, 1 for no margin, and 2 for minimum margin.
          pageSize: 'A4', // String - Specify page size of the generated PDF. Can be A3, A4, A5, Legal, Letter, Tabloid or an Object containing height and width in microns.
          printBackground: true, // Boolean - Whether to print CSS backgrounds.
          landscape: false // Boolean - true for landscape, false for portrait.
        }, (e, buffer) => {
          if (e) {
            reject(e)
          } else {
            resolve(buffer)
          }
          win.destroy()
        })
      })
    } catch (e) {
      reject(e)
    }
    // @todo timeout
  })
}

const writeTempFile = (data) => writeFile(data, join(remote.app.getPath('temp'), 'markdown-themeable-pdf-temp.html'))

export default print
