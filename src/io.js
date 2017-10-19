const fse = require('fs-extra')
const {parse} = require('./parse')

const SYNTAX_AUTO = 'auto'

const parseFile = (filename, parseOptions={}, readOptions='utf8') => {
  let {syntax} = parseOptions
  if (!syntax || syntax === SYNTAX_AUTO) {
    if (filename.indexOf('.') > -1) {
      parseOptions.syntax = filename.split('.').pop()
      // console.warn('detected auto syntax:', syntax)
    } else {
      throw new Error(
        `"auto" syntax requires a filename with an extension; got "${filename}"`
      )
    }
  }
  return fse.readFile(filename, readOptions)
    .then(content => parse(content, parseOptions))
    .then(tree => {
      // the path is immutable, so define it with a getter
      Object.defineProperty(tree.source, 'path', {
        get: () => filename
      })
      return tree
    })
}

module.exports = {
  parseFile,
}
