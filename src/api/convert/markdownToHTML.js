'use babel'

const markdownToHTML = (markdown, isFinalFormat = false) => {
  return new Promise((resolve, reject) => {
    const html = `
      lorem ipsum
      dolor sit
    `
    resolve(html)
  })
}

export default markdownToHTML
