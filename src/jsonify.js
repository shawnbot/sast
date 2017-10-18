const is = require('unist-util-is')
const map = require('unist-util-map')
const strip = require('./strip')
const stringify = require('./stringify')
const select = require('unist-util-select')

const extraneousValueStuff = node => is(['default', 'space'], node)

const transforms = {
  'declaration': node => {
    // be lazy and just find the first ident and value nodes
    const ident = select(node, 'property ident')[0]
    const value = select(node, 'value')[0]
    return {
      name: stringify(ident),
      value: jsonify(value),
    }
  },
  'list': node => {
    return node.values.map(jsonify)
  },
  'map': node => {
    return node.values.reduce((acc, {name, value}) => {
      acc[stringify(name)] = jsonify(value)
      return acc
    }, {})
  },
  'number': node => Number(node.value),
  'value': node => {
    // strip the !default and intervening space
    strip(extraneousValueStuff, node.children)
    return node.children.length > 1
      ? stringify(node)
      : jsonify(node.children[0])
  },
}

const jsonify = node => {
  if (Array.isArray(node)) {
    throw new Error('Expected node object in jsonify(), but got Array')
  }
  const transform = transforms[node.type]
  if (typeof transform === 'function') {
    // console.warn('transforming:', node.type)
    return transform(node)
  }
  return stringify(node)
}

module.exports = jsonify
