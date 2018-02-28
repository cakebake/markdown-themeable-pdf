'use babel'

const markdownToHTML = (filePath, isFinalFormat = false) => {
  return new Promise((resolve, reject) => {
    const html = `
      lorem ipsum
      dolor sit
    `
    resolve(html)
  })
}

export default markdownToHTML
