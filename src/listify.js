const split = require('./split')
const stringify = require('./stringify')
const strip = require('./strip')

const COMMA = {type: 'operator', value: ','}
const LIST = 'list'
const SPACE = 'space'

module.exports = node => {
  const values = split(node.children, COMMA)
    .map(nodes => strip(SPACE, nodes))
  return Object.assign({}, node, {
    type: LIST,
    values,
  })
}

