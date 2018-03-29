'use babel'

const download = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('download ...')
      resolve(123)
    }, 2000)
  })
}

const formatBytes = (bytes, decimals) => {
  if (bytes === 0) {
    return '0 Bytes'
  }
  const k = 1024
  const dm = decimals || 2
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export default download
