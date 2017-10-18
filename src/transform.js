const find = require('unist-util-find')
const invariant = require('invariant')
const listify = require('./listify')
const mapify = require('./mapify')

const COMMA = ','
const COLON = ':'

const parens = node => {
  const op = find(node, {type: 'operator'})
  invariant(
    op,
    `Expected at least one "operator" child; got: ${
      node.children.map(c => c.type).join(', ')
    }`
  )
  switch (op.value) {
    case COLON: return mapify(node)
    case COMMA: return listify(node)
  }
  return node
}

const transforms = {
  'parentheses': parens,
}

module.exports = node => {
  const transform = transforms[node.type]
  if (typeof transform === 'function') {
    return transform(node)
  }
  return node
}
