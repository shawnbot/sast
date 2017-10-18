const inspect = require('unist-util-inspect')
const is = require('unist-util-is')
const split = require('./split')
const strip = require('./strip')
const stringify = require('./stringify')

const COMMA = {type: 'operator', value: ','}
const COLON = {type: 'operator', value: ':'}
const MAP = 'map'
const SPACE = 'space'

module.exports = node => {
  return Object.assign({}, node, {
    type: MAP,
    values: split(node.children, COMMA)
      .map(part => {
        const [key, value] = split(part, COLON)
          .map(d => strip(SPACE, d))
        return {key, value}
      }),
  })
}
