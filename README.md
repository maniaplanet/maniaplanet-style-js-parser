[![Build Status](https://travis-ci.org/maniaplanet/maniaplanet-style-js-parser.svg?branch=master)](https://travis-ci.org/maniaplanet/maniaplanet-style-js-parser)

# ManiaPlanet Style parser

JavaScript port of ManiaLib's PHP style parser.

It supports : `$i`, `$o`, `$s`, `$w`, `$m`, `$g`, `$n`, `$<`, `$>`, `$l` (for links like `$l[http://maniaplanet.org]maniaplanet$l`) and colors (`$f20` for instance). 

Live demo : https://maniaplanet.github.io/maniaplanet-style-js-parser/

## Build

### Requirements

As compiled file are JavaScript, you can use it with any JavaScript interpreter. It's tested with latest [node.js](http://www.nodejs.org).

### Installation

A CakeFile is used in order to generate all required files.

Just type `npm run build` and the file `bin/mp-style-parser.js` will be generated to be used in browsers.

## Usage

In you web applications, include the script via: `<script src="https://maniaplanet.github.io/maniaplanet-style-js-parser/bin/mp-style-parser.js"></script>`

Then you can use it by doing: `MPStyle.Parser.toHTML('$o foo $i bar');`

You can add options by passing an object to the `toHTML` function. Here's a complete example of all possible options and their default values:

```js
var html = MPStyle.Parser.toHTML(text, {
  disableLinks: false,
  externalLinks: false,
  lightBackground: false,
});
```

## Tests

You can run test by doing: `npm test`

## License

Licensed under the GNU Lesser General Public License Version 3 (LGPLV3)

