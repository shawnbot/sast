const select = require('unist-util-select')
const invariant = require('invariant')
const is = require('unist-util-is')
const listify = require('./listify')
const mapify = require('./mapify')
const {COLON, COMMA} = require('./constants')

const isOperator = node => is([COLON, COMMA], node)

const parens = node => {
  const op = node.children.filter(isOperator)[0]
  invariant(
    op,
    `Expected at least one "operator" child; got: ${
      node.children.map(c => c.type).join(', ')
    }`
  )
  switch (op.value) {
    case COLON.value: return mapify(node)
    case COMMA.value: return listify(node)
  }
  return node
}

const transforms = {
  'parentheses': parens,
}

module.exports = node => {
  const {type} = node
  const transform = transforms[type]
  if (typeof transform === 'function') {
    node = transform(node)
    return node
  }
  return node
}
