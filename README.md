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

## API

### `sast.parse(source [, options])` <a name="parse"></a>
Synchronously parse the CSS, Sass, or SCSS source text (a string) into an
abstract source tree (AST). The default syntax is CSS (`{syntax: 'css'}`);
other acceptable values are `sass`, `scss`, and `less`. See the [gonzales
docs](https://github.com/tonyganch/gonzales-pe#parameters-1) for more info. To
parse files by path, use [`parseFile()`](#parse-file).

### `sast.stringify(node)` <a name="stringify"></a>
Format the resulting AST back into a string, presumably after manipulating it.

### `sast.jsonify(node)` <a name="jsonify"></a>
Coerce the given AST node into JSON data, according to the following rules:

1. Numbers are numbers: `1` -> `1`, not `"1"`.
1. Lists become arrays: `(a, 1)` -> `["a", 1]`
1. [Maps][Sass maps] become objects: `(x: 1)` -> `{x: 1}`
1. Lists and maps can be nested!
1. Everything else is [stringified](#stringify), and _should_ be preserved in
   its original form:
   * Sass/SCSS variables should preserve their leading `$`.
   * Hex colors should preserve their leading `#`.
   * `rgb()`, `rgba()`, `hsl()`, `hsla()`, and any other functions should
     preserve their parentheses.
   * Parentheses that are not parsed as lists or maps should be preserved.

### `sast.parseFile(filename [, parseOptions={} [, readOptions='utf8'])` <a name="parse-file"></a>
Read a file and parse its contents, returning a Promise. If no
`parseOptions.syntax` is provided, or its value is `auto`, the filename's
extension will be used as the `syntax` option passed to [`parse()`](#parse).

```js
const {parseFile} = require('sast')
parseFile('path/to/some.scss')
  .then(tree => console.dir(tree, {depth: null}))
  .catch(error => console.error('Parse error:', error))
```

## CLI
The `sast` [npm package] comes with two command line utilities:

### `sast-parse`
Parses a file or stdin as a given syntax, applies one or more simplifying
transformations, then outputs the resulting syntax tree in a variety of
formats:

* JSON: the raw syntax tree in object form, which can be passed to other CLIs.
* [YAML]: an easier-to-read alternative to JSON, also suitable for piping to
  other CLIs.
* Tree: a text representation of the syntax tree provided by
  [unist-util-inspect](https://github.com/syntax-tree/unist-util-inspect).
* Text: the [stringified](#stringify) syntax tree, which is hopefully valid for
  the given syntax.

Run `sast-parse --help` for available options.

### `sast-data`
Parses one or more SCSS (the only supported syntax at this time) files, and
transforms all top-level variable declarations into key-value pairs. The result
is a JSON object in which each key is a variable name, and the value is the
[jsonified](#jsonify) variable value.

This is useful for generating [design tokens] from existing SCSS variables if
you don't have the ability to go in the other direction.

Run `sast-data --help` for available options and more information.

## Node types
Most [node types] are defined by [gonzalez-pe], the underlying parser. After
transforming each of the syntax tree nodes into [unist nodes], the following
nodes are introduced:

### Maps
Any `parentheses` node whose first `operator` child is a `:` is interpreted as
a [Sass map] and recast as a `map` node. The `children` are preserved as-is,
and key/value pairs separated by `:` and delimited by `,` are placed in the
`values` property as an array of objects with `key` and `value` properties,
each of which is a plain old node list. Some examples:

* `(x: 1)` will be [jsonified](#jsonify) as `{x: 1}`
* `(x: a, y: 2)` will be interpreted as `{x: "a", y: 2}`

### Lists
Any `parentheses` node whose first `operator` child is a `,` is interpreted as
a list (array) and recast as a `list` node. The `children` are perserved as-is,
and children that aren't `space` nodes are split into subgroups by each `,`
operator and converted into `value` nodes with one or more children, then
placed in the `values` property of the `list` node. Some examples:

* `(1, x)` will be [jsonified](#jsonify) as `[1, "x"]`
* `(a, (b, c))` will be intepreted as `["a", ["b", "c"]]`


[gonzales]: https://github.com/tonyganch/gonzales-pe
[node types]: https://github.com/tonyganch/gonzales-pe/blob/dev/docs/node-types.md
[sass map]: https://www.sitepoint.com/using-sass-maps/
[unist]: https://github.com/syntax-tree/unist
[unist nodes]: https://github.com/syntax-tree/unist#unist-nodes
[utilities]: https://github.com/syntax-tree/unist#list-of-utilities
[npm package]: https://npmjs.com/package/sast
[YAML]: https://en.wikipedia.org/wiki/YAML
