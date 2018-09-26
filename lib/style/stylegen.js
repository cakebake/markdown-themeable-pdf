var sass = require('node-sass')
var fs = require('fs')
var path = require('path')

var modulesPath = path.join(__dirname, '..', '..', 'node_modules')
var scssPath = path.join(__dirname, 'scss')
var cssPath = path.join(__dirname, 'css', 'public')

var output = function (e, result) {
  if (e) {
    console.log(e.status)
    console.log(e.column)
    console.log(e.message)
    console.log(e.line)
    throw e
  }
  console.log(result.stats)
  console.log(JSON.stringify(result.map))
  fs.writeFile(path.join(cssPath, 'default.css'), result.css, function (e) {
    if (e) {
      throw e
    }
  })
}

sass.render({
  file: path.join(scssPath, 'default.scss'),
  outputStyle: 'compact',
  includePaths: [ modulesPath ]
}, output)
