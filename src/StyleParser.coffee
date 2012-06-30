class StyleParser
  constructor: () ->

  @toHTML: (text) ->
    return (tokens.toHTML() for tokens in @parse(text)).join('')


  @parse: (text) ->
    style = 0

    pattern = /(\$(?:[0-9a-f][^\$]{0,2}|[lhp](?:\[.*?\])?|.))/
    rawTokens = text.split(pattern)

    tokens = []

    nextToken = new Token

    for idx, token of rawTokens
      code = token[0]

      if (code is '$')
        switch token[1]
          when 'i'
            style = style ^ Style.ITALIC
          when 'o'
            style = style ^ Style.BOLD
          when 's'
            style = style ^ Style.SHADOWED
          when 'w'
            style = style | Style.WIDE
            style = style & ~Style.NARROW
          when 'n'
            style = style | Style.NARROW
            style = style & ~Style.WIDE
          when 'm'
            style = style & ~(Style.NARROW | Style.WIDE)
          # Other may come in the future       :)
        if style isnt token.style
          if text?.length
            tokens.push nextToken
            nextToken = new Token(style)
          else
            nextToken.style = style
      else
        nextToken.text = token

    if text?.length
      tokens.push nextToken

    return tokens




console.log StyleParser.toHTML("Test $f20woo $olol $iyay")
