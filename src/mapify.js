const inspect = require('unist-util-inspect')
const invariant = require('invariant')
const is = require('unist-util-is')
const split = require('./split')
const strip = require('./strip')
const stringify = require('./stringify')
const {COLON, COMMA, MAP, PARENS, SPACE} = require('./constants')

module.exports = node => {
  invariant(node.type === PARENS, `Expected a ${PARENS} node, but got "${node.type}"`)
  return Object.assign(node, {
    type: MAP,
    values: split(node.children, COMMA)
      .map(part => {
        const [[name], [value]] = split(part, COLON)
          .map(d => strip(SPACE, d))
        return {
          type: 'name-value',
          name,
          value: value,
          children: part
        }
      }),
  })
}
