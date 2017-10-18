# sast
This is a thing that parses CSS, Sass, and SCSS into a [unist]-compatible
abstract syntax tree (AST), which makes it possible to then search and
manipulate with all of the wonderful [unist utility modules][utilities]. Most
of the heavy lifting is done by [gonzales].

## Installation
Install it with npm:

```
npm install --save sast
```

## Usage
You can `import` or `require()` the module and access [the API](#api) as its
methods, like this:

```js
// CommonJS, older versions of Node
const sast = require('sast')

// ES6/ES2016/Babel/etc.
import sast from 'sast'

const tree = sast.parse('a { color: $red; }', {syntax: 'scss'})
console.dir(tree, {depth: null})
```

or you can import just the API methods you need, like so:

```js
// CommonJS
const {parse} = require('sast')
// ES6
import {parse} from 'sast'

const tree = parse('a { color: $red; }', {syntax: 'scss'})
```

## Examples

### Get all of the top-level variable declarations
Let's say that you have a bunch of variables declared in an SCSS partial, and
you'd like to read their values programmatically so that you can use them in a
context other than CSS:

```scss
// vars.scss
$blue: #0f0;
$red: #f00;
$green: #00f;
```

```js
const {readFileSync} = require('fs')
const {parse, stringify} = require('sast')
const select = require('unist-util-select')

const scss = readFileSync('vars.scss', 'utf8')
const tree = parse(scss, {syntax: 'scss'})
const declarations = select(tree, 'stylesheet > declaration')

const vars = declarations.reduce((map, node) => {
  const key = stringify(select(node, 'property ident')[0])
  const value = stringify(select(node, 'value')[0])
  map[key] = value
  return map
}, {})

console.dir(vars)
```


## API

### `sast.parse(source [, options])`
Synchronously parse the CSS, Sass, or SCSS source text (a string) into an
abstract source tree (AST). The default syntax is CSS (`{syntax: 'css'}`);
other acceptable values are `sass`, `scss`, and `less`. See the [gonzales
docs](https://github.com/tonyganch/gonzales-pe#parameters-1) for more info.

### `sast.stringify(node)`
Format the resulting AST back into a string, presumably after manipulating it.

## Node types
Most [node types] are defined by [gonzalez-pe], the underlying parser. After
transforming each of the syntax tree nodes into [unist nodes], the following
nodes are introduced:

### Maps
Any `parentheses` node whose first `operator` is a `:` is parsed as a [Sass
map] and recast as a `map` node. The `children` are preserved, and key/value
pairs separated by `:` and delimited by `,` are placed in the `values` property
as an array of objects with `key` and `value` properties, each of which is a
plain old node list. So:

```js

```


[gonzales]: https://github.com/tonyganch/gonzales-pe
[node types]: https://github.com/tonyganch/gonzales-pe/blob/dev/docs/node-types.md
[sass map]: https://www.sitepoint.com/using-sass-maps/
[unist]: https://github.com/syntax-tree/unist
[unist nodes]: https://github.com/syntax-tree/unist#unist-nodes
[utilities]: https://github.com/syntax-tree/unist#list-of-utilities
