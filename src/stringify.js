const invariant = require('invariant')

const stringify = node => {
  invariant(node, 'You must provide a node to stringify()')

  if (Array.isArray(node)) {
    throw new Error('Expected node object in stringify(), but got Array')
  }

  if (node.children) {
    let buffer = node.children
      .reduce((b, c) => b.concat(stringify(c)), [])
    if (node.type in mods) {
      buffer = mods[node.type](buffer, node)
    }
    return buffer.join('')
  }
  return String(node.value)
}

const wrap = (before, after) => b => [before, ...b, after]
const prefix = str => b => [str, ...b]
const suffix = str => b => [...b, str]
const parens = wrap('(', ')')

const mods = {
  'list': parens,
  'map': parens,
  'parentheses': parens,
  'variable': prefix('$'),
}

module.exports = stringify
