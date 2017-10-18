const path = require('path')
const test = require('ava')
const visit = require('unist-util-visit')
const {parse, stringify} = require('..')

const fixture = (...args) => path.resolve(__dirname, 'fixtures', ...args)

test('it preserves anything with a value', t => {
  t.is(stringify({value: 'foo'}), 'foo')
  t.is(stringify({type: 'unknown', value: 'foo'}), 'foo')
})

test('it preserves color values', t => {
  [
    '$color: #f00',
    '$color: red',
    '$color: rgb(255, 0, 0)',
    '$color: rgba(255, 0, 0, 0.5)',
    '$color: rgba(#f00, 0.5)',
  ].forEach(scss => {
    t.is(stringify(parse(scss)), scss)
  })
})
