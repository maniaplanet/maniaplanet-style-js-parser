class LinkToken

  constructor: (@manialink = false) ->
    @link = ""
    @external = false

  toHTML: ->
    if @manialink and not /^maniaplanet:/i.test(@link)
      @link = "maniaplanet://#manialink=" + @link
    if not @manialink and not /^http:/i.test(@link)
      @link = "http://" + @link

    ret = '<a href="' + @link + '"'
    if @external and not @manialink
      ret += ' target="_blank" rel="noopener noreferrer"'
    ret += ">"
    return ret

exports.LinkToken = LinkToken