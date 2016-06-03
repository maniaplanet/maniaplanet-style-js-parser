class LinkToken
  constructor: (@link = '') ->

  toHTML: ->
  	return '<a href="' + @link + '">'
	
exports.LinkToken = LinkToken