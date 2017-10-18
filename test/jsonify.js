const path = require('path')
const test = require('ava')
const visit = require('unist-util-visit')
const {parse, jsonify} = require('..')

const fixture = (...args) => path.resolve(__dirname, 'fixtures', ...args)

test('it preserves anything with a value', t => {
  t.is(jsonify({value: 'foo'}), 'foo')
  t.is(jsonify({type: 'unknown', value: 'foo'}), 'foo')
})

test('it transforms lists to arrays', t => {
  visit(parse('$foo: (a, 1)'), 'list', list => {
    t.deepEqual(jsonify(list), ['a', 1])
    t.pass()
  })
})

test('it transforms map to objects', t => {
  visit(parse('$foo: (a: 1, b: 2)'), 'map', map => {
    t.deepEqual(jsonify(map), {a: 1, b: 2})
    t.pass()
  })
})

test('it transforms lists in maps', t => {
  visit(parse('$foo: (a: (1, 2))'), 'map', map => {
    t.deepEqual(jsonify(map), {a: [1, 2]})
    t.pass()
  })
})

test('it transforms maps in lists', t => {
  visit(parse('$foo: ((a: 1), (b: 2))'), 'list', list => {
    t.deepEqual(jsonify(list), [{a: 1}, {b: 2}])
    t.pass()
  })
})
