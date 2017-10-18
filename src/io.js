const fse = require('fs-extra')
const {parse} = require('./parse')

const SYNTAX_AUTO = 'auto'

const parseFile = (filename, parseOptions={}, readOptions='utf8') => {
  let {syntax} = parseOptions
  if (!syntax || syntax === SYNTAX_AUTO) {
    if (filename.indexOf('.') > -1) {
      syntax = filename.split('.').pop()
    } else {
      throw new Error(
        `"auto" syntax requires a filename with an extension; got "${filename}"`
      )
    }
  }
  return fse.readFile(filename, readOptions)
    .then(content => parse(content, parseOptions))
    .then(tree => {
      tree.source = filename
      return tree
    })
}

module.exports = {
  parseFile,
}
