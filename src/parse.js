const gonzales = require('gonzales-pe')
const map = require('unist-util-map')
const transform = require('./transform')

const PARSE_DEFAULTS = {
  syntax: 'scss',
}

const parse = (source, options) => {
  const gtree = gonzales.parse(
    source,
    Object.assign({}, PARSE_DEFAULTS, options)
  )
  const tree = degonzify(gtree)
  tree.source = {}
  Object.defineProperty(tree.source, 'string', {
    enumerable: false,
    get: () => source
  })
  return unistify(tree)
}

const degonzify = src => {
  const node = {
    type: src.type,
    position: {
      start: src.start,
      end: src.end,
    }
  }
  if (Array.isArray(src.content)) {
    node.children = src.content.map(degonzify)
  } else {
    node.value = src.content
  }
  return node
}

const unistify = tree => {
  return map(tree, transform)
}

module.exports = {
  parse,
  unistify
}
