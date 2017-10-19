const path = require('path')
const test = require('ava')
const select = require('unist-util-select')
const {parse, stringify} = require('..')

const fixture = (...args) => path.resolve(__dirname, 'fixtures', ...args)

const preserves = (message, strings) => {
  test(`it preserves ${message}`, t => {
    strings.forEach(str => {
      const parsed = parse(str)
      t.is(stringify(parsed), str,
           'types: ' + select(parsed, '*').map(n => n.type).join(', '))
    })
  })
}

test('it preserves anything with a value', t => {
  t.is(stringify({value: 'foo'}), 'foo')
  t.is(stringify({type: 'unknown', value: 'foo'}), 'foo')
})

preserves('variables', [
  '$foo: 1',
  '$foo-bar: 1',
])

preserves('unit values', [
  'x { height: 100%; }',
  'x { width: 100px; }',
  'x { width: 10em; }',
  'x { width: 10rem; }',
])

preserves('blocks', [
  'x { color: red; }',
  'x { color: red; y { color: blue; } }',
])

preserves('@include', [
  '@include breakpoint(md)',
  '@include breakpoint()',
  '@include breakpoint',
])

preserves('@mixin', [
  '@mixin breakpoint($size) { }',
  '@mixin breakpoint { }',
])

preserves('all manner of parentheses', [
  '$x: (1, 2)',
  '$x: (1, (2, 2, (1 + 2)))',
  '$x: (1, (2, 2, ($y + 2 * 5)))',
])

preserves('functions', [
  '$x: y(1)',
  '$x: y(z(1 + 2))',
  '$x: $y( z(1 + 2) )',
  '$x: $z( 1 + 2 )',
])

preserves('color values', [
  '$color: #f00',
  '$color: red',
  '$color: rgb(255, 0, 0)',
  '$color: rgba(255, 0, 0, 0.5)',
  '$color: rgba(#f00, 0.5)',
])

preserves('universal selectors', [
  '* { box-sizing: border-box; }',
  '* > li { list-style: none; }',
  'dl > * { list-style: none; }',
])

preserves('class selectors', [
  '.foo { }',
  '.foo.bar { }',
  'x.foo { }',
  'x.foo.bar { }',
  'x.foo .bar { }',
])

// see: <https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors>
preserves('attribute selectors', [
  '[data-foo] { }',
  'x[data-foo] { }',
  'x[data-foo=x] { }',
  'x[data-foo="x"] { }',
  'x[data-foo^="x"] { }',
  'x[data-foo*="x"] { }',
  'x[data-foo$="x"] { }',
  'x[data-foo|="x"] { }',
  // deep cuts here
  'x[data-foo=x i] { }',
  'x[data-foo="x" i] { }',
  'x[data-foo~="x" i] { }',
])

preserves('placeholders', [
  'a:hover { &:active { color: green; } }',
  'a.foo { &:hover { color: red; } }',
])

preserves('pseudo-classes', [
  'a:hover { color: red; }',
  'a:hover { &:active { color: green; } }',
  'a:-vendor-thing { color: red; }',
])

preserves('pseudo-elements', [
  'a::before { content: "hi"; }',
  'a::-vendor-thing { display: none; }',
  // browsers understand this
  'a:before { content: "hi"; }',
])

preserves('comma-separated values', [
  'x { background: red, green, blue; }',
])

preserves('URLs', [
  'a { background-url: url(foo.png); }',
  'a { background-url: url("foo.png"); }',
  "a { background-url: url('foo.png'); }",
])
