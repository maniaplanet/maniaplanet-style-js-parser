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

    styleStack = []

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
          when 'l', 'h', 'p'
            matches = token.match(new RegExp(/\[(.*?)\]/i))
            if (matches)
              link = matches[1]
            if linkToken?
              if text?.length
                tokens.push nextToken
                nextToken = new Token(style)
              else if tokens[tokens.length - 1] == linkToken
                delete(tokens[tokens.length - 1])
                linkToken = null
                break
              tokens.push(new LinkTokenEnd)
              linkToken = null
            else
              if text?.length
                tokens.push nextToken
                nextToken = new Token(style)
              linkToken = new LinkToken(link)
              tokens.push linkToken
          when 'z'
            style = (styleStack.length == 0 ? 0 : styleStack[styleStack.length - 1])
          when 'm'
            style = style & ~(Style.NARROW | Style.WIDE)
          when 'g'
            style = style & (styleStack.length == 0 ? ~0x1fff : (stylesStack[stylesStack.length -1] | ~0x1fff))
          when '<'
            styleStack.push style
            style = null
          when '>'
            style = styleStack.pop()
          when '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'
            hex_color = (token + '').replace(/[^a-f0-9]/gi, ''); # parse hex only
            style = style & ~0xfff;
            style = style | (Style.COLORED | (parseInt(hex_color, 16) & 0xfff))
          when '$'
            nextToken.text = '$'
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