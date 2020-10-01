{Token} = require './Token.coffee'
{Style} = require './Style.coffee'
{LinkTokenEnd} = require './LinkTokenEnd.coffee'
{LinkToken} = require './LinkToken.coffee'

class Parser
  constructor: (text) ->
    return @toHTML text

  @toHTML: (text, options) ->
    @options =
      disableLinks: options.disableLinks
    return (tokens.toHTML() for tokens in @parse(text)).join('')

  @parse: (text) ->
    isCode = false
    isQuickLink = false
    isPrettyLink = false

    style = 0
    tokens = []
    styleStack = []
    nextToken = new Token
    nextLinkToken = null
    linkLevel = 0

    endLink = () ->
      if nextToken.text isnt ''
        tokens.push nextToken
        nextToken = new Token style
        tokens.push new LinkTokenEnd
      else if tokens[tokens.length - 1] is nextLinkToken
        tokens.pop()
      else
        tokens.push new LinkTokenEnd

      nextLinkToken = null
      isQuickLink = false
      isPrettyLink = false

    endText = (force = false) ->
      if force or style != nextToken.style
        if nextToken.text isnt ''
          tokens.push nextToken
          nextToken = new Token(style)
        else
          nextToken.style = style

    for c, index in text.split ''
      if isCode is true
        tok = c.toLowerCase()
        switch tok
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
            if nextLinkToken?
              endLink()
            else
              endText true
              nextLinkToken = new LinkToken(tok is "h")
              if !@options.disableLinks
                tokens.push nextLinkToken
              isQuickLink = true
              isPrettyLink = true
              linkLevel = styleStack.length

          when 'z'
            style = (styleStack.length is 0 ? 0 : styleStack[styleStack.length - 1])
            if nextLinkToken?
              endLink(true)
          when 'm'
            style = style & ~(Style.NARROW | Style.WIDE)
          when 'g'
            style = style & (styleStack.length == 0 ? ~0x1fff : (stylesStack[stylesStack.length -1] | ~0x1fff))
          when '<'
            styleStack.push style
          when '>'
            if styleStack.length isnt 0
              style = styleStack.pop()
              if nextLinkToken? and linkLevel > styleStack.length
                endLink()
          when '$'
            nextToken.text += '$'
          else
            #This must be a color code, verifying it
            if /[a-f0-9]/i.test(c)
              color = c
        endText()
        isCode = false

      #We detect a code start
      else if c is '$'
        isCode = true
        if isQuickLink and isPrettyLink
          isPrettyLink = false

      #If we had detected a color code after a code start
      else if color?
        endColor = false
        addChar = false

        if /[a-f0-9]/i.test(c)
          color += c.replace(/[^a-f0-9]/gi, '0')
          endColor = color.length is 3
        else
          color += '0' for i in [0 ... 3 - color.length]
          endColor = true
          addChar = true

        if endColor
          style = style & ~0xfff;
          style = style | Style.COLORED | (parseInt(color, 16) & 0xfff)
          endText() #force end string
          color = null

          if addChar
          	nextToken.text += c

      else if isQuickLink and isPrettyLink
        if c is '['
          isQuickLink = false
        else
          isPrettyLink = false
          nextToken.text += c
          nextLinkToken.link += c

      else if isPrettyLink
        if c is ']'
          isPrettyLink = false
        else
          nextLinkToken.link += c

      else
        nextToken.text += c
        if isQuickLink
          nextLinkToken.link += c

    if nextToken.text isnt ''
      tokens.push nextToken
   
    if nextLinkToken? and !@options.disableLinks
      tokens.push new LinkTokenEnd

    return tokens
    
exports.Parser = Parser
