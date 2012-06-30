class Token
  constructor: (@style, @text) ->


  toHTML: ->
    styleStack = []
    if @style
      if @style & Style.ITALIC
        styleStack.push 'font-style:italic;'
      if @style & Style.BOLD
        styleStack.push 'font-weight:bold;'
      if @style & Style.SHADOWED
        styleStack.push 'text-shadow:1px 1px 1px rgba(0, 0, 0, 0.5);'
      if @style & Style.WIDE
        styleStack.push 'letter-spacing:.1em;font-size:105%;'
      if @style & Style.NARROW
        styleStack.push 'letter-spacing:-.1em;font-size:95%;'
      return '<span class="' + styleStack.join(' ') + '">' + @text + '</span>'
    else
      return @text