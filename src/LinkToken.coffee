class LinkToken
  constructor: (@link = '') ->

  toHTML: ->
  	return '<a href="' + @link + '">'