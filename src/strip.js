const is = require('unist-util-is')

module.exports = (test, nodes) => {
  while (nodes.length && is(test, nodes[0])) {
    nodes.shift()
  }
  while (nodes.length && is(test, nodes[nodes.length - 1])) {
    nodes.pop()
  }
  return nodes
}
