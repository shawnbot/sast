const invariant = require('invariant')
const is = require('unist-util-is')
const listify = require('./listify')
const mapify = require('./mapify')
const {COLON, COMMA, IDENT} = require('./constants')

const isOperator = node => is([COLON, COMMA], node)

const parentheses = node => {
  const [op] = node.children.filter(isOperator)
  if (op) {
    switch (op.value) {
      case COLON.value: return mapify(node)
      case COMMA.value: return listify(node)
    }
  }
  return node
}

const property = node => {
  const [ident] = node.children.filter(child => is(IDENT, child))
  node.name = ident ? ident.value : null
  return node
}

const transforms = {
  parentheses,
  property
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
