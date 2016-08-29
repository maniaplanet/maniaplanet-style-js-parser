class LinkToken

  constructor: (@manialink = false, @link = "") ->

  toHTML: ->
    if @manialink and not /^maniaplanet:/i.test(@link)
      @link = "maniaplanet://#manialink=" + @link
    if not @manialink and not /^http:/i.test(@link)
      @link = "http://" + @link
    return '<a href="' + @link + '">'
	
exports.LinkToken = LinkToken