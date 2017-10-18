const invariant = require('invariant')
const split = require('./split')
const stringify = require('./stringify')
const strip = require('./strip')
const {COLON, COMMA, LIST, PARENS, SPACE} = require('./constants')

module.exports = node => {
  invariant(node.type === PARENS, `Expected a ${PARENS} node, but got "${node.type}"`)
  const values = split(node.children, COMMA)
    .map(nodes => {
      return {
        type: 'value',
        children: strip(SPACE, nodes)
      }
    })
  return Object.assign(node, {
    type: LIST,
    values,
  })
}

