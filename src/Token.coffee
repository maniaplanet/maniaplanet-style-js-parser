class Token
  constructor: (@style, @text) ->


  toHTML: ->
    styleStack = []
    if @style
      if @style & Style.ITALIC
        styleStack.push 'font-style:italic;'
      if @style & Style.BOLD
        styleStack.push 'font-weight:bold;'
      return '<span class="' + styleStack.join(' ') + '">' + @text + '</span>'
    else
      return @text