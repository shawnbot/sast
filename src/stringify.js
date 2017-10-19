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
const curlies = wrap('{', '}')

const mods = {
  'arguments': parens,
  'atkeyword': prefix('@'),
  'attributeSelector': wrap('[', ']'),
  'block': curlies,
  // NOTE: only hex values are 'color' nodes in gonzales-pe land
  'color': prefix('#'),
  'class': prefix('.'),
  'list': parens,
  'map': parens,
  'multilineComment': wrap('/*', '*/'),
  'parentheses': parens,
  'percentage': suffix('%'),
  'pseudoClass': prefix(':'),
  'pseudoElement': prefix('::'),
  'singlelineComment': prefix('//'),
  'uri': wrap('url(', ')'),
  // universal selector nodes have no content in gonzales-pe
  'universalSelector': () => ['*'],
  'variable': prefix('$'),
}

module.exports = stringify
