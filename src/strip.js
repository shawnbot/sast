const is = require('unist-util-is')

module.exports = (test, nodes) => {
  const slice = nodes.slice()
  while (slice.length && is(test, slice[0])) {
    slice.shift()
  }
  while (slice.length && is(test, slice[slice.length - 1])) {
    slice.pop()
  }
  return slice
}
