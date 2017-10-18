const invariant = require('invariant')

const stringify = (node, depth=0) => {
  invariant(node, 'You must provide a node to stringify()')
  // const indent = '  '.repeat(depth)
  // console.warn(indent, 'stringify', node.type)

  if (Array.isArray(node)) {
    throw new Error('Expected node object in stringify(), but got Array')
  }

  let buffer
  if (node.children) {
    buffer = node.children
      .reduce((buff, child) => buff.concat(stringify(child, depth + 1)), [])
  } else {
    buffer = [node.value]
  }

  const mod = mods[node.type]
  if (typeof mod === 'function') {
    buffer = mod(buffer, node)
  } else {
    // console.warn(indent, `no buffer mod for "${node.type}"`)
  }
  return buffer.join('')
}

// higher order buffer manipulation functions
const wrap = (before, after) => b => [before, ...b, after]
const prefix = str => b => [str, ...b]
const suffix = str => b => [...b, str]
const parens = wrap('(', ')')

const mods = {
  // NOTE: colors are only hex colors in gonzales-pe land
  'color': prefix('#'),
  // functions get their parentheses back
  'function': ([name, ...args]) => [name, '(', ...args, ')'],
  'list': parens,
  'map': parens,
  'parentheses': parens,
  'variable': prefix('$'),
}

module.exports = stringify
