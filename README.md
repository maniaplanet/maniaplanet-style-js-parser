#ManiaPlanet Style parser

JavaScript port of ManiaLib's PHP style parser.

It supports : `$i`, `$o`, `$s`, `$w`, `$m`, `$g`, `$n`, `$<`, `$>`, $l (for links like `$l[http://magnetik.org]magnetik$l`) and colors (`$f20` for instance). 

Live demo : http://magnetik.github.com/maniaplanet-style-js-parser/

##Build

###Requirements

As compiled file are JavaScript, you can use it with any JavaScript interpreter. It's tested with latest [node.js](http://www.nodejs.org).

###Installation

A CakeFile is used in order to generate all required files.

Just type `cake build` and the file `build/mp-style-parser.js` will be generated. You can use it in any project.

##Usage

In your javascript application just do `MPStyle.Parser.toHTML('$o foo $i bar');`

In web projects : `<script src="https://raw.github.com/magnetik/maniaplanet-style-js-parser/master/bin/mp-style-parser.js"></script>`

##License

