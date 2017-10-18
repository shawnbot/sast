const is = require('unist-util-is')

module.exports = (children, separator) => {
  const slices = []
  let slice = []
  children.forEach(child => {
    if (is(separator, child)) {
      slices.push(slice)
      slice = []
    } else {
      slice.push(child)
    }
  })
  if (slice.length > 0) {
    slices.push(slice)
  }
  return slices
}
