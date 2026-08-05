###
Maniaplanet-style-js-parser
Copyright (C) 2012 Baptiste Lafontaine (http://magnetik.org)
See COPYING for license terms
###

{Parser} = require './Parser.coffee'

MPStyle = exports? and @ or @MPStyle = {}

MPStyle.Parser = Parser

window.MPStyle = MPStyle
