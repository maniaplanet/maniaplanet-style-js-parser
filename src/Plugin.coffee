$ = jQuery

$.fn.extend
  maniaplanetStyleParse: (options) ->
    return @each ()->
      content = $(this).html();
      $(this).html MPStyle.Parser.toHTML(content)